'use client';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { RecentVisits } from '@/components/dashboard/RecentVisits';
import { AppointmentQueue } from '@/components/dashboard/AppointmentQueue';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';

export default function Dashboard() {
  const stats = useQuery(api.analytics.getDashboardStats);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <OverviewCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentQueue />
        <RecentVisits />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Register New Patient
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Schedule Appointment
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              View Today's Queue
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}