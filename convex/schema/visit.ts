import { v } from "convex/values";
import { visitStatus } from "./types";

export const visitFields = {
  patientId: v.id("patients"),
  providerId: v.id("staff"),
  appointmentId: v.optional(v.id("appointments")),
  type: v.string(),
  status: visitStatus,
  chiefComplaint: v.string(),
  vitals: v.object({
    bloodPressure: v.optional(v.string()),
    heartRate: v.optional(v.number()),
    temperature: v.optional(v.number()),
    respiratoryRate: v.optional(v.number()),
    oxygenSaturation: v.optional(v.number()),
    weight: v.optional(v.number()),
    height: v.optional(v.number()),
    bmi: v.optional(v.number()),
  }),
  soap: v.object({
    subjective: v.optional(v.string()),
    objective: v.optional(v.string()),
    assessment: v.optional(v.string()),
    plan: v.optional(v.string()),
  }),
  diagnoses: v.array(v.string()),
  medications: v.array(v.object({
    medication: v.string(),
    dosage: v.string(),
    frequency: v.string(),
    duration: v.string(),
    instructions: v.optional(v.string()),
  })),
  startTime: v.number(),
  endTime: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.string(),
};

export const visitValidator = v.object(visitFields);