'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface VisitFormData {
  patientId: string
  type: string
  chiefComplaint: string
  vitals: {
    bloodPressure?: string
    heartRate?: number
    temperature?: number
    respiratoryRate?: number
    oxygenSaturation?: number
    weight?: number
    height?: number
  }
  soap: {
    subjective?: string
    objective?: string
    assessment?: string
    plan?: string
  }
  diagnoses: string[]
  medications: Array<{
    medication: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
}

export function VisitForm() {
  const [formData, setFormData] = useState<VisitFormData>({
    patientId: '',
    type: '',
    chiefComplaint: '',
    vitals: {},
    soap: {},
    diagnoses: [],
    medications: [],
  })

  const [newDiagnosis, setNewDiagnosis] = useState('')
  const [newMedication, setNewMedication] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Visit Form Data:', formData)
    // Handle form submission
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        }
      }
      return { ...prev, [field]: value }
    })
  }

  const addDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setFormData(prev => ({
        ...prev,
        diagnoses: [...prev.diagnoses, newDiagnosis.trim()]
      }))
      setNewDiagnosis('')
    }
  }

  const removeDiagnosis = (index: number) => {
    setFormData(prev => ({
      ...prev,
      diagnoses: prev.diagnoses.filter((_, i) => i !== index)
    }))
  }

  const addMedication = () => {
    if (newMedication.medication.trim() && newMedication.dosage.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, { ...newMedication }]
      }))
      setNewMedication({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      })
    }
  }

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Visit</h3>
        <p className="text-gray-600">Record patient consultation details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => handleChange('patientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select Patient</option>
              <option value="1">John Doe (MRN12345)</option>
              <option value="2">Jane Smith (MRN12346)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select Type</option>
              <option value="outpatient">Outpatient</option>
              <option value="inpatient">Inpatient</option>
              <option value="emergency">Emergency</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
        </div>

        <Input
          label="Chief Complaint"
          value={formData.chiefComplaint}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          placeholder="Patient's main reason for visit..."
          required
        />

        {/* Vitals */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Blood Pressure"
              value={formData.vitals.bloodPressure}
              onChange={(e) => handleChange('vitals.bloodPressure', e.target.value)}
              placeholder="120/80"
            />
            <Input
              label="Heart Rate"
              type="number"
              value={formData.vitals.heartRate}
              onChange={(e) => handleChange('vitals.heartRate', parseInt(e.target.value))}
              placeholder="72"
            />
            <Input
              label="Temperature (°C)"
              type="number"
              step="0.1"
              value={formData.vitals.temperature}
              onChange={(e) => handleChange('vitals.temperature', parseFloat(e.target.value))}
              placeholder="36.6"
            />
            <Input
              label="Respiratory Rate"
              type="number"
              value={formData.vitals.respiratoryRate}
              onChange={(e) => handleChange('vitals.respiratoryRate', parseInt(e.target.value))}
              placeholder="16"
            />
            <Input
              label="O2 Saturation (%)"
              type="number"
              value={formData.vitals.oxygenSaturation}
              onChange={(e) => handleChange('vitals.oxygenSaturation', parseInt(e.target.value))}
              placeholder="98"
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={formData.vitals.weight}
              onChange={(e) => handleChange('vitals.weight', parseFloat(e.target.value))}
              placeholder="70"
            />
            <Input
              label="Height (cm)"
              type="number"
              value={formData.vitals.height}
              onChange={(e) => handleChange('vitals.height', parseInt(e.target.value))}
              placeholder="175"
            />
          </div>
        </div>

        {/* SOAP Notes */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">SOAP Notes</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjective
              </label>
              <textarea
                value={formData.soap.subjective}
                onChange={(e) => handleChange('soap.subjective', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Patient's description of symptoms, history..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objective
              </label>
              <textarea
                value={formData.soap.objective}
                onChange={(e) => handleChange('soap.objective', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Physical exam findings, test results..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment
              </label>
              <textarea
                value={formData.soap.assessment}
                onChange={(e) => handleChange('soap.assessment', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Diagnosis, differential diagnosis..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <textarea
                value={formData.soap.plan}
                onChange={(e) => handleChange('soap.plan', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Treatment plan, medications, follow-up..."
              />
            </div>
          </div>
        </div>

        {/* Diagnoses */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Diagnoses</h4>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter diagnosis"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addDiagnosis}>
                Add Diagnosis
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.diagnoses.map((diagnosis, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{diagnosis}</span>
                  <button
                    type="button"
                    onClick={() => removeDiagnosis(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medications */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Medications</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Medication"
                value={newMedication.medication}
                onChange={(e) => setNewMedication(prev => ({
                  ...prev,
                  medication: e.target.value
                }))}
              />
              <Input
                label="Dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({
                  ...prev,
                  dosage: e.target.value
                }))}
              />
              <Input
                label="Frequency"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication(prev => ({
                  ...prev,
                  frequency: e.target.value
                }))}
              />
              <Input
                label="Duration"
                value={newMedication.duration}
                onChange={(e) => setNewMedication(prev => ({
                  ...prev,
                  duration: e.target.value
                }))}
              />
              <div className="flex items-end">
                <Button type="button" onClick={addMedication}>
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {formData.medications.map((med, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <span className="font-medium">{med.medication}</span>
                    <span className="text-gray-600">{med.dosage}</span>
                    <span className="text-gray-600">{med.frequency}</span>
                    <span className="text-gray-600">{med.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Save Visit
          </Button>
        </div>
      </form>
    </Card>
  )
}