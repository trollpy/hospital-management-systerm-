'use client';
import { useRouter } from 'next/router';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { User, Calendar, FileText, CreditCard } from 'lucide-react';

export default function PatientProfile() {
  const router = useRouter();
  const { id } = router.query;
  const patient = useQuery(api.patients.getById, { id: id as any });

  if (!patient) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'visits', label: 'Visits', icon: Calendar },
    { id: 'medical', label: 'Medical History', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-gray-600 mt-2">
            MRN: {patient.mrn} | DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
          </p>
        </div>
        <Button>New Visit</Button>
      </div>

      <Tabs tabs={tabs} defaultTab="overview">
        <div data-tab="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card title="Contact Information">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{patient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{patient.email || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right">
                      {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.postalCode}
                    </span>
                  </div>
                </div>
              </Card>

              <Card title="Emergency Contact">
                {patient.emergencyContact ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{patient.emergencyContact.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relationship:</span>
                      <span className="font-medium">{patient.emergencyContact.relationship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{patient.emergencyContact.phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No emergency contact provided</p>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Medical Information">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{patient.bloodType || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allergies:</span>
                    <div className="text-right">
                      {patient.allergies.length > 0 ? (
                        patient.allergies.map((allergy, index) => (
                          <div key={index} className="font-medium">{allergy}</div>
                        ))
                      ) : (
                        <span className="text-green-600">None reported</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Insurance">
                {patient.insurance ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{patient.insurance.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Number:</span>
                      <span className="font-medium">{patient.insurance.policyNumber}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No insurance information</p>
                )}
              </Card>
            </div>
          </div>
        </div>

        <div data-tab="visits">
          <Card title="Visit History">
            <p className="text-gray-500">Visit history will be displayed here</p>
          </Card>
        </div>

        <div data-tab="medical">
          <Card title="Medical History">
            <p className="text-gray-500">Medical history will be displayed here</p>
          </Card>
        </div>

        <div data-tab="billing">
          <Card title="Billing Information">
            <p className="text-gray-500">Billing information will be displayed here</p>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}