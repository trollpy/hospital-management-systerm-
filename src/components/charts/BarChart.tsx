'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface BarChartProps {
  data: any[]
  dataKey: string
  height?: number
  colors?: string[]
}

const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export function BarChartComponent({ 
  data, 
  dataKey, 
  height = 300,
  colors = defaultColors
}: BarChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar 
            dataKey={dataKey} 
            radius={[4, 4, 0, 0]}
            barSize={40}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}