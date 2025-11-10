'use client';
import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, Pill, Package, AlertTriangle } from 'lucide-react';

export default function PharmacyPage() {
  const prescriptions = useQuery(api.pharmacy.getPendingPrescriptions);
  const medications = useQuery(api.pharmacy.listMedications);
  const dispensePrescription = useMutation(api.pharmacy.dispensePrescription);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showInventory, setShowInventory] = useState(false);

  const handleDispense = async (prescriptionId: string) => {
    try {
      await dispensePrescription({
        prescriptionId: prescriptionId as any,
        dispensedBy: "staff-id" as any,
      });
    } catch (error) {
      alert('Error dispensing prescription');
    }
  };

  const lowStockMedications = medications?.filter(med => 
    med.stock <= med.minStock
  ) || [];

  const filteredPrescriptions = prescriptions?.filter(prescription => 
    prescription.patientId.includes(searchQuery)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pharmacy</h1>
          <p className="text-gray-600 mt-2">
            Manage prescriptions and medication inventory
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowInventory(true)}>
            <Package className="h-4 w-4 mr-2" />
            View Inventory
          </Button>
        </div>
      </div>

      {lowStockMedications.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-orange-800 font-medium">Low Stock Alert</h3>
          </div>
          <p className="text-orange-700 text-sm mt-1">
            {lowStockMedications.length} medications are running low on stock
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Prescriptions</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table
            headers={['Patient', 'Medications', 'Prescribed By', 'Date', 'Actions']}
          >
            {filteredPrescriptions.map((prescription) => (
              <tr key={prescription._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Patient ID: {prescription.patientId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="space-y-1">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="flex items-center">
                        <Pill className="h-3 w-3 mr-2 text-gray-400" />
                        {med.name} - {med.dosage} {med.frequency}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Provider ID: {prescription.prescribedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    size="sm"
                    onClick={() => handleDispense(prescription._id)}
                  >
                    Dispense
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Prescriptions</span>
                <span className="font-semibold text-gray-900">
                  {prescriptions?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Medications</span>
                <span className="font-semibold text-gray-900">
                  {medications?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-semibold text-orange-600">
                  {lowStockMedications.length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Stock Take
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Pill className="h-4 w-4 mr-2" />
                Expiry Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        title="Medication Inventory"
        size="xl"
      >
        <div className="space-y-4">
          <Table
            headers={['Medication', 'Generic Name', 'Stock', 'Min Stock', 'Status']}
          >
            {medications?.map((medication) => (
              <tr key={medication._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {medication.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {medication.genericName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {medication.stock} {medication.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {medication.minStock} {medication.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    medication.stock <= medication.minStock 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {medication.stock <= medication.minStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </Modal>
    </div>
  );
}