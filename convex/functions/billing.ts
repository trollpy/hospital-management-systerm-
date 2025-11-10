import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const invoices = defineTable({
  patientId: v.id("patients"),
  visitId: v.optional(v.id("visits")),
  items: v.array(v.object({
    description: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    amount: v.number(),
  })),
  totalAmount: v.number(),
  paidAmount: v.number(),
  balance: v.number(),
  status: v.union(v.literal("pending"), v.literal("paid"), v.literal("partial")),
  createdBy: v.id("staff"),
  createdAt: v.number(),
  payments: v.array(v.object({
    amount: v.number(),
    method: v.string(),
    transactionId: v.optional(v.string()),
    paidAt: v.number(),
    receivedBy: v.id("staff"),
  })),
}).index("by_status", ["status"]);

export const createInvoice = mutation({
  args: {
    patientId: v.id("patients"),
    visitId: v.optional(v.id("visits")),
    items: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    })),
    createdBy: v.id("staff"),
  },
  handler: async (ctx, args) => {
    const totalAmount = args.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );

    const itemsWithAmount = args.items.map(item => ({
      ...item,
      amount: item.quantity * item.unitPrice,
    }));

    const invoiceId = await ctx.db.insert("invoices", {
      ...args,
      items: itemsWithAmount,
      totalAmount,
      paidAmount: 0,
      balance: totalAmount,
      status: "pending",
      payments: [],
      createdAt: Date.now(),
    });

    return invoiceId;
  },
});

export const addPayment = mutation({
  args: {
    invoiceId: v.id("invoices"),
    amount: v.number(),
    method: v.string(),
    transactionId: v.optional(v.string()),
    receivedBy: v.id("staff"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const newPaidAmount = invoice.paidAmount + args.amount;
    const newBalance = invoice.totalAmount - newPaidAmount;
    const newStatus = newBalance === 0 ? "paid" : 
                     newPaidAmount > 0 ? "partial" : "pending";

    const newPayment = {
      amount: args.amount,
      method: args.method,
      transactionId: args.transactionId,
      paidAt: Date.now(),
      receivedBy: args.receivedBy,
    };

    await ctx.db.patch(args.invoiceId, {
      paidAmount: newPaidAmount,
      balance: newBalance,
      status: newStatus,
      payments: [...invoice.payments, newPayment],
    });
  },
});

export const getTodayRevenue = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const invoices = await ctx.db.query("invoices").collect();
    
    return invoices
      .filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt).toISOString().split('T')[0];
        return invoiceDate === today;
      })
      .reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  },
});