'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface FamilyPlanningFormData {
  patientId: string
  visitDate: string
  method: string
  methodDetails?: string
  sideEffects: string[]
  assessment: string
  nextVisit?: string
}

export function FamilyPlanningForm() {
  const [formData, setFormData] = useState<FamilyPlanningFormData>({
    patientId: '',
    visitDate: new Date().toISOString().split('T')[0],
    method: '',
    sideEffects: [],
    assessment: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Family Planning Form Data:', formData)
    // Handle form submission
  }

  const handleChange = (field: keyof FamilyPlanningFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const familyPlanningMethods = [
    'Oral Contraceptives',
    'Injectable',
    'Implant',
    'IUD',
    'Condoms',
    'Natural Methods',
    'Sterilization',
    'Other'
  ]

  const commonSideEffects = [
    'Headache',
    'Nausea',
    'Weight Gain',
    'Mood Changes',
    'Irregular Bleeding',
    'No Side Effects'
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-teal-50 border-teal-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Family Planning Visit</h3>
        <p className="text-gray-600">Record family planning consultation</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value="">Select Patient</option>
              <option value="1">John Doe (MRN12345)</option>
              <option value="2">Jane Smith (MRN12346)</option>
            </select>
          </div>

          <Input
            label="Visit Date"
            type="date"
            value={formData.visitDate}
            onChange={(e) => handleChange('visitDate', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Planning Method
            </label>
            <select
              value={formData.method}
              onChange={(e) => handleChange('method', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value="">Select Method</option>
              {familyPlanningMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        {formData.method && (
          <Input
            label="Method Details"
            value={formData.methodDetails}
            onChange={(e) => handleChange('methodDetails', e.target.value)}
            placeholder="Provide specific details about the chosen method..."
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Side Effects
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {commonSideEffects.map(effect => (
              <label key={effect} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.sideEffects.includes(effect)}
                  onChange={(e) => {
                    const updatedEffects = e.target.checked
                      ? [...formData.sideEffects, effect]
                      : formData.sideEffects.filter(se => se !== effect)
                    handleChange('sideEffects', updatedEffects)
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">{effect}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment
          </label>
          <textarea
            value={formData.assessment}
            onChange={(e) => handleChange('assessment', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Enter assessment notes..."
            required
          />
        </div>

        <Input
          label="Next Visit Date (if applicable)"
          type="date"
          value={formData.nextVisit}
          onChange={(e) => handleChange('nextVisit', e.target.value)}
        />

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Save Family Planning Record
          </Button>
        </div>
      </form>
    </Card>
  )
}