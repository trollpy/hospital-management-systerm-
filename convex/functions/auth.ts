import { mutation } from "../_generated/server";

export const syncUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if staff record exists for this user
    const existingStaff = await ctx.db
      .query("staff")
      .withIndex("by_user_id", q => q.eq("userId", identity.subject))
      .first();

    if (!existingStaff) {
      // Create a basic staff record for new users
      await ctx.db.insert("staff", {
        userId: identity.subject,
        employeeId: `EMP${Date.now()}`,
        firstName: identity.givenName || "Unknown",
        lastName: identity.familyName || "User",
        email: identity.email!,
        phone: "",
        role: "reception",
        department: "Administration",
        isActive: true,
        hireDate: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});