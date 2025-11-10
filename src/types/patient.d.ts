export interface Patient {
  _id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  allergies: string[];
  bloodType?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
  };
  allergies: string[];
}