import React, { useState, useEffect } from 'react'

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  created_at: string
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
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/company/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setServices(prev => prev.filter(service => service.id !== serviceId))
      } else {
        setError(data.message || 'Failed to delete service')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
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
          <button 
            onClick={() => setShowAddForm(true)} 
            className="btn"
            style={{ backgroundColor: '#28a745' }}
          >
            Add New Service
          </button>
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {services.length === 0 ? (
          <p>No services found. Add your first service to get started!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Service</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Duration</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <strong>{service.name}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>{service.description}</td>
                    <td style={{ padding: '12px' }}>${service.price}</td>
                    <td style={{ padding: '12px' }}>{service.duration} min</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => editService(service)}
                          className="btn"
                          style={{ backgroundColor: '#007bff', fontSize: '12px', padding: '4px 8px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="btn"
                          style={{ backgroundColor: '#dc3545', fontSize: '12px', padding: '4px 8px' }}
                        >
                          Delete
                        </button>
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
  )
}

export default Services
