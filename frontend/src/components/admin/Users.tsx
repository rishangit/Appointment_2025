import React, { useState, useEffect } from 'react'
import { Alert, Badge, Card, LoadingSpinner } from '../shared'
import Button from '../shared/Button'
import { UserRole, User } from '../../types'
import { getRoleBadgeVariant, getRoleLabel, canDeleteRole } from '../../utils/userRoleUtils'

interface UserData {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      } else {
        setError(data.message || 'Failed to fetch users')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUsers(prev => prev.filter(user => user.id !== userId))
      } else {
        setError(data.message || 'Failed to delete user')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const getRoleBadge = (role: UserRole) => {
    return (
      <Badge variant={getRoleBadgeVariant(role)}>
        {getRoleLabel(role)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container">
        <LoadingSpinner text="Loading users..." />
      </div>
    )
  }

  return (
    <div>
      <h1>Manage Users</h1>
      
      {error && (
        <Alert type="error" message={error} />
      )}

      <Card 
        title={`All Users (${users.length})`}
        subtitle="Manage system users and their roles"
      >
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        disabled={!canDeleteRole(user.role)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Users
