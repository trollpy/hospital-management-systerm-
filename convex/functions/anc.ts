import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const ancVisits = defineTable({
  patientId: v.id("patients"),
  visitNumber: v.number(),
  visitDate: v.string(),
  gestationalAge: v.number(),
  bloodPressure: v.string(),
  weight: v.number(),
  fundalHeight: v.number(),
  fetalHeartRate: v.number(),
  urineTest: v.optional(v.string()),
  hbLevel: v.optional(v.number()),
  notes: v.optional(v.string()),
  nextVisitDate: v.string(),
  providerId: v.id("staff"),
  createdAt: v.number(),
}).index("by_patient", ["patientId"]);

export const createVisit = mutation({
  args: {
    patientId: v.id("patients"),
    visitNumber: v.number(),
    visitDate: v.string(),
    gestationalAge: v.number(),
    bloodPressure: v.string(),
    weight: v.number(),
    fundalHeight: v.number(),
    fetalHeartRate: v.number(),
    nextVisitDate: v.string(),
    providerId: v.id("staff"),
  },
  handler: async (ctx, args) => {
    const visitId = await ctx.db.insert("ancVisits", {
      ...args,
      createdAt: Date.now(),
    });

    return visitId;
  },
});

export const getPatientVisits = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ancVisits")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

export const getRecentVisits = query({
  args: {},
  handler: async (ctx) => {
    const visits = await ctx.db.query("ancVisits").order("desc").collect();
    return visits.slice(0, 10);
  },
});