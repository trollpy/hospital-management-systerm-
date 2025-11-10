'use client';
import { Card } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', patients: 12, revenue: 2400 },
  { name: 'Tue', patients: 19, revenue: 4300 },
  { name: 'Wed', patients: 15, revenue: 3200 },
  { name: 'Thu', patients: 22, revenue: 5100 },
  { name: 'Fri', patients: 18, revenue: 3900 },
  { name: 'Sat', patients: 8, revenue: 1800 },
  { name: 'Sun', patients: 5, revenue: 1200 },
];

export function AnalyticsChart() {
  return (
    <Card title="Weekly Analytics" className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="patients" fill="#0ea5e9" name="Patients" />
          <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}