import { defineSchema, defineTable } from "convex/server";
import { patientValidator } from "./patient";
import { staffValidator } from "./staff";
import { appointmentValidator } from "./appointment";
import { visitValidator } from "./visit";
import { labOrderValidator } from "./lab";
import { labResultValidator } from "./lab";
import { prescriptionValidator } from "./pharmacy";
import { inventoryValidator } from "./inventory";
import { billingValidator } from "./billing";
import { ancValidator } from "./anc";
import { familyPlanningValidator } from "./familyplanning";

export default defineSchema({
  patients: defineTable(patientValidator)
    .index("by_mrn", ["mrn"])
    .index("by_phone", ["phone"])
    .index("by_created_at", ["createdAt"]),

  staff: defineTable(staffValidator)
    .index("by_user_id", ["userId"])
    .index("by_role", ["role"])
    .index("by_department", ["department"]),

  appointments: defineTable(appointmentValidator)
    .index("by_patient_id", ["patientId"])
    .index("by_provider_id", ["providerId"])
    .index("by_status", ["status"])
    .index("by_scheduled_at", ["scheduledAt"]),

  visits: defineTable(visitValidator)
    .index("by_patient_id", ["patientId"])
    .index("by_provider_id", ["providerId"])
    .index("by_status", ["status"])
    .index("by_start_time", ["startTime"]),

  labOrders: defineTable(labOrderValidator)
    .index("by_patient_id", ["patientId"])
    .index("by_visit_id", ["visitId"])
    .index("by_status", ["status"])
    .index("by_ordered_at", ["orderedAt"]),

  labResults: defineTable(labResultValidator)
    .index("by_order_id", ["orderId"])
    .index("by_patient_id", ["patientId"])
    .index("by_completed_at", ["completedAt"]),

  prescriptions: defineTable(prescriptionValidator)
    .index("by_patient_id", ["patientId"])
    .index("by_visit_id", ["visitId"])
    .index("by_status", ["status"])
    .index("by_prescribed_at", ["prescribedAt"]),

  inventory: defineTable(inventoryValidator)
    .index("by_category", ["category"])
    .index("by_name", ["name"])
    .index("by_stock_level", ["stockLevel"])
    .index("by_expiry_date", ["expiryDate"]),

  billing: defineTable(billingValidator)
    .index("by_patient_id", ["patientId"])
    .index("by_visit_id", ["visitId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  ancVisits: defineTable(ancValidator)
    .index("by_patient_id", ["patientId"])
    .index("by_visit_date", ["visitDate"])
    .index("by_gestational_age", ["gestationalAge"]),

  familyPlanning: defineTable(familyPlanningValidator)
    .index("by_patient_id", ["patientId"])
    .index("by_method", ["method"])
    .index("by_visit_date", ["visitDate"]),
});