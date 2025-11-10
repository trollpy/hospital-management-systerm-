import { v } from "convex/values";

export const roles = v.union(
  v.literal("super-admin"),
  v.literal("admin"),
  v.literal("clinician"),
  v.literal("nurse"),
  v.literal("pharmacist"),
  v.literal("lab-tech"),
  v.literal("accountant"),
  v.literal("reception")
);

export const appointmentStatus = v.union(
  v.literal("scheduled"),
  v.literal("confirmed"),
  v.literal("in-progress"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("no-show")
);

export const visitStatus = v.union(
  v.literal("triaged"),
  v.literal("in-progress"),
  v.literal("completed"),
  v.literal("admitted"),
  v.literal("discharged")
);

export const gender = v.union(
  v.literal("male"),
  v.literal("female"),
  v.literal("other")
);

export const bloodGroup = v.union(
  v.literal("A+"),
  v.literal("A-"),
  v.literal("B+"),
  v.literal("B-"),
  v.literal("AB+"),
  v.literal("AB-"),
  v.literal("O+"),
  v.literal("O-")
);