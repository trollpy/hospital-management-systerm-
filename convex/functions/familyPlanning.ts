import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { familyPlanningValidator } from "../schema/familyplanning";

export const createVisit = mutation({
  args: familyPlanningValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const visitId = await ctx.db.insert("familyPlanning", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return visitId;
  },
});

export const getVisitsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("familyPlanning")
      .withIndex("by_patient_id", q => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});