'use client'

import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Paracetamol stock is below minimum level',
    time: '5 min ago',
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: 'success',
    title: 'Lab Results Ready',
    message: 'Blood test results for Patient #1234 are available',
    time: '15 min ago',
    icon: CheckCircle,
  },
  {
    id: 3,
    type: 'info',
    title: 'New Appointment',
    message: 'New appointment scheduled for 2:00 PM',
    time: '1 hour ago',
    icon: Info,
  },
]

export function NotificationsPanel() {
  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-500 bg-orange-100'
      case 'success': return 'text-green-500 bg-green-100'
      case 'info': return 'text-blue-500 bg-blue-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-orange-50 border-orange-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
            <p className="text-gray-600">Recent system alerts</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="bg-white/80 backdrop-blur-sm">
          Mark All Read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          return (
            <div 
              key={notification.id}
              className="flex items-start space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(notification.type)}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {notification.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button variant="secondary" className="w-full bg-white/80 backdrop-blur-sm">
          View All Notifications
        </Button>
      </div>
    </Card>
  )
}