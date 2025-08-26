import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useAppSelector } from '../../store/hooks'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../../utils/api'
import { AppointmentStatusBadge, Button } from '../shared'

interface Appointment {
  id: number
  company_name: string
  service_name: string
  service_price: number
  appointment_date: string
  appointment_time: string
  notes: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    appointment: Appointment
  }
}

const Calendar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)

  useEffect(() => {
    if (user?.role === 'user') {
      fetchAppointments()
    }
  }, [user])

  // Cleanup modal-open class when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const response = await userAPI.getMyAppointments()
      setAppointments(response.data)
      setError('')
    } catch (error) {
      setError('Failed to load appointments data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fbbf24', border: '#f59e0b', text: '#ffffff' }
      case 'scheduled':
        return { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' }
      case 'completed':
        return { bg: '#10b981', border: '#059669', text: '#ffffff' }
      case 'cancelled':
        return { bg: '#ef4444', border: '#dc2626', text: '#ffffff' }
      default:
        return { bg: '#6b7280', border: '#4b5563', text: '#ffffff' }
    }
  }

  const formatCalendarEvents = (appointments: Appointment[]): CalendarEvent[] => {
    return appointments.map(appointment => {
      const colors = getStatusColor(appointment.status)
      const startDateTime = `${appointment.appointment_date}T${appointment.appointment_time}`
      
      // Calculate end time (assuming 1 hour duration if not specified)
      const startDate = new Date(startDateTime)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour later
      const endDateTime = endDate.toISOString()

      return {
        id: appointment.id.toString(),
        title: `${appointment.company_name} - ${appointment.service_name}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: {
          appointment
        }
      }
    })
  }

  const handleEventClick = (info: any) => {
    const appointment = info.event.extendedProps.appointment
    setSelectedEvent(appointment)
    setShowEventModal(true)
    // Prevent body scroll when modal is open
    document.body.classList.add('modal-open')
  }

  const cancelAppointment = async (appointmentId: number) => {
    try {
      await userAPI.cancelAppointment(appointmentId)
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status: 'cancelled' } : appointment
      ))
      setMessage('Appointment cancelled successfully!')
      setMessageType('success')
      setShowEventModal(false)
    } catch (error: any) {
      setMessage(error.message || 'Failed to cancel appointment')
      setMessageType('error')
    }
  }

  const getStatusBadge = (status: string) => {
    return <AppointmentStatusBadge status={status as any} size="sm" />
  }

  if (!user || user.role !== 'user') {
    return (
      <div className="container">
        <div className="card">
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Appointments Calendar</h1>
        <p>View your appointments in calendar format</p>
      </div>

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="header-content">
            <div className="header-left">
              <h2>Calendar View</h2>
              <p>Total appointments: {appointments.length}</p>
            </div>
            <div className="header-actions">
              <Button 
                variant="outline"
                onClick={() => navigate('/user/my-appointments')}
              >
                📋 List View
              </Button>
              <Button 
                variant="primary"
                onClick={() => navigate('/user/book-appointment')}
              >
                📅 Book New Appointment
              </Button>
              <Button 
                variant="secondary"
                onClick={fetchAppointments}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={formatCalendarEvents(appointments)}
            eventClick={handleEventClick}
            height="auto"
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => {
          setShowEventModal(false)
          document.body.classList.remove('modal-open')
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Appointment Details</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowEventModal(false)
                  document.body.classList.remove('modal-open')
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="event-details">
                <div className="detail-row">
                  <label>Company:</label>
                  <div>
                    <div className="font-weight-bold">{selectedEvent.company_name}</div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <label>Service:</label>
                  <div>
                    <div className="font-weight-bold">{selectedEvent.service_name}</div>
                    <div className="text-muted">${selectedEvent.service_price}</div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <label>Date & Time:</label>
                  <div>
                    <div className="font-weight-bold">
                      {new Date(selectedEvent.appointment_date).toLocaleDateString()}
                    </div>
                    <div className="text-muted">{selectedEvent.appointment_time}</div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <label>Status:</label>
                  <div>{getStatusBadge(selectedEvent.status)}</div>
                </div>
                
                {selectedEvent.notes && (
                  <div className="detail-row">
                    <label>Notes:</label>
                    <div className="notes-content">{selectedEvent.notes}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="action-buttons">
                {selectedEvent.status === 'pending' && (
                  <Button
                    variant="danger"
                    onClick={() => cancelAppointment(selectedEvent.id)}
                  >
                    Cancel Appointment
                  </Button>
                )}
                                 <Button
                   variant="secondary"
                   onClick={() => {
                     setShowEventModal(false)
                     document.body.classList.remove('modal-open')
                   }}
                 >
                   Close
                 </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
