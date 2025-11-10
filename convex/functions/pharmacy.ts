import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { prescriptionValidator } from "../schema/pharmacy";

export const createPrescription = mutation({
  args: prescriptionValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const prescriptionId = await ctx.db.insert("prescriptions", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return prescriptionId;
  },
});

export const updatePrescriptionStatus = mutation({
  args: {
    id: v.id("prescriptions"),
    status: v.union(
      v.literal("prescribed"),
      v.literal("dispensed"),
      v.literal("cancelled"),
      v.literal("completed")
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

export const getPrescriptionsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prescriptions")
      .withIndex("by_patient_id", q => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});