import React, { useState, useEffect, useRef } from 'react'
import { useAppSelector } from '../../store/hooks'
import { companyAPI } from '../../utils/api'

interface Appointment {
  id: number
  user_name: string
  user_email: string
  service_name: string
  service_price: number
  appointment_date: string
  appointment_time: string
  notes: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
}

interface CompanyUser {
  id: number
  name: string
  email: string
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

const Appointments: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    user_id: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  })

  useEffect(() => {
    if (user?.role === 'company') {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [appointmentsRes, servicesRes, usersRes] = await Promise.all([
        companyAPI.getAppointments(),
        companyAPI.getServices(),
        companyAPI.getCompanyUsers()
      ])

      setAppointments(appointmentsRes.data)
      setServices(servicesRes.data)
      setCompanyUsers(usersRes.data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setError('Failed to load appointments data')
    } finally {
      setLoading(false)
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await companyAPI.createAppointment({
        ...formData,
        user_id: parseInt(formData.user_id),
        service_id: parseInt(formData.service_id)
      })

      setMessage('Appointment created successfully!')
      setMessageType('success')
      setShowCreateForm(false)
      setFormData({
        user_id: '',
        service_id: '',
        appointment_date: '',
        appointment_time: '',
        notes: ''
      })
      fetchData() // Refresh the appointments list
    } catch (error: any) {
      console.error('Failed to create appointment:', error)
      setMessage(error.message || 'Failed to create appointment')
      setMessageType('error')
    }
  }

  const updateAppointmentStatus = async (appointmentId: number, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await companyAPI.updateAppointmentStatus(appointmentId, status)
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status } : appointment
      ))
      setMessage('Appointment status updated successfully!')
      setMessageType('success')
    } catch (error: any) {
      console.error('Failed to update appointment status:', error)
      setMessage(error.message || 'Failed to update appointment status')
      setMessageType('error')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      scheduled: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Prepare options for dropdowns
  const userOptions = companyUsers.map(user => ({
    id: user.id,
    label: `${user.name} (${user.email})`,
    value: user.id.toString()
  }))

  const serviceOptions = services.map(service => ({
    id: service.id,
    label: `${service.name} - $${service.price}`,
    value: service.id.toString()
  }))

  if (!user || user.role !== 'company') {
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
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Manage Appointments</h1>
        <p>View and manage all appointments for your company</p>
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
          <h2>All Appointments ({appointments.length})</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create Appointment'}
          </button>
        </div>

        {/* Create Appointment Form */}
        {showCreateForm && (
          <div className="appointment-form">
            <h3>Create New Appointment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <SearchableDropdown
                  options={userOptions}
                  value={formData.user_id}
                  onChange={(value) => handleDropdownChange('user_id', value)}
                  placeholder="Choose a user..."
                  label="Select User"
                  required
                />

                <SearchableDropdown
                  options={serviceOptions}
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
                <button type="submit" className="btn btn-primary">
                  Create Appointment
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false)
                    setFormData({
                      user_id: '',
                      service_id: '',
                      appointment_date: '',
                      appointment_time: '',
                      notes: ''
                    })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="appointments-list">
          {appointments.length === 0 ? (
            <div className="text-center text-muted">
              <p>No appointments found.</p>
            </div>
          ) : (
            <div className="appointments-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <div>
                          <div className="font-weight-bold">{appointment.user_name}</div>
                          <div className="text-muted">{appointment.user_email}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-weight-bold">{appointment.service_name}</div>
                          <div className="text-muted">${appointment.service_price}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-weight-bold">
                            {new Date(appointment.appointment_date).toLocaleDateString()}
                          </div>
                          <div className="text-muted">{appointment.appointment_time}</div>
                        </div>
                      </td>
                      <td>{getStatusBadge(appointment.status)}</td>
                      <td>
                        {appointment.notes ? (
                          <div className="notes-cell">{appointment.notes}</div>
                        ) : (
                          <span className="text-muted">No notes</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {appointment.status === 'scheduled' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              >
                                Confirm
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments
