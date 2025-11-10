// Application settings and configuration
export const APP_SETTINGS = {
  // Application metadata
  app: {
    name: 'Hospital HMS',
    version: '1.0.0',
    description: 'Comprehensive Hospital Management System',
    supportEmail: 'support@hms.com',
    supportPhone: '+1 (555) 123-4567',
  },
  
  // Features flags
  features: {
    enableANC: true,
    enableFamilyPlanning: true,
    enableTelemedicine: false,
    enableSMSNotifications: false,
    enableBilling: true,
    enableInventory: true,
    enableLabIntegration: true,
  },
  
  // UI settings
  ui: {
    theme: {
      default: 'light',
      supported: ['light', 'dark', 'auto'] as const,
    },
    language: {
      default: 'en',
      supported: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
      ],
    },
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h', // 12h or 24h
    timezone: 'UTC',
  },
  
  // Clinical settings
  clinical: {
    // Vital sign ranges
    vitals: {
      bloodPressure: {
        systolic: { min: 90, max: 140 },
        diastolic: { min: 60, max: 90 },
      },
      heartRate: { min: 60, max: 100 },
      temperature: { min: 36.1, max: 37.5 }, // Celsius
      respiratoryRate: { min: 12, max: 20 },
      oxygenSaturation: { min: 95, max: 100 }, // Percentage
    },
    
    // ANC settings
    anc: {
      visitSchedule: [8, 12, 16, 20, 24, 28, 32, 36, 38, 40], // Weeks
      riskFactors: [
        'Advanced maternal age (>35)',
        'Multiple gestation',
        'Previous C-section',
        'Chronic hypertension',
        'Diabetes',
        'HIV positive',
        'Pre-eclampsia history',
      ],
    },
    
    // Family planning settings
    familyPlanning: {
      methods: [
        'Oral Contraceptives',
        'Injectable',
        'Implant',
        'IUD',
        'Condoms',
        'Natural Methods',
        'Sterilization',
      ],
      followUpSchedule: {
        'Oral Contraceptives': 6, // months
        'Injectable': 3, // months
        'Implant': 3, // years
        'IUD': 1, // year
      },
    },
  },
  
  // Laboratory settings
  laboratory: {
    testCategories: [
      'Hematology',
      'Biochemistry',
      'Microbiology',
      'Immunology',
      'Pathology',
      'Radiology',
    ],
    priorityLevels: [
      { value: 'routine', label: 'Routine', color: 'blue' },
      { value: 'urgent', label: 'Urgent', color: 'orange' },
      { value: 'stat', label: 'STAT', color: 'red' },
    ],
    resultStatus: [
      'pending',
      'completed',
      'cancelled',
      'rejected',
    ],
  },
  
  // Pharmacy settings
  pharmacy: {
    medicationForms: [
      'Tablet',
      'Capsule',
      'Syrup',
      'Injection',
      'Ointment',
      'Inhaler',
      'Drops',
      'Suppository',
    ],
    inventoryCategories: [
      'medication',
      'supplies',
      'equipment',
      'lab_reagents',
    ],
    lowStockThreshold: 10, // Minimum quantity before alert
  },
  
  // Billing settings
  billing: {
    currency: 'USD',
    taxRate: 0.1, // 10%
    paymentMethods: [
      'cash',
      'card',
      'insurance',
      'mobile_money',
      'bank_transfer',
    ],
    invoiceStatus: [
      'draft',
      'pending',
      'paid',
      'overdue',
      'cancelled',
    ],
  },
  
  // Security settings
  security: {
    sessionTimeout: 30, // minutes
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    auditLogRetention: 365, // days
  },
  
  // Notification settings
  notifications: {
    email: {
      enabled: true,
      fromEmail: 'noreply@hms.com',
      fromName: 'Hospital HMS',
    },
    sms: {
      enabled: false,
      provider: 'twilio', // twilio, africastalking, etc.
    },
    push: {
      enabled: true,
    },
  },
}

