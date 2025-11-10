'use client'

import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  height?: number
  colors?: string[]
}

const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export function PieChartComponent({ 
  data, 
  dataKey, 
  nameKey, 
  height = 300,
  colors = defaultColors
}: PieChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [value, 'Count']}
            contentStyle={{ 
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  )
}