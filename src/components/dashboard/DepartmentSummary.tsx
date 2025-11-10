'use client'

import { Card } from '../ui/Card'
import { DonutChartComponent } from '../charts/DonutChart'

const departmentData = [
  { name: 'General Medicine', value: 35, color: '#0ea5e9' },
  { name: 'Pediatrics', value: 25, color: '#8b5cf6' },
  { name: 'Surgery', value: 20, color: '#10b981' },
  { name: 'Obstetrics', value: 15, color: '#f59e0b' },
  { name: 'Emergency', value: 5, color: '#ef4444' },
]

export function DepartmentSummary() {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-green-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Department Distribution</h3>
        <p className="text-gray-600">Patient visits by department</p>
      </div>
      
      <div className="flex items-center">
        <div className="w-1/2">
          <DonutChartComponent 
            data={departmentData}
            dataKey="value"
            nameKey="name"
            height={200}
          />
        </div>
        
        <div className="w-1/2 space-y-4">
          {departmentData.map((dept, index) => (
            <div key={dept.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dept.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{dept.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{dept.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Departments</span>
          <span className="text-sm font-bold text-gray-900">5 Active</span>
        </div>
      </div>
    </Card>
  )
}