'use client'

import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Download, Printer, Mail, Calendar, User } from 'lucide-react'

interface BillingReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  receiptData: {
    invoiceNumber: string
    patientName: string
    date: string
    items: Array<{
      description: string
      quantity: number
      unitPrice: number
      amount: number
    }>
    subtotal: number
    tax: number
    discount: number
    total: number
  }
}

export function BillingReceiptModal({ isOpen, onClose, receiptData }: BillingReceiptModalProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implement download logic
    console.log('Downloading receipt...')
  }

  const handleEmail = () => {
    // Implement email logic
    console.log('Emailing receipt...')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Receipt"
      size="md"
    >
      <div className="space-y-6">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful</h3>
          <p className="text-green-600 font-semibold">Invoice #{receiptData.invoiceNumber}</p>
        </div>

        {/* Patient and Date Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-gray-600">Patient</p>
              <p className="font-medium">{receiptData.patientName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{receiptData.date}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
          <div className="space-y-3">
            {receiptData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{item.description}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">${item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>${receiptData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span>${receiptData.tax.toFixed(2)}</span>
          </div>
          {receiptData.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span className="text-green-600">-${receiptData.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span className="text-green-600">${receiptData.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="secondary" size="sm" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Thank you for your payment. This receipt has been generated electronically.
          </p>
        </div>
      </div>
    </Modal>
  )
}