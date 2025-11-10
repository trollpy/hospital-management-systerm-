import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { staffValidator } from "../schema/staff";

export const create = mutation({
  args: staffValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const staffId = await ctx.db.insert("staff", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return staffId;
  },
});

export const list = query({
  args: {
    role: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("staff");

    if (args.role) {
      query = query.withIndex("by_role", q => q.eq("role", args.role!));
    } else if (args.department) {
      query = query.withIndex("by_department", q => q.eq("department", args.department!));
    }

    return await query.order("desc").collect();
  },
});