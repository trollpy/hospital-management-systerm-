import { z } from 'zod';

export const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
  }),
});

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  providerId: z.string().min(1, 'Provider is required'),
  scheduledAt: z.string().min(1, 'Date and time is required'),
  duration: z.number().min(5, 'Duration must be at least 5 minutes'),
  type: z.string().min(1, 'Appointment type is required'),
  reason: z.string().min(1, 'Reason for visit is required'),
});