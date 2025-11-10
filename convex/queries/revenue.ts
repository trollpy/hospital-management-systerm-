import { query } from "../_generated/server";

export const getRevenueStats = query({
  args: {},
  handler: async (ctx) => {
    const billing = await ctx.db.query("billing").collect();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInvoices = billing.filter(invoice => 
      invoice.createdAt >= thirtyDaysAgo.getTime()
    );

    const dailyRevenue: Record<string, number> = {};

    recentInvoices.forEach(invoice => {
      const date = new Date(invoice.createdAt).toISOString().split('T')[0];
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += invoice.total;
    });

    const totalRevenue = recentInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paidInvoices = recentInvoices.filter(invoice => invoice.status === 'paid').length;

    return {
      totalRevenue,
      averageDailyRevenue: totalRevenue / 30,
      paidInvoices,
      totalInvoices: recentInvoices.length,
      dailyBreakdown: dailyRevenue,
    };
  },
});