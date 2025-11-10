import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { inventoryValidator } from "../schema/inventory";

export const create = mutation({
  args: inventoryValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const inventoryId = await ctx.db.insert("inventory", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: identity.subject,
    });

    return inventoryId;
  },
});

export const update = mutation({
  args: {
    id: v.id("inventory"),
    ...inventoryValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { id, ...data } = args;
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const updateStock = mutation({
  args: {
    id: v.id("inventory"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      quantity: args.quantity,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const list = query({
  args: {
    category: v.optional(v.string()),
    lowStock: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("inventory");

    if (args.category) {
      query = query.withIndex("by_category", q => q.eq("category", args.category!));
    }

    const items = await query.order("desc").collect();

    if (args.lowStock) {
      return items.filter(item => item.quantity <= item.reorderLevel);
    }

    return items;
  },
});