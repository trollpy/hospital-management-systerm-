'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { useConvexQuery } from '@/hooks/useConvex'
import { api } from '../../../../convex/_generated/api'
import { useState } from 'react'
import { Search, Filter, Plus, Calendar, Clock, User, MapPin } from 'lucide-react'

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('today')
  
  const { data: appointments, isLoading } = useConvexQuery(api.appointments.getToday)

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      patientId: 'MRN12345',
      scheduledAt: '2024-01-15T09:00:00',
      duration: 30,
      type: 'Consultation',
      reason: 'Routine checkup',
      provider: 'Dr. Smith',
      status: 'scheduled',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      patientId: 'MRN12346',
      scheduledAt: '2024-01-15T10:30:00',
      duration: 45,
      type: 'Follow-up',
      reason: 'Blood test results',
      provider: 'Dr. Johnson',
      status: 'confirmed',
    },
    {
      id: '3',
      patientName: 'Mike Wilson',
      patientId: 'MRN12347',
      scheduledAt: '2024-01-15T14:00:00',
      duration: 60,
      type: 'Emergency',
      reason: 'Chest pain',
      provider: 'Dr. Brown',
      status: 'in-progress',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'confirmed': return 'success'
      case 'in-progress': return 'warning'
      case 'completed': return 'primary'
      case 'cancelled': return 'danger'
      default: return 'default'
    }
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const tabs = [
    { id: 'today', label: "Today's Appointments", badge: mockAppointments.length },
    { id: 'upcoming', label: 'Upcoming', badge: 24 },
    { id: 'pending', label: 'Pending Confirmation', badge: 8 },
    { id: 'cancelled', label: 'Cancelled', badge: 3 },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600">Manage patient appointments and schedules</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No-shows</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search appointments by patient, provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          defaultTab="today"
        />

        {/* Appointments Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {formatTime(appointment.scheduledAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{appointment.provider}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{appointment.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {appointment.reason}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{appointment.duration} min</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(appointment.status)}>
                      {appointment.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {mockAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-4">Get started by scheduling a new appointment</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Schedule</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                15 min Consultation
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                30 min Follow-up
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                60 min Procedure
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {mockAppointments.slice(0, 3).map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{appt.patientName}</div>
                    <div className="text-xs text-gray-500">{formatTime(appt.scheduledAt)}</div>
                  </div>
                  <Badge variant={getStatusColor(appt.status)} size="sm">
                    {appt.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminders</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm font-medium text-yellow-800">2 unconfirmed appointments</div>
                <div className="text-xs text-yellow-600">Send confirmation reminders</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800">3 appointments tomorrow</div>
                <div className="text-xs text-blue-600">Prepare patient files</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}