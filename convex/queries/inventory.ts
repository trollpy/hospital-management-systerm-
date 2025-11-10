import { query } from "../_generated/server";

export const getLowStock = query({
  args: {},
  handler: async (ctx) => {
    const inventory = await ctx.db.query("inventory").collect();
    return inventory.filter(item => item.quantity <= item.reorderLevel);
  },
});

export const getExpiringSoon = query({
  args: {},
  handler: async (ctx) => {
    const inventory = await ctx.db.query("inventory").collect();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return inventory.filter(item => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry <= thirtyDaysFromNow && expiry >= new Date();
    });
  },
});