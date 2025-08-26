import React, { useState, useEffect, useRef } from 'react'
import { useAppSelector } from '../../store/hooks'
import { useNavigate } from 'react-router-dom'
import { companyAPI } from '../../utils/api'
import { AppointmentStatusBadge, Button } from '../shared'

interface Appointment {
  id: number
  user_name: string
  user_email: string
  service_name: string
  service_price: number
  appointment_date: string
  appointment_time: string
  notes: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  status: 'active' | 'archived'
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
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [formData, setFormData] = useState({
    user_id: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  })
  const [filters, setFilters] = useState({
    status: '',
    customerName: '',
    serviceName: '',
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: ''
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
      setMessage(error.message || 'Failed to create appointment')
      setMessageType('error')
    }
  }

  const updateAppointmentStatus = async (appointmentId: number, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      await companyAPI.updateAppointmentStatus(appointmentId, status)
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status } : appointment
      ))
      setMessage('Appointment status updated successfully!')
      setMessageType('success')
    } catch (error: any) {
      setMessage(error.message || 'Failed to update appointment status')
      setMessageType('error')
    }
  }

  const getStatusBadge = (status: string) => {
    return <AppointmentStatusBadge status={status as any} size="sm" />
  }

  // Prepare options for dropdowns
  const userOptions = companyUsers.map(user => ({
    id: user.id,
    label: `${user.name} (${user.email})`,
    value: user.id.toString()
  }))

  // Filter out archived services - only show active services for new appointments
  // This ensures companies can only create appointments for active services
  const serviceOptions = services
    .filter(service => service.status === 'active') // Only show active services
    .map(service => ({
      id: service.id,
      label: `${service.name} - $${service.price}`,
      value: service.id.toString()
    }))

  // Filter appointments based on current filters
  const filteredAppointments = appointments.filter(appointment => {
    // Status filter
    if (filters.status && appointment.status !== filters.status) {
      return false
    }

    // Customer name filter
    if (filters.customerName && !appointment.user_name.toLowerCase().includes(filters.customerName.toLowerCase())) {
      return false
    }

    // Service name filter
    if (filters.serviceName && !appointment.service_name.toLowerCase().includes(filters.serviceName.toLowerCase())) {
      return false
    }

    // Date range filter
    if (filters.startDate && new Date(appointment.appointment_date) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(appointment.appointment_date) > new Date(filters.endDate)) {
      return false
    }

    // Price range filter
    if (filters.minPrice && appointment.service_price < parseFloat(filters.minPrice)) {
      return false
    }
    if (filters.maxPrice && appointment.service_price > parseFloat(filters.maxPrice)) {
      return false
    }

    return true
  })

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      customerName: '',
      serviceName: '',
      startDate: '',
      endDate: '',
      minPrice: '',
      maxPrice: ''
    })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length
  }

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
          <div className="header-content">
            <div className="header-left">
              <h2>All Appointments ({filteredAppointments.length} of {appointments.length})</h2>
              {getActiveFiltersCount() > 0 && (
                <span className="filter-badge">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <div className="header-actions">
              <Button 
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="filter-icon">🔍</span>
                Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/company/calendar')}
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

        {/* Filters Section */}
        {showFilters && (
          <div className="filters-section">
            <div className="filters-grid">
              <div className="form-group">
                <label htmlFor="status-filter">Status</label>
                <select
                  id="status-filter"
                  className="form-input"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="customer-filter">Customer Name</label>
                <input
                  type="text"
                  id="customer-filter"
                  className="form-input"
                  placeholder="Search by customer name..."
                  value={filters.customerName}
                  onChange={(e) => handleFilterChange('customerName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="service-filter">Service Name</label>
                <input
                  type="text"
                  id="service-filter"
                  className="form-input"
                  placeholder="Search by service name..."
                  value={filters.serviceName}
                  onChange={(e) => handleFilterChange('serviceName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="start-date-filter">Start Date</label>
                <input
                  type="date"
                  id="start-date-filter"
                  className="form-input"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end-date-filter">End Date</label>
                <input
                  type="date"
                  id="end-date-filter"
                  className="form-input"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="min-price-filter">Min Price</label>
                <input
                  type="number"
                  id="min-price-filter"
                  className="form-input"
                  placeholder="Min price..."
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="max-price-filter">Max Price</label>
                <input
                  type="number"
                  id="max-price-filter"
                  className="form-input"
                  placeholder="Max price..."
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="filter-actions">
              <Button 
                variant="secondary"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

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
                <Button type="submit" variant="primary">
                  Create Appointment
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
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
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="appointments-list">
          {filteredAppointments.length === 0 ? (
            <div className="text-center text-muted">
              <p>
                {appointments.length === 0 
                  ? 'No appointments found.' 
                  : 'No appointments match the current filters.'
                }
              </p>
              {getActiveFiltersCount() > 0 && (
                <Button 
                  variant="outline"
                  onClick={clearFilters}
                >
                  Clear filters to see all appointments
                </Button>
              )}
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
                  {filteredAppointments.map((appointment) => (
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
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => updateAppointmentStatus(appointment.id, 'scheduled')}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === 'scheduled' && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              Complete
                            </Button>
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
