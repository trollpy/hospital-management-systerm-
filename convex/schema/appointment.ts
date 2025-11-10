import { v } from "convex/values";
import { appointmentStatus } from "./types";

export const appointmentFields = {
  patientId: v.id("patients"),
  providerId: v.id("staff"),
  scheduledAt: v.string(),
  duration: v.number(),
  type: v.string(),
  reason: v.string(),
  status: appointmentStatus,
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.string(),
};

export const appointmentValidator = v.object(appointmentFields);