import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppointmentStatusBadge } from '../shared'
import Button from '../shared/Button'

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

interface Company {
  id: number
  name: string
  address: string
  contact: string
  status: string
}

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
}

interface SearchableDropdownProps {
  options: Array<{ id: number | string; label: string; value: string }>
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  required?: boolean
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: { id: number | string; label: string; value: string }) => {
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="form-group">
      <label htmlFor={`dropdown-${label}`}>{label} {required && '*'}</label>
      <div className="searchable-dropdown" ref={dropdownRef}>
        <div 
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="text"
            className="dropdown-input"
            placeholder={placeholder}
            value={selectedOption ? selectedOption.label : ''}
            readOnly
          />
          <span className="dropdown-arrow">▼</span>
        </div>
        
        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                autoFocus
              />
            </div>
            <div className="dropdown-options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="dropdown-no-results">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const MyAppointments: React.FC = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    company_id: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  })

  useEffect(() => {
    fetchAppointments()
    fetchCompanies()
  }, [])

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/my-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setAppointments(data.data)
      } else {
        setError(data.message || 'Failed to fetch appointments')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/all-companies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setCompanies(data.data)
      } else {
        setError(data.message || 'Failed to fetch companies')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const fetchServices = async (companyId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/user/services?company_id=${companyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setServices(data.data)
      } else {
        setError(data.message || 'Failed to fetch services')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDropdownChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // If company is selected, fetch its services
    if (name === 'company_id' && value) {
      fetchServices(value)
      // Reset service selection when company changes
      setFormData(prev => ({
        ...prev,
        service_id: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          company_id: parseInt(formData.company_id),
          service_id: parseInt(formData.service_id)
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('Appointment booked successfully!')
        setMessageType('success')
        setShowCreateForm(false)
        setFormData({
          company_id: '',
          service_id: '',
          appointment_date: '',
          appointment_time: '',
          notes: ''
        })
        setServices([])
        fetchAppointments() // Refresh the appointments list
      } else {
        setMessage(data.message || 'Failed to book appointment')
        setMessageType('error')
      }
    } catch (error: any) {
      setMessage('Network error. Please try again.')
      setMessageType('error')
    }
  }

  const cancelAppointment = async (appointmentId: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/user/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAppointments(prev => prev.map(appointment => 
          appointment.id === appointmentId ? { ...appointment, status: 'cancelled' } : appointment
        ))
      } else {
        setError(data.message || 'Failed to cancel appointment')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const getStatusBadge = (status: string) => {
    return <AppointmentStatusBadge status={status as any} size="sm" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const canCancel = (status: string) => {
    return status === 'pending' || status === 'scheduled'
  }

  if (loading) {
    return <div className="container">Loading your appointments...</div>
  }

  return (
    <div>
      <h1>My Appointments</h1>
      
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
              <h2>All Appointments ({appointments.length})</h2>
            </div>
            <div className="header-actions">
              <Button 
                variant="outline"
                onClick={() => navigate('/user/calendar')}
              >
                📅 Calendar View
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'Cancel' : 'Create Appointment'}
              </Button>
            </div>
          </div>
        </div>

        {/* Create Appointment Form */}
        {showCreateForm && (
          <div className="appointment-form">
            <h3>Book New Appointment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <SearchableDropdown
                  options={companies.map(company => ({
                    id: company.id,
                    label: `${company.name} - ${company.address}`,
                    value: company.id.toString()
                  }))}
                  value={formData.company_id}
                  onChange={(value) => handleDropdownChange('company_id', value)}
                  placeholder="Choose a company..."
                  label="Select Company"
                  required
                />

                <SearchableDropdown
                  options={services.map(service => ({
                    id: service.id,
                    label: `${service.name} - $${service.price}`,
                    value: service.id.toString()
                  }))}
                  value={formData.service_id}
                  onChange={(value) => handleDropdownChange('service_id', value)}
                  placeholder="Choose a service..."
                  label="Select Service"
                  required
                />

                <div className="form-group">
                  <label htmlFor="appointment_date">Appointment Date *</label>
                  <input
                    type="date"
                    id="appointment_date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="appointment_time">Appointment Time *</label>
                  <input
                    type="time"
                    id="appointment_time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Optional notes about the appointment..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-actions">
                <Button type="submit" variant="primary">
                  Book Appointment
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    setShowCreateForm(false)
                    setFormData({
                      company_id: '',
                      service_id: '',
                      appointment_date: '',
                      appointment_time: '',
                      notes: ''
                    })
                    setServices([])
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {appointments.length === 0 ? (
          <p>You don't have any appointments yet. <a href="/user/companies">Browse companies</a> to book your first appointment!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Company</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Service</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date & Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <strong>{appointment.company_name}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>{appointment.service_name}</td>
                    <td style={{ padding: '12px' }}>
                      <div>{formatDate(appointment.appointment_date)}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{formatTime(appointment.appointment_time)}</div>
                    </td>
                    <td style={{ padding: '12px' }}>${appointment.service_price}</td>
                    <td style={{ padding: '12px' }}>{getStatusBadge(appointment.status)}</td>
                    <td style={{ padding: '12px' }}>
                      {canCancel(appointment.status) && (
                        <Button
                          onClick={() => cancelAppointment(appointment.id)}
                          variant="danger"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointments
