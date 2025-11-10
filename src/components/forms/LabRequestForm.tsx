'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface LabTest {
  testCode: string
  testName: string
  category: string
  priority: string
  instructions?: string
}

interface LabRequestFormData {
  patientId: string
  tests: LabTest[]
  notes?: string
}

export function LabRequestForm() {
  const [formData, setFormData] = useState<LabRequestFormData>({
    patientId: '',
    tests: [{ testCode: '', testName: '', category: '', priority: 'routine' }],
  })

  const addTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, { testCode: '', testName: '', category: '', priority: 'routine' }]
    }))
  }

  const removeTest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }))
  }

  const updateTest = (index: number, field: keyof LabTest, value: string) => {
    const updatedTests = [...formData.tests]
    updatedTests[index] = { ...updatedTests[index], [field]: value }
    setFormData(prev => ({ ...prev, tests: updatedTests }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Lab Request Form Data:', formData)
    // Handle form submission
  }

  const commonTests = [
    { code: 'CBC', name: 'Complete Blood Count', category: 'Hematology' },
    { code: 'BMP', name: 'Basic Metabolic Panel', category: 'Chemistry' },
    { code: 'LFT', name: 'Liver Function Test', category: 'Chemistry' },
    { code: 'TFT', name: 'Thyroid Function Test', category: 'Chemistry' },
    { code: 'UA', name: 'Urinalysis', category: 'Microbiology' },
    { code: 'CULT', name: 'Culture & Sensitivity', category: 'Microbiology' },
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Laboratory Request</h3>
        <p className="text-gray-600">Order laboratory tests for patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Patient</option>
            <option value="1">John Doe (MRN12345)</option>
            <option value="2">Jane Smith (MRN12346)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Laboratory Tests</h4>
            <Button type="button" variant="secondary" size="sm" onClick={addTest}>
              Add Test
            </Button>
          </div>

          <div className="space-y-4">
            {formData.tests.map((test, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-4 bg-white/50 rounded-lg border border-gray-200">
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Code
                  </label>
                  <select
                    value={test.testCode}
                    onChange={(e) => {
                      const selectedTest = commonTests.find(t => t.code === e.target.value)
                      if (selectedTest) {
                        updateTest(index, 'testCode', selectedTest.code)
                        updateTest(index, 'testName', selectedTest.name)
                        updateTest(index, 'category', selectedTest.category)
                      } else {
                        updateTest(index, 'testCode', e.target.value)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Test</option>
                    {commonTests.map(test => (
                      <option key={test.code} value={test.code}>
                        {test.code} - {test.name}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Input
                    label="Test Name"
                    value={test.testName}
                    onChange={(e) => updateTest(index, 'testName', e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-12 md:col-span-2">
                  <Input
                    label="Category"
                    value={test.category}
                    onChange={(e) => updateTest(index, 'category', e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={test.priority}
                    onChange={(e) => updateTest(index, 'priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT</option>
                  </select>
                </div>

                <div className="col-span-12 md:col-span-1">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeTest(index)}
                    disabled={formData.tests.length === 1}
                    className="mt-6"
                  >
                    Remove
                  </Button>
                </div>

                <div className="col-span-12">
                  <Input
                    label="Special Instructions"
                    value={test.instructions}
                    onChange={(e) => updateTest(index, 'instructions', e.target.value)}
                    placeholder="Any special instructions for this test..."
                  />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional notes for the laboratory..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Submit Lab Request
          </Button>
        </div>
      </form>
    </Card>
  )
}