import { query } from "../_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const staff = await ctx.db.query("staff").collect();
    const visits = await ctx.db.query("visits").collect();

    const departmentStats: Record<string, { staff: number; visits: number }> = {};

    staff.forEach(employee => {
      if (!departmentStats[employee.department]) {
        departmentStats[employee.department] = { staff: 0, visits: 0 };
      }
      departmentStats[employee.department].staff++;
    });

    visits.forEach(visit => {
      // This would need to be enhanced to map visits to departments
      // For now, we'll count all visits under "General"
      if (!departmentStats["General"]) {
        departmentStats["General"] = { staff: 0, visits: 0 };
      }
      departmentStats["General"].visits++;
    });

    return departmentStats;
  },
});