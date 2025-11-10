'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react'
import { Search, Filter, Calendar, Clock, User, Phone } from 'lucide-react'

export default function ANCFollowUpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock follow-up data
  const followUpPatients = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientId: 'MRN12345',
      lastVisit: '2024-01-15',
      nextVisit: '2024-02-12',
      gestationalAge: 28,
      reason: 'Routine checkup',
      priority: 'high',
      contact: '+1 (555) 123-4567',
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      patientId: 'MRN12346',
      lastVisit: '2024-01-14',
      nextVisit: '2024-02-11',
      gestationalAge: 32,
      reason: 'Blood pressure monitoring',
      priority: 'medium',
      contact: '+1 (555) 123-4568',
    },
    {
      id: '3',
      patientName: 'Jennifer Smith',
      patientId: 'MRN12347',
      lastVisit: '2024-01-13',
      nextVisit: '2024-01-27',
      gestationalAge: 36,
      reason: 'Final trimester check',
      priority: 'low',
      contact: '+1 (555) 123-4569',
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const isOverdue = (date: string) => {
    return new Date(date) < new Date()
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ANC Follow-up</h1>
            <p className="text-gray-600">Track and manage patient follow-up appointments</p>
          </div>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Upcoming Follow-ups</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search patients..."
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

        {/* Follow-up Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Gestational Age</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUpPatients.map((patient) => (
                <TableRow key={patient.id} hover className={isOverdue(patient.nextVisit) ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{patient.patientName}</div>
                      <div className="text-sm text-gray-500">{patient.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{patient.gestationalAge} weeks</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm font-medium ${
                      isOverdue(patient.nextVisit) ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {new Date(patient.nextVisit).toLocaleDateString()}
                      {isOverdue(patient.nextVisit) && (
                        <Badge variant="danger" className="ml-2">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{patient.reason}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(patient.priority)}>
                      {patient.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      {patient.contact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm">
                        Contact
                      </Button>
                      <Button variant="secondary" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Action Required Section */}
        <Card className="p-6 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-900">Action Required</h3>
              <p className="text-orange-700">3 patients have overdue follow-up appointments</p>
            </div>
            <Button variant="warning">
              Send Reminders
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}