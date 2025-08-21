import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../store/hooks'
import { companyAPI } from '../../utils/api'
import { EditIcon, DeleteIcon } from '../shared/icons'
import Button from '../shared/Button'

interface CompanyUser {
  id: number
  name: string
  email: string
  created_at: string
  total_appointments: number
  last_appointment_date: string
}

const CompanyUsers: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    loadCompanyUsers()
  }, [])

  const loadCompanyUsers = async () => {
    setLoading(true)
    try {
      const response = await companyAPI.getCompanyUsers()
      setCompanyUsers(response.data)
      setMessage('')
    } catch (error) {
      console.error('Failed to load company users:', error)
      setMessage('Failed to load company users')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const editUser = (user: CompanyUser) => {
    setMessage('Edit functionality coming soon')
    setMessageType('success')
  }

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      setMessage('Delete functionality coming soon')
      setMessageType('success')
    } catch (error) {
      setMessage('Failed to delete user')
      setMessageType('error')
    }
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

  return (
    <div className="container">
      <div className="page-header">
        <h1>Company Users</h1>
        <p>Users who have made appointments with your company</p>
      </div>

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Users ({companyUsers.length})</h2>
          <Button 
            variant="secondary"
            onClick={loadCompanyUsers}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : companyUsers.length === 0 ? (
            <div className="text-center text-muted">
              <p>No users have made appointments with your company yet.</p>
            </div>
          ) : (
            <div className="users-table">
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
                    }}>Name</th>
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
                    }}>Total Appointments</th>
                    <th style={{ 
                      padding: 'var(--spacing-md)', 
                      textAlign: 'left', 
                      borderBottom: '1px solid var(--color-border-primary)',
                      color: 'var(--color-text-primary)',
                      fontWeight: 'var(--font-fontWeight-semibold)',
                      fontSize: 'var(--font-fontSize-sm)'
                    }}>Last Appointment</th>
                    <th style={{ 
                      padding: 'var(--spacing-md)', 
                      textAlign: 'left', 
                      borderBottom: '1px solid var(--color-border-primary)',
                      color: 'var(--color-text-primary)',
                      fontWeight: 'var(--font-fontWeight-semibold)',
                      fontSize: 'var(--font-fontSize-sm)'
                    }}>Joined</th>
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
                  {companyUsers.map((user) => (
                    <tr key={user.id} style={{ 
                      borderBottom: '1px solid var(--color-border-primary)',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <td style={{ 
                        padding: 'var(--spacing-md)',
                        color: 'var(--color-text-primary)'
                      }}>
                        <div className="user-info">
                          <div className="user-name" style={{ color: 'var(--color-text-primary)' }}>{user.name}</div>
                        </div>
                      </td>
                      <td style={{ 
                        padding: 'var(--spacing-md)',
                        color: 'var(--color-text-primary)'
                      }}>{user.email}</td>
                      <td style={{ 
                        padding: 'var(--spacing-md)',
                        color: 'var(--color-text-primary)'
                      }}>
                        <span className="appointment-count">
                          {user.total_appointments} appointment{user.total_appointments !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td style={{ 
                        padding: 'var(--spacing-md)',
                        color: 'var(--color-text-primary)'
                      }}>
                        {user.last_appointment_date 
                          ? new Date(user.last_appointment_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td style={{ 
                        padding: 'var(--spacing-md)',
                        color: 'var(--color-text-primary)'
                      }}>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                          <button
                            onClick={() => editUser(user)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 'var(--spacing-xs)',
                              backgroundColor: 'transparent',
                              color: 'var(--color-text-primary)',
                              border: 'none',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              minWidth: '32px',
                              height: '32px'
                            }}
                            title="Edit User"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 'var(--spacing-xs)',
                              backgroundColor: 'transparent',
                              color: 'var(--color-status-error)',
                              border: 'none',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              minWidth: '32px',
                              height: '32px'
                            }}
                            title="Delete User"
                          >
                            <DeleteIcon size={16} />
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
    </div>
  )
}

export default CompanyUsers
