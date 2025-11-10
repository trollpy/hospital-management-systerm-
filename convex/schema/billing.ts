import { v } from "convex/values";
import { billingStatus } from "./types";

export const billingFields = {
  patientId: v.id("patients"),
  visitId: v.optional(v.id("visits")),
  invoiceNumber: v.string(),
  items: v.array(v.object({
    description: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    amount: v.number(),
  })),
  subtotal: v.number(),
  tax: v.number(),
  discount: v.number(),
  total: v.number(),
  status: billingStatus,
  payments: v.array(v.object({
    amount: v.number(),
    method: v.string(),
    transactionId: v.optional(v.string()),
    paidAt: v.number(),
    receivedBy: v.id("staff"),
  })),
  dueDate: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.string(),
};

export const billingValidator = v.object(billingFields);