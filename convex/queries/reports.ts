import { query } from "../_generated/server";

export const getDailyReport = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const visits = await ctx.db.query("visits").collect();
    const appointments = await ctx.db.query("appointments").collect();
    const billing = await ctx.db.query("billing").collect();

    const todayVisits = visits.filter(v => 
      new Date(v.startTime).toISOString().split('T')[0] === today
    );
    const todayAppointments = appointments.filter(a => 
      a.scheduledAt.startsWith(today)
    );
    const todayBilling = billing.filter(b => 
      new Date(b.createdAt).toISOString().split('T')[0] === today
    );

    const revenue = todayBilling.reduce((sum, invoice) => sum + invoice.total, 0);

    return {
      date: today,
      visits: todayVisits.length,
      appointments: todayAppointments.length,
      revenue,
      invoices: todayBilling.length,
    };
  },
});