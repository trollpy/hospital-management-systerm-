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
import { Search, Filter, Plus, Calendar, Users, AlertTriangle, Baby } from 'lucide-react'

export default function ANCPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  
  const { data: ancVisits, isLoading } = useConvexQuery(api.anc.getVisitsByPatient, {
    patientId: 'all' // This would need to be implemented
  })

  // Mock data for demonstration
  const mockVisits = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientId: 'MRN12345',
      visitDate: '2024-01-15',
      gestationalAge: 28,
      bloodPressure: '120/80',
      weight: 65.5,
      nextVisit: '2024-02-12',
      riskLevel: 'low',
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      patientId: 'MRN12346',
      visitDate: '2024-01-14',
      gestationalAge: 32,
      bloodPressure: '130/85',
      weight: 68.2,
      nextVisit: '2024-02-11',
      riskLevel: 'medium',
    },
    {
      id: '3',
      patientName: 'Jennifer Smith',
      patientId: 'MRN12347',
      visitDate: '2024-01-13',
      gestationalAge: 36,
      bloodPressure: '118/78',
      weight: 71.8,
      nextVisit: '2024-01-27',
      riskLevel: 'low',
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const tabs = [
    { id: 'all', label: 'All Visits', badge: mockVisits.length },
    { id: 'upcoming', label: 'Upcoming', badge: 12 },
    { id: 'high-risk', label: 'High Risk', badge: 3 },
    { id: 'overdue', label: 'Overdue', badge: 2 },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Antenatal Care</h1>
            <p className="text-gray-600">Manage antenatal visits and patient care</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New ANC Visit
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Week</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
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
                placeholder="Search patients by name, MRN..."
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
          defaultTab="all"
        />

        {/* ANC Visits Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Gestational Age</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Next Visit</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVisits.map((visit) => (
                <TableRow key={visit.id} hover>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{visit.patientName}</div>
                      <div className="text-sm text-gray-500">{visit.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{visit.gestationalAge} weeks</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${
                      visit.bloodPressure === '130/85' ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {visit.bloodPressure}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{visit.weight} kg</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {new Date(visit.nextVisit).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskColor(visit.riskLevel)}>
                      {visit.riskLevel}
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

          {mockVisits.length === 0 && (
            <div className="text-center py-12">
              <Baby className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ANC visits found</h3>
              <p className="text-gray-600 mb-4">Get started by adding a new ANC visit</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add ANC Visit
              </Button>
            </div>
          )}
        </Card>

        {/* Upcoming Visits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Visits */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Visits</h3>
            <div className="space-y-4">
              {mockVisits.slice(0, 3).map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{visit.patientName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(visit.nextVisit).toLocaleDateString()} • {visit.gestationalAge} weeks
                    </div>
                  </div>
                  <Badge variant={getRiskColor(visit.riskLevel)}>
                    {visit.riskLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Assessment */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-800">High Risk</span>
                <span className="text-red-800 font-bold">3 Patients</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-orange-800">Medium Risk</span>
                <span className="text-orange-800 font-bold">5 Patients</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">Low Risk</span>
                <span className="text-green-800 font-bold">16 Patients</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}