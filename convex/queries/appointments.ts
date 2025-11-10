import { query } from "../_generated/server";

export const getTodaySchedule = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_scheduled_at", q => q.gte("scheduledAt", today))
      .order("asc")
      .collect();

    return appointments.filter(apt => apt.scheduledAt.startsWith(today));
  },
});