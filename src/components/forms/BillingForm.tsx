'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface BillingItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface BillingFormData {
  patientId: string
  items: BillingItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
}

export function BillingForm() {
  const [formData, setFormData] = useState<BillingFormData>({
    patientId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  })

  const calculateTotals = (items: BillingItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax - formData.discount
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total,
    }))
  }

  const updateItem = (index: number, field: keyof BillingItem, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : updatedItems[index].quantity
      const unitPrice = field === 'unitPrice' ? value : updatedItems[index].unitPrice
      updatedItems[index].amount = quantity * unitPrice
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }))
    calculateTotals(updatedItems)
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, items: updatedItems }))
    calculateTotals(updatedItems)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Billing Form Data:', formData)
    // Handle form submission
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-green-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Create Invoice</h3>
        <p className="text-gray-600">Generate billing invoice for patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Patient</option>
            <option value="1">John Doe (MRN12345)</option>
            <option value="2">Jane Smith (MRN12346)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Billing Items</h4>
            <Button type="button" variant="secondary" size="sm" onClick={addItem}>
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Input
                    label="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label="Qty"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <div className="text-sm font-medium text-gray-700 mb-2">Amount</div>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    ${item.amount.toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="font-semibold">${formData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Discount:</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    discount: parseFloat(e.target.value),
                    total: prev.subtotal + prev.tax - parseFloat(e.target.value)
                  }))}
                  className="w-20"
                />
              </div>
              <span className="font-semibold">-${formData.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-green-600">${formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Generate Invoice
          </Button>
        </div>
      </form>
    </Card>
  )
}