// Department configurations
export const DEPARTMENTS = {
  'General Medicine': {
    color: 'blue',
    icon: '🩺',
    description: 'General medical consultations and treatments',
  },
  'Pediatrics': {
    color: 'green',
    icon: '👶',
    description: 'Child and adolescent healthcare',
  },
  'Obstetrics & Gynecology': {
    color: 'pink',
    icon: '🤰',
    description: 'Women\'s health and childbirth',
  },
  'Surgery': {
    color: 'purple',
    icon: '🔪',
    description: 'Surgical procedures and operations',
  },
  'Orthopedics': {
    color: 'orange',
    icon: '🦴',
    description: 'Bone and joint treatments',
  },
  'Cardiology': {
    color: 'red',
    icon: '❤️',
    description: 'Heart and cardiovascular care',
  },
  'Emergency': {
    color: 'red',
    icon: '🚑',
    description: 'Emergency medical services',
  },
  'ICU': {
    color: 'yellow',
    icon: '🏥',
    description: 'Intensive care unit',
  },
  'Radiology': {
    color: 'cyan',
    icon: '📷',
    description: 'Medical imaging and diagnostics',
  },
  'Laboratory': {
    color: 'teal',
    icon: '🔬',
    description: 'Laboratory tests and analysis',
  },
  'Pharmacy': {
    color: 'green',
    icon: '💊',
    description: 'Medication dispensing and management',
  },
} as const

// Role-based access control configuration
export const RBAC_CONFIG = {
  roles: {
    'super-admin': {
      name: 'Super Administrator',
      permissions: ['*'],
      description: 'Full system access',
    },
    'admin': {
      name: 'Administrator',
      permissions: [
        'patients:read',
        'patients:write',
        'appointments:read',
        'appointments:write',
        'visits:read',
        'visits:write',
        'billing:read',
        'billing:write',
        'reports:read',
        'settings:read',
        'settings:write',
      ],
      description: 'Administrative access',
    },
    'clinician': {
      name: 'Clinician',
      permissions: [
        'patients:read',
        'patients:write',
        'appointments:read',
        'appointments:write',
        'visits:read',
        'visits:write',
        'lab:read',
        'lab:write',
        'pharmacy:read',
        'pharmacy:write',
      ],
      description: 'Clinical staff access',
    },
    'nurse': {
      name: 'Nurse',
      permissions: [
        'patients:read',
        'patients:write',
        'appointments:read',
        'visits:read',
        'visits:write',
        'lab:read',
      ],
      description: 'Nursing staff access',
    },
    'pharmacist': {
      name: 'Pharmacist',
      permissions: [
        'patients:read',
        'pharmacy:read',
        'pharmacy:write',
        'inventory:read',
        'inventory:write',
      ],
      description: 'Pharmacy staff access',
    },
    'lab-tech': {
      name: 'Lab Technician',
      permissions: [
        'patients:read',
        'lab:read',
        'lab:write',
      ],
      description: 'Laboratory staff access',
    },
    'accountant': {
      name: 'Accountant',
      permissions: [
        'patients:read',
        'billing:read',
        'billing:write',
        'reports:read',
      ],
      description: 'Financial staff access',
    },
    'reception': {
      name: 'Receptionist',
      permissions: [
        'patients:read',
        'patients:write',
        'appointments:read',
        'appointments:write',
        'visits:read',
      ],
      description: 'Front desk access',
    },
  },
} as const

// Export type for roles
export type UserRole = keyof typeof RBAC_CONFIG.roles

// Helper functions
export const getDepartmentConfig = (department: string) => {
  return DEPARTMENTS[department as keyof typeof DEPARTMENTS] || {
    color: 'gray',
    icon: '🏥',
    description: 'Medical department',
  }
}

export const getRoleConfig = (role: UserRole) => {
  return RBAC_CONFIG.roles[role] || RBAC_CONFIG.roles.reception
}

export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const roleConfig = getRoleConfig(userRole)
  return roleConfig.permissions.includes('*') || roleConfig.permissions.includes(permission)
}