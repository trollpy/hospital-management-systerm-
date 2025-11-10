import { v } from "convex/values";
import { gender, bloodGroup } from "./types";

export const patientFields = {
  mrn: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  dateOfBirth: v.string(),
  gender: gender,
  bloodGroup: v.optional(bloodGroup),
  phone: v.string(),
  email: v.optional(v.string()),
  address: v.object({
    street: v.string(),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
    country: v.string(),
  }),
  emergencyContact: v.object({
    name: v.string(),
    relationship: v.string(),
    phone: v.string(),
  }),
  insurance: v.optional(v.object({
    provider: v.string(),
    policyNumber: v.string(),
    groupNumber: v.optional(v.string()),
  })),
  allergies: v.array(v.string()),
  medicalHistory: v.array(v.object({
    condition: v.string(),
    diagnosedAt: v.string(),
    status: v.string(),
  })),
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.string(),
};

export const patientValidator = v.object(patientFields);