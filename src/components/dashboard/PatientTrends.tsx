'use client'

import { Card } from '../ui/Card'
import { AreaChartComponent } from '../charts/AreaChart'

const trendData = [
  { name: 'Mon', patients: 45 },
  { name: 'Tue', patients: 52 },
  { name: 'Wed', patients: 48 },
  { name: 'Thu', patients: 60 },
  { name: 'Fri', patients: 55 },
  { name: 'Sat', patients: 40 },
  { name: 'Sun', patients: 35 },
]

export function PatientTrends() {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-indigo-50 border-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Patient Trends</h3>
          <p className="text-gray-600">Weekly patient visit patterns</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">335</p>
          <p className="text-sm text-green-600">+12% this week</p>
        </div>
      </div>
      
      <AreaChartComponent 
        data={trendData}
        dataKey="patients"
        stroke="#6366f1"
        fill="url(#colorPatients)"
        height={200}
      />
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Average Daily Patients</span>
          <span className="font-semibold text-gray-900">48 patients/day</span>
        </div>
      </div>
    </Card>
  )
}