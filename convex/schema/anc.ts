import { v } from "convex/values";

export const ancFields = {
  patientId: v.id("patients"),
  visitDate: v.string(),
  gestationalAge: v.number(),
  bloodPressure: v.string(),
  weight: v.number(),
  fundalHeight: v.optional(v.number()),
  fetalHeartRate: v.optional(v.number()),
  presentation: v.optional(v.string()),
  urineTest: v.optional(v.string()),
  hb: v.optional(v.number()),
  bloodSugar: v.optional(v.number()),
  complaints: v.array(v.string()),
  assessment: v.string(),
  plan: v.string(),
  nextVisit: v.string(),
  createdBy: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const ancValidator = v.object(ancFields);