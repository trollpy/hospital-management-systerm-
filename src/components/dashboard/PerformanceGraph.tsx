'use client'

import { Card } from '../ui/Card'
import { BarChartComponent } from '../charts/BarChart'

const performanceData = [
  { name: 'Dr. Smith', efficiency: 92 },
  { name: 'Dr. Johnson', efficiency: 88 },
  { name: 'Dr. Williams', efficiency: 95 },
  { name: 'Dr. Brown', efficiency: 85 },
  { name: 'Dr. Davis', efficiency: 90 },
]

export function PerformanceGraph() {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-red-50 border-red-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Staff Performance</h3>
        <p className="text-gray-600">Efficiency ratings by provider</p>
      </div>
      
      <BarChartComponent 
        data={performanceData}
        dataKey="efficiency"
        height={250}
        colors={['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']}
      />
      
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-gray-600">Based on patient feedback and visit completion</span>
        <span className="font-semibold text-gray-900">Avg: 90%</span>
      </div>
    </Card>
  )
}