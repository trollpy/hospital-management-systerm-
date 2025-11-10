'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  // Mock appointments data
  const appointments = [
    {
      id: '1',
      title: 'John Doe - Checkup',
      start: new Date(2024, 0, 15, 9, 0),
      end: new Date(2024, 0, 15, 9, 30),
      type: 'consultation',
      provider: 'Dr. Smith',
    },
    {
      id: '2',
      title: 'Jane Smith - Follow-up',
      start: new Date(2024, 0, 15, 10, 30),
      end: new Date(2024, 0, 15, 11, 15),
      type: 'follow-up',
      provider: 'Dr. Johnson',
    },
    {
      id: '3',
      title: 'Emergency - Mike Wilson',
      start: new Date(2024, 0, 15, 14, 0),
      end: new Date(2024, 0, 15, 15, 0),
      type: 'emergency',
      provider: 'Dr. Brown',
    },
  ]

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'follow-up': return 'bg-green-100 text-green-800 border-green-200'
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDay = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days = []
    
    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        appointments: []
      })
    }
    
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i)
      const dayAppointments = appointments.filter(apt => 
        apt.start.getDate() === i && 
        apt.start.getMonth() === month && 
        apt.start.getFullYear() === year
      )
      days.push({
        date,
        isCurrentMonth: true,
        appointments: dayAppointments
      })
    }
    
    // Next month's days
    const totalCells = 42 // 6 weeks
    const remainingDays = totalCells - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        appointments: []
      })
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">View and manage appointment schedules</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Calendar Controls */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex space-x-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigateDate('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['month', 'week', 'day'] as const).map((viewType) => (
                  <button
                    key={viewType}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      view === viewType
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setView(viewType)}
                  >
                    {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                  </button>
                ))}
              </div>
              <Button variant="secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <Card>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-900 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : ''
                } ${
                  day.date.toDateString() === new Date().toDateString()
                    ? 'bg-blue-50 border-blue-200'
                    : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm font-medium ${
                      !day.isCurrentMonth
                        ? 'text-gray-400'
                        : day.date.toDateString() === new Date().toDateString()
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.isCurrentMonth && day.appointments.length > 0 && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>

                {/* Appointments for the day */}
                <div className="space-y-1">
                  {day.appointments.slice(0, 2).map((appt) => (
                    <div
                      key={appt.id}
                      className={`text-xs p-1 rounded border ${getTypeColor(appt.type)} truncate`}
                      title={appt.title}
                    >
                      {appt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {appt.title}
                    </div>
                  ))}
                  {day.appointments.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{day.appointments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-gray-600">Consultation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-gray-600">Follow-up</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-gray-600">Emergency</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-gray-600">Other</span>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}