import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { labOrderValidator, labResultValidator } from "../schema/lab";

export const createOrder = mutation({
  args: labOrderValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const orderId = await ctx.db.insert("labOrders", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return orderId;
  },
});

export const updateOrderStatus = mutation({
  args: {
    id: v.id("labOrders"),
    status: v.union(
      v.literal("ordered"),
      v.literal("collected"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const addResult = mutation({
  args: labResultValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const resultId = await ctx.db.insert("labResults", args);
    return resultId;
  },
});

export const getOrdersByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labOrders")
      .withIndex("by_patient_id", q => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

export const getResultsByOrder = query({
  args: { orderId: v.id("labOrders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labResults")
      .withIndex("by_order_id", q => q.eq("orderId", args.orderId))
      .collect();
  },
});