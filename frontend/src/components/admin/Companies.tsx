import React, { useState, useEffect } from 'react'

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
    const statusColors = {
      pending: '#ffc107',
      active: '#28a745',
      suspended: '#dc3545'
    }
    
    return (
      <span style={{
        backgroundColor: statusColors[status as keyof typeof statusColors],
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {status.toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return <div className="container">Loading companies...</div>
  }

  return (
    <div>
      <h1>Manage Companies</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>All Companies ({companies.length})</h2>
        </div>

        {companies.length === 0 ? (
          <p>No companies found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Company</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Contact</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <strong>{company.name}</strong>
                        <div style={{ fontSize: '12px', color: '#666' }}>{company.address}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{company.contact}</td>
                    <td style={{ padding: '12px' }}>{company.phone}</td>
                    <td style={{ padding: '12px' }}>{company.email}</td>
                    <td style={{ padding: '12px' }}>{getStatusBadge(company.status)}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {company.status === 'pending' && (
                          <button
                            onClick={() => updateCompanyStatus(company.id, 'active')}
                            className="btn"
                            style={{ backgroundColor: '#28a745', fontSize: '12px', padding: '4px 8px' }}
                          >
                            Approve
                          </button>
                        )}
                        {company.status === 'active' && (
                          <button
                            onClick={() => updateCompanyStatus(company.id, 'suspended')}
                            className="btn"
                            style={{ backgroundColor: '#ffc107', fontSize: '12px', padding: '4px 8px' }}
                          >
                            Suspend
                          </button>
                        )}
                        {company.status === 'suspended' && (
                          <button
                            onClick={() => updateCompanyStatus(company.id, 'active')}
                            className="btn"
                            style={{ backgroundColor: '#28a745', fontSize: '12px', padding: '4px 8px' }}
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => deleteCompany(company.id)}
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

export default Companies
