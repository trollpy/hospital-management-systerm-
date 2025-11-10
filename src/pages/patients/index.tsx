'use client';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { PatientForm } from '@/components/forms/PatientForm';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import Link from 'next/link';

export default function PatientsPage() {
  const patients = useQuery(api.patients.list);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients?.filter(patient => 
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.includes(searchQuery) ||
    patient.phone.includes(searchQuery)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">
            Manage patient records and information
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Patient
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name, MRN, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredPatients.length} patients found
          </div>
        </div>

        <Table
          headers={['MRN', 'Name', 'Phone', 'Date of Birth', 'Sex', 'Actions']}
        >
          {filteredPatients.map((patient) => (
            <tr key={patient._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {patient.mrn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.firstName} {patient.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {patient.sex}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Link href={`/patients/${patient._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Register New Patient"
        size="xl"
      >
        <PatientForm
          onSuccess={() => {
            setShowForm(false);
            // Refresh or show success message
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}