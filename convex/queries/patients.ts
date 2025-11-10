import { v } from "convex/values";
import { query } from "../_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const patients = await ctx.db.query("patients").collect();
    const visits = await ctx.db.query("visits").collect();
    const appointments = await ctx.db.query("appointments").collect();

    const today = new Date().toISOString().split('T')[0];
    const todayVisits = visits.filter(v => 
      new Date(v.startTime).toISOString().split('T')[0] === today
    );
    const todayAppointments = appointments.filter(a => 
      a.scheduledAt.startsWith(today)
    );

    return {
      totalPatients: patients.length,
      totalVisits: visits.length,
      todayVisits: todayVisits.length,
      todayAppointments: todayAppointments.length,
      activeVisits: visits.filter(v => v.status === 'in-progress').length,
    };
  },
});

export const getRecentPatients = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patients")
      .order("desc")
      .take(args.limit || 10);
  },
});