// API configuration and endpoints
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
}

// API endpoints
export const ENDPOINTS = {
  // Patient endpoints
  patients: {
    list: '/patients',
    create: '/patients',
    get: (id: string) => `/patients/${id}`,
    update: (id: string) => `/patients/${id}`,
    search: '/patients/search',
    stats: '/patients/stats',
  },
  
  // Appointment endpoints
  appointments: {
    list: '/appointments',
    create: '/appointments',
    get: (id: string) => `/appointments/${id}`,
    update: (id: string) => `/appointments/${id}`,
    today: '/appointments/today',
    byPatient: (patientId: string) => `/appointments/patient/${patientId}`,
    byProvider: (providerId: string) => `/appointments/provider/${providerId}`,
  },
  
  // Visit endpoints
  visits: {
    list: '/visits',
    create: '/visits',
    get: (id: string) => `/visits/${id}`,
    update: (id: string) => `/visits/${id}`,
    today: '/visits/today',
    active: '/visits/active',
    byPatient: (patientId: string) => `/visits/patient/${patientId}`,
  },
  
  // Laboratory endpoints
  lab: {
    orders: {
      list: '/lab/orders',
      create: '/lab/orders',
      get: (id: string) => `/lab/orders/${id}`,
      update: (id: string) => `/lab/orders/${id}`,
      byPatient: (patientId: string) => `/lab/orders/patient/${patientId}`,
    },
    results: {
      list: '/lab/results',
      create: '/lab/results',
      get: (id: string) => `/lab/results/${id}`,
      byOrder: (orderId: string) => `/lab/results/order/${orderId}`,
    },
  },
  
  // Pharmacy endpoints
  pharmacy: {
    prescriptions: {
      list: '/pharmacy/prescriptions',
      create: '/pharmacy/prescriptions',
      get: (id: string) => `/pharmacy/prescriptions/${id}`,
      update: (id: string) => `/pharmacy/prescriptions/${id}`,
      byPatient: (patientId: string) => `/pharmacy/prescriptions/patient/${patientId}`,
    },
    inventory: {
      list: '/pharmacy/inventory',
      create: '/pharmacy/inventory',
      get: (id: string) => `/pharmacy/inventory/${id}`,
      update: (id: string) => `/pharmacy/inventory/${id}`,
      lowStock: '/pharmacy/inventory/low-stock',
    },
  },
  
  // Billing endpoints
  billing: {
    invoices: {
      list: '/billing/invoices',
      create: '/billing/invoices',
      get: (id: string) => `/billing/invoices/${id}`,
      update: (id: string) => `/billing/invoices/${id}`,
      byPatient: (patientId: string) => `/billing/invoices/patient/${patientId}`,
    },
    payments: {
      create: '/billing/payments',
    },
  },
  
  // ANC endpoints
  anc: {
    visits: {
      list: '/anc/visits',
      create: '/anc/visits',
      get: (id: string) => `/anc/visits/${id}`,
      update: (id: string) => `/anc/visits/${id}`,
      byPatient: (patientId: string) => `/anc/visits/patient/${patientId}`,
    },
  },
  
  // Family Planning endpoints
  familyPlanning: {
    visits: {
      list: '/family-planning/visits',
      create: '/family-planning/visits',
      get: (id: string) => `/family-planning/visits/${id}`,
      update: (id: string) => `/family-planning/visits/${id}`,
      byPatient: (patientId: string) => `/family-planning/visits/patient/${patientId}`,
    },
  },
  
  // Reports endpoints
  reports: {
    daily: '/reports/daily',
    financial: '/reports/financial',
    clinical: '/reports/clinical',
    analytics: '/reports/analytics',
    export: '/reports/export',
  },
}

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
}

// Success messages
export const SUCCESS_MESSAGES = {
  PATIENT_CREATED: 'Patient created successfully.',
  PATIENT_UPDATED: 'Patient updated successfully.',
  APPOINTMENT_CREATED: 'Appointment scheduled successfully.',
  VISIT_CREATED: 'Visit recorded successfully.',
  PRESCRIPTION_CREATED: 'Prescription created successfully.',
  INVOICE_CREATED: 'Invoice generated successfully.',
  PAYMENT_RECEIVED: 'Payment recorded successfully.',
}