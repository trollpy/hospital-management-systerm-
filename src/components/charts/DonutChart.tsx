'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface DonutChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  height?: number
  colors?: string[]
}

const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export function DonutChartComponent({ 
  data, 
  dataKey, 
  nameKey, 
  height = 300,
  colors = defaultColors
}: DonutChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
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
            contentStyle={{ 
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend 
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: '20px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}