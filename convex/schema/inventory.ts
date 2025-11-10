import { v } from "convex/values";
import { inventoryCategory } from "./types";

export const inventoryFields = {
  name: v.string(),
  category: inventoryCategory,
  description: v.optional(v.string()),
  sku: v.string(),
  batchNumber: v.optional(v.string()),
  quantity: v.number(),
  unit: v.string(),
  costPrice: v.number(),
  sellingPrice: v.number(),
  reorderLevel: v.number(),
  expiryDate: v.optional(v.string()),
  supplier: v.optional(v.string()),
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.string(),
};

export const inventoryValidator = v.object(inventoryFields);