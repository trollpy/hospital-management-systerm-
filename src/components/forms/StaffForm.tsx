'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface StaffFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  specialization?: string
  licenseNumber?: string
  hireDate: string
}

export function StaffForm() {
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    specialization: '',
    licenseNumber: '',
    hireDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Staff Form Data:', formData)
    // Handle form submission
  }

  const handleChange = (field: keyof StaffFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const roles = [
    'super-admin',
    'admin',
    'clinician',
    'nurse',
    'pharmacist',
    'lab-tech',
    'accountant',
    'reception'
  ]

  const departments = [
    'General Medicine',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Surgery',
    'Orthopedics',
    'Cardiology',
    'Emergency',
    'ICU',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'Administration'
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-red-50 border-red-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Staff Registration</h3>
        <p className="text-gray-600">Add new staff member to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {(formData.role === 'clinician' || formData.role === 'nurse') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              placeholder="e.g., Cardiology, Pediatrics, etc."
            />
            <Input
              label="License Number"
              value={formData.licenseNumber}
              onChange={(e) => handleChange('licenseNumber', e.target.value)}
              placeholder="Professional license number"
            />
          </div>
        )}

        <Input
          label="Hire Date"
          type="date"
          value={formData.hireDate}
          onChange={(e) => handleChange('hireDate', e.target.value)}
          required
        />

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Register Staff
          </Button>
        </div>
      </form>
    </Card>
  )
}