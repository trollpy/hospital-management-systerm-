'use client'

import { Card } from '../ui/Card'
import { useConvexQuery } from '@/hooks/useConvex'
import { api } from '../../../../convex/_generated/api'
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react'

export function OverviewCards() {
  const stats = useConvexQuery(api.queries.patients.getStats)

  const cards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      title: "Today's Visits",
      value: stats?.todayVisits || 0,
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
    },
    {
      title: 'Active Visits',
      value: stats?.activeVisits || 0,
      change: '-2%',
      trend: 'down',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Appointments',
      value: stats?.todayAppointments || 0,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card 
            key={index} 
            className={`p-6 ${card.bgColor} border ${card.borderColor} backdrop-blur-sm bg-opacity-50 hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                <div className={`flex items-center text-sm ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    card.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span>{card.change} from yesterday</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}