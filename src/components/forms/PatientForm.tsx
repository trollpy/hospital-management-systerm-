'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface PatientFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
  }
  allergies: string[]
  medicalHistory: Array<{
    condition: string
    diagnosedAt: string
    status: string
  }>
}

export function PatientForm() {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
    },
    allergies: [],
    medicalHistory: [],
  })

  const [newAllergy, setNewAllergy] = useState('')
  const [newMedicalCondition, setNewMedicalCondition] = useState({
    condition: '',
    diagnosedAt: '',
    status: 'active'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Patient Form Data:', formData)
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

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy('')
    }
  }

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const addMedicalCondition = () => {
    if (newMedicalCondition.condition.trim() && newMedicalCondition.diagnosedAt) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, { ...newMedicalCondition }]
      }))
      setNewMedicalCondition({
        condition: '',
        diagnosedAt: '',
        status: 'active'
      })
    }
  }

  const removeMedicalCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }))
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-indigo-50 border-indigo-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Registration</h3>
        <p className="text-gray-600">Register a new patient in the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Address</h4>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Street Address"
              value={formData.address.street}
              onChange={(e) => handleChange('address.street', e.target.value)}
              required
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="City"
                value={formData.address.city}
                onChange={(e) => handleChange('address.city', e.target.value)}
                required
              />
              <Input
                label="State"
                value={formData.address.state}
                onChange={(e) => handleChange('address.state', e.target.value)}
                required
              />
              <Input
                label="Postal Code"
                value={formData.address.postalCode}
                onChange={(e) => handleChange('address.postalCode', e.target.value)}
                required
              />
              <Input
                label="Country"
                value={formData.address.country}
                onChange={(e) => handleChange('address.country', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Full Name"
              value={formData.emergencyContact.name}
              onChange={(e) => handleChange('emergencyContact.name', e.target.value)}
              required
            />
            <Input
              label="Relationship"
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleChange('emergencyContact.relationship', e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleChange('emergencyContact.phone', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Insurance */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Insurance Provider"
              value={formData.insurance.provider}
              onChange={(e) => handleChange('insurance.provider', e.target.value)}
            />
            <Input
              label="Policy Number"
              value={formData.insurance.policyNumber}
              onChange={(e) => handleChange('insurance.policyNumber', e.target.value)}
            />
            <Input
              label="Group Number"
              value={formData.insurance.groupNumber}
              onChange={(e) => handleChange('insurance.groupNumber', e.target.value)}
            />
          </div>
        </div>

        {/* Allergies */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h4>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addAllergy}>
                Add Allergy
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{allergy}</span>
                  <button
                    type="button"
                    onClick={() => removeAllergy(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Condition"
                value={newMedicalCondition.condition}
                onChange={(e) => setNewMedicalCondition(prev => ({
                  ...prev,
                  condition: e.target.value
                }))}
              />
              <Input
                label="Diagnosed Date"
                type="date"
                value={newMedicalCondition.diagnosedAt}
                onChange={(e) => setNewMedicalCondition(prev => ({
                  ...prev,
                  diagnosedAt: e.target.value
                }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newMedicalCondition.status}
                  onChange={(e) => setNewMedicalCondition(prev => ({
                    ...prev,
                    status: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="chronic">Chronic</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <Button type="button" onClick={addMedicalCondition}>
                  Add Condition
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {formData.medicalHistory.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{condition.condition}</span>
                    <span className="text-sm text-gray-500 ml-4">
                      Diagnosed: {condition.diagnosedAt}
                    </span>
                    <span className={`text-sm ml-4 px-2 py-1 rounded-full ${
                      condition.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                      condition.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {condition.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedicalCondition(index)}
                    className="text-red-600 hover:text-red-800"
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
            Register Patient
          </Button>
        </div>
      </form>
    </Card>
  )
}