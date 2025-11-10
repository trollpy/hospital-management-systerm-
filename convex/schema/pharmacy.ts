import { v } from "convex/values";
import { prescriptionStatus } from "./types";

export const prescriptionFields = {
  patientId: v.id("patients"),
  visitId: v.optional(v.id("visits")),
  prescribedBy: v.id("staff"),
  medications: v.array(v.object({
    medicationId: v.id("inventory"),
    name: v.string(),
    dosage: v.string(),
    form: v.string(),
    frequency: v.string(),
    duration: v.string(),
    quantity: v.number(),
    instructions: v.optional(v.string()),
  })),
  status: prescriptionStatus,
  prescribedAt: v.number(),
  dispensedAt: v.optional(v.number()),
  dispensedBy: v.optional(v.id("staff")),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const prescriptionValidator = v.object(prescriptionFields);