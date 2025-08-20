import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../store/hooks'
import { companyAPI } from '../../utils/api'

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
          <button 
            className="btn btn-secondary" 
            onClick={loadCompanyUsers}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
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
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Appointments</th>
                    <th>Last Appointment</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {companyUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="appointment-count">
                          {user.total_appointments} appointment{user.total_appointments !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        {user.last_appointment_date 
                          ? new Date(user.last_appointment_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
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
