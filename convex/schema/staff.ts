import { v } from "convex/values";
import { roles } from "./types";

export const staffFields = {
  userId: v.string(),
  employeeId: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.string(),
  role: roles,
  department: v.string(),
  specialization: v.optional(v.string()),
  licenseNumber: v.optional(v.string()),
  isActive: v.boolean(),
  hireDate: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export const staffValidator = v.object(staffFields);