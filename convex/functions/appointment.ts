import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { appointmentValidator } from "../schema/appointment";

export const create = mutation({
  args: appointmentValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const appointmentId = await ctx.db.insert("appointments", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: identity.subject,
    });

    return appointmentId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("appointments"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no-show")
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
      .query("appointments")
      .withIndex("by_patient_id", q => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

export const getByProvider = query({
  args: { providerId: v.id("staff") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_provider_id", q => q.eq("providerId", args.providerId))
      .order("desc")
      .collect();
  },
});

export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await ctx.db
      .query("appointments")
      .order("desc")
      .collect();

    return appointments.filter(apt => 
      apt.scheduledAt.startsWith(today)
    );
  },
});