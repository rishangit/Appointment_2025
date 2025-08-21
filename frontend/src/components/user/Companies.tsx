import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../store/hooks'
import Button from '../shared/Button'

interface Company {
  id: number
  name: string
  address: string
  contact: string
  status: string
  appointment_count: number
  last_appointment_date: string
  total_spent: number
}

const Companies: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role === 'user') {
      fetchUserCompanies()
    }
  }, [user])

  const fetchUserCompanies = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/companies', {
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
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
          <p>Loading your companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Companies</h1>
        <p>Companies where you have made appointments</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Companies ({companies.length})</h2>
        </div>

        {companies.length === 0 ? (
          <div className="text-center" style={{ padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              You haven't made any appointments yet.
            </p>
            <a href="/user/book-appointment">
              <Button variant="primary">
                Book Your First Appointment
              </Button>
            </a>
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map((company) => (
              <div key={company.id} className="company-card">
                <div className="company-header">
                  <h3>{company.name}</h3>
                  <span className={`status-badge ${company.status}`}>
                    {company.status}
                  </span>
                </div>
                
                <div className="company-details">
                  <div className="detail-item">
                    <span className="label">Address:</span>
                    <span className="value">{company.address}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Contact:</span>
                    <span className="value">{company.contact || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Appointments:</span>
                    <span className="value">{company.appointment_count}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Last Visit:</span>
                    <span className="value">{formatDate(company.last_appointment_date)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Total Spent:</span>
                    <span className="value">{formatCurrency(company.total_spent)}</span>
                  </div>
                </div>
                
                <div className="company-actions">
                  <a href={`/user/book-appointment?company=${company.id}`}>
                    <Button variant="primary">
                      Book Again
                    </Button>
                  </a>
                  <a href={`/user/my-appointments?company=${company.id}`}>
                    <Button variant="secondary">
                      View Appointments
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Companies
