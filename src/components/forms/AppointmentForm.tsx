'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface AppointmentFormData {
  patientId: string
  providerId: string
  scheduledAt: string
  duration: number
  type: string
  reason: string
  notes?: string
}

export function AppointmentForm() {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    providerId: '',
    scheduledAt: '',
    duration: 30,
    type: '',
    reason: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Appointment Form Data:', formData)
    // Handle form submission
  }

  const handleChange = (field: keyof AppointmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Appointment</h3>
        <p className="text-gray-600">Book a new appointment for a patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              Provider
            </label>
            <select
              value={formData.providerId}
              onChange={(e) => handleChange('providerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select Provider</option>
              <option value="1">Dr. Smith</option>
              <option value="2">Dr. Johnson</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date & Time"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => handleChange('scheduledAt', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select Type</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
              <option value="routine">Routine Checkup</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Visit
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe the reason for this appointment..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Any additional notes..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Schedule Appointment
          </Button>
        </div>
      </form>
    </Card>
  )
}