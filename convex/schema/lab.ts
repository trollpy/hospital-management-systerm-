import { v } from "convex/values";
import { labOrderStatus } from "./types";

export const labOrderFields = {
  patientId: v.id("patients"),
  visitId: v.optional(v.id("visits")),
  orderedBy: v.id("staff"),
  tests: v.array(v.object({
    testCode: v.string(),
    testName: v.string(),
    category: v.string(),
    priority: v.string(),
    instructions: v.optional(v.string()),
  })),
  status: labOrderStatus,
  orderedAt: v.number(),
  collectedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const labOrderValidator = v.object(labOrderFields);

export const labResultFields = {
  orderId: v.id("labOrders"),
  patientId: v.id("patients"),
  testCode: v.string(),
  testName: v.string(),
  result: v.string(),
  unit: v.optional(v.string()),
  normalRange: v.optional(v.string()),
  flag: v.optional(v.string()),
  completedBy: v.id("staff"),
  completedAt: v.number(),
  notes: v.optional(v.string()),
  createdAt: v.number(),
};

export const labResultValidator = v.object(labResultFields);