'use client'

import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useConvexQuery } from '@/hooks/useConvex'
import { api } from '../../../../convex/_generated/api'
import { formatTime } from '@/utils/formatters'
import { Clock, User, Stethoscope } from 'lucide-react'

export function AppointmentQueue() {
  const queue = useConvexQuery(api.queries.queue.getQueue) || []

  const getPatientColor = (index: number) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-orange-500 to-orange-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Appointment Queue</h3>
          <p className="text-gray-600">Current waiting patients</p>
        </div>
        <Button variant="secondary" size="sm" className="bg-white/80 backdrop-blur-sm">
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4">
        {queue.slice(0, 6).map((item, index) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${getPatientColor(index)} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                {index + 1}
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Patient {item.patientId.slice(0, 8)}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(item.scheduledTime)}</span>
                    <Stethoscope className="w-4 h-4 ml-2" />
                    <span className="capitalize">{item.type}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg"
            >
              Start Visit
            </Button>
          </div>
        ))}
        
        {queue.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Queue is Empty</h4>
            <p className="text-gray-500">No appointments waiting at the moment</p>
          </div>
        )}
      </div>
    </Card>
  )
}