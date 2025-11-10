'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface Medication {
  medicationId: string
  name: string
  dosage: string
  form: string
  frequency: string
  duration: string
  quantity: number
  instructions?: string
}

interface PharmacyFormData {
  patientId: string
  medications: Medication[]
  notes?: string
}

export function PharmacyForm() {
  const [formData, setFormData] = useState<PharmacyFormData>({
    patientId: '',
    medications: [{
      medicationId: '',
      name: '',
      dosage: '',
      form: '',
      frequency: '',
      duration: '',
      quantity: 1,
      instructions: ''
    }],
  })

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, {
        medicationId: '',
        name: '',
        dosage: '',
        form: '',
        frequency: '',
        duration: '',
        quantity: 1,
        instructions: ''
      }]
    }))
  }

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    const updatedMedications = [...formData.medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setFormData(prev => ({ ...prev, medications: updatedMedications }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Pharmacy Form Data:', formData)
    // Handle form submission
  }

  const commonMedications = [
    { id: '1', name: 'Paracetamol', forms: ['Tablet', 'Syrup'] },
    { id: '2', name: 'Amoxicillin', forms: ['Capsule', 'Syrup'] },
    { id: '3', name: 'Ibuprofen', forms: ['Tablet', 'Capsule'] },
    { id: '4', name: 'Omeprazole', forms: ['Capsule'] },
    { id: '5', name: 'Salbutamol', forms: ['Inhaler'] },
  ]

  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed'
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-yellow-50 border-yellow-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmacy Prescription</h3>
        <p className="text-gray-600">Prescribe medications for patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          >
            <option value="">Select Patient</option>
            <option value="1">John Doe (MRN12345)</option>
            <option value="2">Jane Smith (MRN12346)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Medications</h4>
            <Button type="button" variant="secondary" size="sm" onClick={addMedication}>
              Add Medication
            </Button>
          </div>

          <div className="space-y-6">
            {formData.medications.map((med, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-4 bg-white/50 rounded-lg border border-gray-200">
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication
                  </label>
                  <select
                    value={med.medicationId}
                    onChange={(e) => {
                      const selectedMed = commonMedications.find(m => m.id === e.target.value)
                      if (selectedMed) {
                        updateMedication(index, 'medicationId', selectedMed.id)
                        updateMedication(index, 'name', selectedMed.name)
                        updateMedication(index, 'form', selectedMed.forms[0])
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Medication</option>
                    {commonMedications.map(med => (
                      <option key={med.id} value={med.id}>
                        {med.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-12 md:col-span-2">
                  <Input
                    label="Dosage"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    placeholder="500mg"
                    required
                  />
                </div>

                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form
                  </label>
                  <select
                    value={med.form}
                    onChange={(e) => updateMedication(index, 'form', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Form</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>

                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Frequency</option>
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-12 md:col-span-2">
                  <Input
                    label="Duration"
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    placeholder="7 days"
                    required
                  />
                </div>

                <div className="col-span-12 md:col-span-2">
                  <Input
                    label="Quantity"
                    type="number"
                    value={med.quantity}
                    onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div className="col-span-12 md:col-span-10">
                  <Input
                    label="Instructions"
                    value={med.instructions}
                    onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                    placeholder="Special instructions for use..."
                  />
                </div>

                <div className="col-span-12 md:col-span-2">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeMedication(index)}
                    disabled={formData.medications.length === 1}
                    className="mt-6"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Any additional notes for the pharmacy..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Submit Prescription
          </Button>
        </div>
      </form>
    </Card>
  )
}