export interface Patient {
    _id: Id<"patients">;
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
        province: string;
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
        groupNumber: string;
    };
    allergies: string[];
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    createdAt: number;
    updatedAt: number;
}

export interface Visit