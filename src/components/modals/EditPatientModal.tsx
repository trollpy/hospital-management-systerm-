'use client'

import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { User, Mail, Phone, MapPin, Emergency, Stethoscope } from 'lucide-react'

interface EditPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patientData: any) => void
  patient: any
}

export function EditPatientModal({ isOpen, onClose, onSave, patient }: EditPatientModalProps) {
  const [formData, setFormData] = useState({
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
    allergies: [] as string[],
    medicalHistory: [] as any[],
  })

  const [newAllergy, setNewAllergy] = useState('')

  useEffect(() => {
    if (patient) {
      setFormData(patient)
    }
  }, [patient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
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

  if (!patient) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Patient Information"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-gray-600">MRN: {patient.mrn}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-600">Basic patient details</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Contact Information</h3>
              <p className="text-sm text-gray-600">How to reach the patient</p>
            </div>
          </div>
          
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
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Address</h3>
              <p className="text-sm text-gray-600">Patient's residential address</p>
            </div>
          </div>
          
          <div className="space-y-4">
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
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Emergency className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Emergency Contact</h3>
              <p className="text-sm text-gray-600">Person to contact in emergencies</p>
            </div>
          </div>
          
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

        {/* Allergies */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 text-red-600 font-bold">!</div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Allergies</h3>
              <p className="text-sm text-gray-600">Known patient allergies</p>
            </div>
          </div>
          
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

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}