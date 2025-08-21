import React, { useState, useEffect, useRef } from 'react'
import Button from '../shared/Button'
import { AppointmentStatusBadge } from '../shared'

interface Appointment {
  id: number
  company_name: string
  company_address: string
  user_name: string
  user_email: string
  service_name: string
  service_price: number
  service_duration: number
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
  status: string
}

interface SearchableDropdownProps {
  options: Array<{ id: number | string; label: string; value: string }>
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  required?: boolean
  disabled?: boolean
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false
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
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <input
            type="text"
            className="dropdown-input"
            placeholder={placeholder}
            value={selectedOption ? selectedOption.label : ''}
            readOnly
            disabled={disabled}
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
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    fetchCompanies()
    fetchAppointments()
  }, [])

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/companies', {
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

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = '/api/admin/appointments'
      const params = new URLSearchParams()
      
      if (selectedCompany) params.append('company_id', selectedCompany)
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      if (selectedStatus) params.append('status', selectedStatus)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
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

  const handleFilter = () => {
    fetchAppointments()
  }

  const handleClearFilter = () => {
    setSelectedCompany('')
    setStartDate('')
    setEndDate('')
    setSelectedStatus('')
    fetchAppointments()
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return <div className="container">Loading appointments...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Appointments</h1>
        <p>View and filter all appointments across all companies</p>
      </div>
      
      {error && (
        <div style={{
          color: 'var(--color-status-error)',
          marginBottom: '20px',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-status-error)'
        }}>
          {error}
        </div>
      )}

      {/* Filter Section */}
      <div className="card">
        <div className="card-header">
          <h3>Filter Appointments</h3>
        </div>
        <div className="card-body">
          <div className="filter-section">
            <SearchableDropdown
              options={[
                { id: '', label: 'All Companies', value: '' },
                ...companies.map(company => ({
                  id: company.id,
                  label: `${company.name} - ${company.address}`,
                  value: company.id.toString()
                }))
              ]}
              value={selectedCompany}
              onChange={setSelectedCompany}
              placeholder="Choose a company..."
              label="Select Company"
            />

            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="form-input"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-actions">
              <Button variant="primary" onClick={handleFilter}>
                Apply Filter
              </Button>
              <Button variant="secondary" onClick={handleClearFilter}>
                Clear Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        <div className="card-header">
          <h3>All Appointments ({appointments.length})</h3>
        </div>
        <div className="card-body">
          {appointments.length === 0 ? (
            <p>No appointments found for the selected criteria.</p>
          ) : (
            <div className="appointments-table">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>User</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <strong>{appointment.company_name}</strong>
                        <br />
                        <small>{appointment.company_address}</small>
                      </td>
                      <td>
                        <strong>{appointment.user_name}</strong>
                        <br />
                        <small>{appointment.user_email}</small>
                      </td>
                      <td>
                        <strong>{appointment.service_name}</strong>
                        <br />
                        <small>{appointment.service_duration} min</small>
                      </td>
                      <td>
                        <div>{formatDate(appointment.appointment_date)}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {formatTime(appointment.appointment_time)}
                        </div>
                      </td>
                      <td>{formatCurrency(appointment.service_price)}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                      <td>
                        {appointment.notes ? (
                          <span title={appointment.notes}>
                            {appointment.notes.length > 50 
                              ? `${appointment.notes.substring(0, 50)}...` 
                              : appointment.notes
                            }
                          </span>
                        ) : (
                          <span style={{ color: '#999' }}>No notes</span>
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
    </div>
  )
}

export default Appointments
