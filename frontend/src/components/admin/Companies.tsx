import React, { useState, useEffect } from 'react'
import Button from '../shared/Button'
import { StatusBadge } from '../shared'

interface Company {
  id: number
  name: string
  address: string
  contact: string
  phone: string
  email: string
  status: 'pending' | 'active' | 'suspended'
  created_at: string
}

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompanies()
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
    } finally {
      setLoading(false)
    }
  }

  const updateCompanyStatus = async (companyId: number, status: 'active' | 'suspended') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/companies/${companyId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update the company status in the local state
        setCompanies(prev => prev.map(company => 
          company.id === companyId ? { ...company, status } : company
        ))
      } else {
        setError(data.message || 'Failed to update company status')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const deleteCompany = async (companyId: number) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCompanies(prev => prev.filter(company => company.id !== companyId))
      } else {
        setError(data.message || 'Failed to delete company')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const getStatusBadge = (status: string) => {
    const companyStatusConfig = {
      pending: {
        label: 'PENDING',
        backgroundColor: '#ffc107',
        textColor: '#ffffff'
      },
      active: {
        label: 'ACTIVE',
        backgroundColor: '#28a745',
        textColor: '#ffffff'
      },
      suspended: {
        label: 'SUSPENDED',
        backgroundColor: '#dc3545',
        textColor: '#ffffff'
      }
    }
    
    return <StatusBadge status={status} statusConfig={companyStatusConfig} size="sm" />
  }

  if (loading) {
    return <div className="container">Loading companies...</div>
  }

  return (
    <div>
      <h1>Manage Companies</h1>
      
      {error && (
        <div style={{ 
          color: 'var(--color-status-error)', 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: 'var(--color-background-secondary)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-status-error)'
        }}>
          {error}
        </div>
      )}

      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-background-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: 'var(--color-shadow-md)'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-fontSize-xl)',
            fontWeight: 'var(--font-fontWeight-semibold)'
          }}>
            All Companies ({companies.length})
          </h2>
        </div>

        {companies.length === 0 ? (
          <p>No companies found.</p>
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
                  }}>Company</th>
                  <th style={{ 
                    padding: 'var(--spacing-md)', 
                    textAlign: 'left', 
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Contact</th>
                  <th style={{ 
                    padding: 'var(--spacing-md)', 
                    textAlign: 'left', 
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Phone</th>
                  <th style={{ 
                    padding: 'var(--spacing-md)', 
                    textAlign: 'left', 
                    borderBottom: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-fontWeight-semibold)',
                    fontSize: 'var(--font-fontSize-sm)'
                  }}>Email</th>
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
                {companies.map((company) => (
                  <tr key={company.id} style={{ 
                    borderBottom: '1px solid var(--color-border-primary)',
                    transition: 'background-color 0.2s ease'
                  }}>
                    <td style={{ 
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>
                      <div>
                        <strong style={{ color: 'var(--color-text-primary)' }}>{company.name}</strong>
                        <div style={{ 
                          fontSize: 'var(--font-fontSize-sm)', 
                          color: 'var(--color-text-secondary)',
                          marginTop: 'var(--spacing-xs)'
                        }}>{company.address}</div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>{company.contact}</td>
                    <td style={{ 
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>{company.phone}</td>
                    <td style={{ 
                      padding: 'var(--spacing-md)',
                      color: 'var(--color-text-primary)'
                    }}>{company.email}</td>
                    <td style={{ padding: 'var(--spacing-md)' }}>{getStatusBadge(company.status)}</td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                        {company.status === 'pending' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateCompanyStatus(company.id, 'active')}
                          >
                            Approve
                          </Button>
                        )}
                        {company.status === 'active' && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => updateCompanyStatus(company.id, 'suspended')}
                          >
                            Suspend
                          </Button>
                        )}
                        {company.status === 'suspended' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateCompanyStatus(company.id, 'active')}
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteCompany(company.id)}
                        >
                          Delete
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
    </div>
  )
}

export default Companies
