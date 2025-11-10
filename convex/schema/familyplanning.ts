import { v } from "convex/values";

export const familyPlanningFields = {
  patientId: v.id("patients"),
  visitDate: v.string(),
  method: v.string(),
  methodDetails: v.optional(v.string()),
  sideEffects: v.array(v.string()),
  assessment: v.string(),
  nextVisit: v.optional(v.string()),
  createdBy: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const familyPlanningValidator = v.object(familyPlanningFields);