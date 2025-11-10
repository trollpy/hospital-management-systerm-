'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface ANCFormData {
  visitDate: string
  gestationalAge: number
  bloodPressure: string
  weight: number
  fundalHeight?: number
  fetalHeartRate?: number
  presentation?: string
  urineTest?: string
  hb?: number
  bloodSugar?: number
  complaints: string[]
  assessment: string
  plan: string
  nextVisit: string
}

export function ANCForm() {
  const [formData, setFormData] = useState<ANCFormData>({
    visitDate: new Date().toISOString().split('T')[0],
    gestationalAge: 0,
    bloodPressure: '',
    weight: 0,
    complaints: [],
    assessment: '',
    plan: '',
    nextVisit: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('ANC Form Data:', formData)
    // Handle form submission
  }

  const handleChange = (field: keyof ANCFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-pink-50 border-pink-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Antenatal Care Visit</h3>
        <p className="text-gray-600">Record antenatal care visit details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Visit Date"
            type="date"
            value={formData.visitDate}
            onChange={(e) => handleChange('visitDate', e.target.value)}
            required
          />
          <Input
            label="Gestational Age (weeks)"
            type="number"
            value={formData.gestationalAge}
            onChange={(e) => handleChange('gestationalAge', parseInt(e.target.value))}
            required
          />
          <Input
            label="Blood Pressure"
            placeholder="120/80"
            value={formData.bloodPressure}
            onChange={(e) => handleChange('bloodPressure', e.target.value)}
            required
          />
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
            required
          />
          <Input
            label="Fundal Height (cm)"
            type="number"
            value={formData.fundalHeight}
            onChange={(e) => handleChange('fundalHeight', parseInt(e.target.value))}
          />
          <Input
            label="Fetal Heart Rate"
            type="number"
            value={formData.fetalHeartRate}
            onChange={(e) => handleChange('fetalHeartRate', parseInt(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="HB Level"
            type="number"
            step="0.1"
            value={formData.hb}
            onChange={(e) => handleChange('hb', parseFloat(e.target.value))}
          />
          <Input
            label="Blood Sugar"
            type="number"
            value={formData.bloodSugar}
            onChange={(e) => handleChange('bloodSugar', parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complaints
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Nausea', 'Headache', 'Back Pain', 'Swelling', 'Bleeding', 'Fever', 'Other'].map(complaint => (
              <label key={complaint} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.complaints.includes(complaint)}
                  onChange={(e) => {
                    const updatedComplaints = e.target.checked
                      ? [...formData.complaints, complaint]
                      : formData.complaints.filter(c => c !== complaint)
                    handleChange('complaints', updatedComplaints)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{complaint}</span>
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
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter assessment notes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan
          </label>
          <textarea
            value={formData.plan}
            onChange={(e) => handleChange('plan', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter care plan..."
          />
        </div>

        <Input
          label="Next Visit Date"
          type="date"
          value={formData.nextVisit}
          onChange={(e) => handleChange('nextVisit', e.target.value)}
          required
        />

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Save ANC Record
          </Button>
        </div>
      </form>
    </Card>
  )
}