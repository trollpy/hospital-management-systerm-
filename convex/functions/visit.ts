import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { visitValidator } from "../schema/visit";

export const create = mutation({
  args: visitValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const visitId = await ctx.db.insert("visits", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: identity.subject,
    });

    return visitId;
  },
});

export const update = mutation({
  args: {
    id: v.id("visits"),
    ...visitValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { id, ...data } = args;
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("visits"),
    status: v.union(
      v.literal("triaged"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("admitted"),
      v.literal("discharged")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const getByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visits")
      .withIndex("by_patient_id", q => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

export const getActiveVisits = query({
  args: {},
  handler: async (ctx) => {
    const visits = await ctx.db
      .query("visits")
      .withIndex("by_status", q => q.eq("status", "in-progress"))
      .order("desc")
      .collect();

    return visits;
  },
});

export const getTodayVisits = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const visits = await ctx.db
      .query("visits")
      .withIndex("by_start_time", q => q.gte("startTime", today.getTime()))
      .order("desc")
      .collect();

    return visits.filter(visit => visit.startTime < tomorrow.getTime());
  },
});