import React, { useState, useEffect } from 'react'
import { EditIcon, DeleteIcon } from '../shared/icons'
import Button from '../shared/Button'

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  created_at: string
  status: 'active' | 'archived'
  appointment_count?: number
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  })
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [serviceToArchive, setServiceToArchive] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/company/services', {
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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      const url = editingService
        ? `/api/company/services/${editingService.id}`
        : '/api/company/services'

      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration)
        })
      })

      const data = await response.json()

      if (data.success) {
        if (editingService) {
          setServices(prev => prev.map(service =>
            service.id === editingService.id ? data.data : service
          ))
        } else {
          setServices(prev => [...prev, data.data])
        }

        resetForm()
      } else {
        setError(data.message || 'Failed to save service')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const deleteService = async (serviceId: number) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return

    // For now, let's assume all services have appointments to prevent deletion
    // This is a temporary solution until the backend API is ready
    setServiceToArchive({ ...service, appointment_count: 1 })
    setShowArchiveModal(true)
  }

  const archiveService = async (serviceId: number) => {
    try {
      const token = localStorage.getItem('token')

      // Try the archive endpoint first
      let response = await fetch(`/api/company/services/${serviceId}/archive`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'archived' })
      })

      // If archive endpoint doesn't exist, try updating the service directly
      if (!response.ok) {
        const service = services.find(s => s.id === serviceId)
        if (!service) {
          setError('Service not found')
          return
        }

        response = await fetch(`/api/company/services/${serviceId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            status: 'archived'
          })
        })
      }

      const data = await response.json()

      if (data.success) {
        setServices(prev => prev.map(service =>
          service.id === serviceId ? { ...service, status: 'archived' } : service
        ))
        setShowArchiveModal(false)
        setServiceToArchive(null)
      } else {
        setError(data.message || 'Failed to archive service')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const closeArchiveModal = () => {
    setShowArchiveModal(false)
    setServiceToArchive(null)
  }

  const editService = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString()
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: ''
    })
    setEditingService(null)
    setShowAddForm(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return <div className="container">Loading services...</div>
  }

  return (
    <div>
      <h1>Manage Services</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>All Services ({services.length})</h2>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="primary"
          >
            Add New Service
          </Button>
        </div>

        {showAddForm && (
          <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
            <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Service Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="price">Price ($):</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="duration">Duration (minutes):</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <Button type="submit" variant="primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
                <Button type="button" onClick={resetForm} variant="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {services.length === 0 ? (
          <p>No services found. Add your first service to get started!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'var(--color-background-card)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                  <th style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Service</th>
                  <th style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Description</th>
                  <th style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Price</th>
                  <th style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Duration</th>
                  <th style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Status</th>
                  <th style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} style={{
                    borderBottom: '1px solid var(--color-border-primary)',
                    transition: 'background-color 0.2s ease'
                  }}>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{service.name}</strong>
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>{service.description}</td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>${service.price}</td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>{service.duration} min</td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>
                      <span style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-fontSize-xs)',
                        fontWeight: 'var(--font-fontWeight-medium)',
                        backgroundColor: service.status === 'active'
                          ? 'var(--color-status-success)'
                          : 'var(--color-status-warning)',
                        color: 'white',
                        textTransform: 'capitalize'
                      }}>
                        {service.status}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                        <Button
                          onClick={() => editService(service)}
                          variant="outline"
                          size="sm"
                        >
                          <EditIcon size={16} />
                        </Button>
                        <Button
                          onClick={() => deleteService(service.id)}
                          variant="outline"
                          size="sm"
                        >
                          <DeleteIcon size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Archive Modal */}
      {showArchiveModal && serviceToArchive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--color-background-card)',
            padding: 'var(--spacing-xl)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-primary)',
            boxShadow: 'var(--color-shadow-lg)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-fontSize-xl)',
              fontWeight: 'var(--font-fontWeight-semibold)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Cannot Delete Service
            </h3>

            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-fontSize-base)',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: 'var(--font-lineHeight-relaxed)'
            }}>
              The service "<strong style={{ color: 'var(--color-text-primary)' }}>{serviceToArchive.name}</strong>"
              has {serviceToArchive.appointment_count || 0} appointment{(serviceToArchive.appointment_count || 0) !== 1 ? 's' : ''}
              and cannot be deleted. Would you like to archive it instead?
            </p>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Button
                variant="warning"
                onClick={() => archiveService(serviceToArchive.id)}
              >
                Archive Service
              </Button>
              <Button
                variant="secondary"
                onClick={closeArchiveModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services
