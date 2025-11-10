import { query } from "../_generated/server";

export const getQueue = query({
  args: {},
  handler: async (ctx) => {
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_status", q => q.eq("status", "scheduled"))
      .order("asc")
      .collect();

    const visits = await ctx.db
      .query("visits")
      .withIndex("by_status", q => q.eq("status", "triaged"))
      .order("asc")
      .collect();

    const queue = [
      ...appointments.map(apt => ({
        type: 'appointment' as const,
        id: apt._id,
        patientId: apt.patientId,
        scheduledTime: apt.scheduledAt,
        priority: 1,
      })),
      ...visits.map(visit => ({
        type: 'walkin' as const,
        id: visit._id,
        patientId: visit.patientId,
        scheduledTime: new Date(visit.startTime).toISOString(),
        priority: 2,
      }))
    ].sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

    return queue;
  },
});