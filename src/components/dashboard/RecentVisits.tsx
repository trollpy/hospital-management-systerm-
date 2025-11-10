'use client'

import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useConvexQuery } from '@/hooks/useConvex'
import { api } from '../../../../convex/_generated/api'
import { formatDateTime } from '@/utils/formatters'
import { User, Clock, Stethoscope } from 'lucide-react'

export function RecentVisits() {
  const visits = useConvexQuery(api.visits.getTodayVisits) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'triaged':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'in-progress':
        return '🔄'
      case 'triaged':
        return '⏳'
      default:
        return '📝'
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Visits</h3>
          <p className="text-gray-600">Today's patient consultations</p>
        </div>
        <Button variant="secondary" size="sm" className="bg-white/80 backdrop-blur-sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {visits.slice(0, 5).map((visit) => (
          <div 
            key={visit._id} 
            className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                {getStatusIcon(visit.status)}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    Visit #{visit._id.slice(0, 8)}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDateTime(visit.startTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Stethoscope className="w-4 h-4" />
                    <span className="capitalize">{visit.type}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(visit.status)}`}>
                {visit.status.replace('-', ' ')}
              </span>
              <Button size="sm" variant="secondary" className="bg-white/80">
                View
              </Button>
            </div>
          </div>
        ))}
        
        {visits.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Visits Today</h4>
            <p className="text-gray-500">Patient visits will appear here</p>
          </div>
        )}
      </div>
    </Card>
  )
}