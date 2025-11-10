import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { patientValidator } from "../schema/patient";

export const create = mutation({
  args: patientValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const mrn = `MRN${timestamp}${random}`;

    const patientId = await ctx.db.insert("patients", {
      ...args,
      mrn,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: identity.subject,
    });

    return patientId;
  },
});

export const update = mutation({
  args: {
    id: v.id("patients"),
    ...patientValidator,
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

export const get = query({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("patients");

    if (args.search) {
      const patients = await query.collect();
      return patients.filter(patient => 
        patient.firstName.toLowerCase().includes(args.search!.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(args.search!.toLowerCase()) ||
        patient.mrn.includes(args.search!) ||
        patient.phone.includes(args.search!)
      ).slice(0, args.limit || 50);
    }

    return await query.order("desc").take(args.limit || 50);
  },
});

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const patients = await ctx.db
      .query("patients")
      .order("desc")
      .collect();

    return patients.filter(patient => 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(args.query.toLowerCase()) ||
      patient.mrn.includes(args.query) ||
      patient.phone.includes(args.query)
    );
  },
});