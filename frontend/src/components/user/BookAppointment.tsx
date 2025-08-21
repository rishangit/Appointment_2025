import React, { useState, useEffect, useRef } from 'react'
import { useAppSelector } from '../../store/hooks'
import { userAPI } from '../../utils/api'

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
  status: 'active' | 'archived'
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

const BookAppointment: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [companies, setCompanies] = useState<Company[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [formData, setFormData] = useState({
    company_id: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  })

  useEffect(() => {
    if (user?.role === 'user') {
      fetchCompanies()
    }
  }, [user])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const response = await userAPI.getCompanies()
      setCompanies(response.data)
      setError('')
    } catch (error) {
      setError('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async (companyId: string) => {
    try {
      const response = await userAPI.getServices(parseInt(companyId))
      setServices(response.data)
    } catch (error) {
      setError('Failed to load services')
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
      const response = await userAPI.createAppointment({
        ...formData,
        company_id: parseInt(formData.company_id),
        service_id: parseInt(formData.service_id)
      })

      setMessage('Appointment booked successfully!')
      setMessageType('success')
      setFormData({
        company_id: '',
        service_id: '',
        appointment_date: '',
        appointment_time: '',
        notes: ''
      })
      setServices([])
    } catch (error: any) {
      setMessage(error.message || 'Failed to book appointment')
      setMessageType('error')
    }
  }

  // Prepare options for dropdowns
  const companyOptions = companies.map(company => ({
    id: company.id,
    label: `${company.name} - ${company.address}`,
    value: company.id.toString()
  }))

  // Filter out archived services - users should only see active services
  const serviceOptions = services
    .filter(service => service.status === 'active') // Only show active services
    .map(service => ({
      id: service.id,
      label: `${service.name} - $${service.price}`,
      value: service.id.toString()
    }))

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
          <p>Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Book Appointment</h1>
        <p>Schedule an appointment with your preferred company</p>
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
        <div className="appointment-form">
          <h3>Book New Appointment</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <SearchableDropdown
                options={companyOptions}
                value={formData.company_id}
                onChange={(value) => handleDropdownChange('company_id', value)}
                placeholder="Choose a company..."
                label="Select Company"
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
              
              {formData.company_id && serviceOptions.length === 0 && (
                <div className="alert alert-info" style={{ marginTop: '10px' }}>
                  No active services available for this company. Please contact the company for available services.
                </div>
              )}

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
                Book Appointment
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
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
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
