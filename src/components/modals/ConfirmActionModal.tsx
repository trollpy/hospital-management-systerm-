'use client'

import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { AlertTriangle, CheckCircle, Info, Trash2, Archive } from 'lucide-react'

interface ConfirmActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  type?: 'danger' | 'warning' | 'info' | 'success'
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}: ConfirmActionModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-6 h-6 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      default:
        return <AlertTriangle className="w-6 h-6 text-orange-600" />
    }
  }

  const getButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'danger'
      case 'warning':
        return 'warning'
      case 'info':
        return 'primary'
      case 'success':
        return 'success'
      default:
        return 'primary'
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-orange-50 border-orange-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-orange-50 border-orange-200'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 rounded-full ${getBackgroundColor()} border flex items-center justify-center mb-4`}>
          {getIcon()}
        </div>

        {/* Title and Message */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-center space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}