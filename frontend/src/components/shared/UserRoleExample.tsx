import React, { useState } from 'react'
import { UserRole } from '../../types'
import { 
  getRoleDisplayName, 
  getRoleBadgeVariant, 
  getRoleLabel, 
  getRoleIcon,
  isAdmin, 
  isCompany, 
  isUser,
  canDeleteRole,
  getAvailableRoles,
  getAllRoles,
  getDefaultRoute
} from '../../utils/userRoleUtils'
import { Button, Badge, Card, Select, Alert } from './index'

/**
 * Example component demonstrating proper UserRole enum usage
 * This component shows how to use all the UserRole utilities
 */
const UserRoleExample: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER)
  const [showAlert, setShowAlert] = useState(false)

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value as UserRole)
  }

  const handleCheckPermissions = () => {
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>UserRole Enum Usage Examples</h1>
      
      <Card title="Role Selection" subtitle="Select a role to see its properties">
        <Select
          name="role"
          value={selectedRole}
          onChange={handleRoleChange}
          options={getAllRoles()}
          label="Select Role"
          placeholder="Choose a role"
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* Role Information Card */}
        <Card title="Role Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong>Display Name:</strong> {getRoleDisplayName(selectedRole)}
            </div>
            <div>
              <strong>Badge Label:</strong> {getRoleLabel(selectedRole)}
            </div>
            <div>
              <strong>Icon:</strong> {getRoleIcon(selectedRole)}
            </div>
            <div>
              <strong>Default Route:</strong> {getDefaultRoute(selectedRole)}
            </div>
            <div>
              <strong>Can Delete:</strong> {canDeleteRole(selectedRole) ? 'Yes' : 'No'}
            </div>
          </div>
        </Card>

        {/* Role Badge Examples */}
        <Card title="Role Badges">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong>Current Role Badge:</strong>
              <Badge variant={getRoleBadgeVariant(selectedRole)}>
                {getRoleLabel(selectedRole)}
              </Badge>
            </div>
            <div>
              <strong>All Role Badges:</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                {Object.values(UserRole).map(role => (
                  <Badge key={role} variant={getRoleBadgeVariant(role)}>
                    {getRoleLabel(role)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Permission Checks */}
        <Card title="Permission Checks">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong>Is Admin:</strong> {isAdmin(selectedRole) ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Is Company:</strong> {isCompany(selectedRole) ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Is User:</strong> {isUser(selectedRole) ? '✅ Yes' : '❌ No'}
            </div>
            <Button onClick={handleCheckPermissions} variant="primary" size="sm">
              Check Permissions
            </Button>
          </div>
        </Card>

        {/* Available Roles for Registration */}
        <Card title="Available Roles for Registration">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <strong>Roles available during registration:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {getAvailableRoles().map(role => (
                <div key={role.value} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{getRoleIcon(role.value)}</span>
                  <span>{role.label}</span>
                  <Badge variant={getRoleBadgeVariant(role.value)} size="sm">
                    {getRoleLabel(role.value)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Alert for permission check */}
      {showAlert && (
        <Alert 
          type="info" 
          message={`Permission check completed for ${getRoleDisplayName(selectedRole)} role`}
          dismissible
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Code Example */}
      <Card title="Code Example" style={{ marginTop: '20px' }}>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px', 
          overflow: 'auto',
          fontSize: '14px'
        }}>
{`// Import the enum and utilities
import { UserRole } from '../types'
import { 
  getRoleDisplayName, 
  getRoleBadgeVariant, 
  isAdmin 
} from '../utils/userRoleUtils'

// Use in components
const MyComponent = () => {
  const userRole = UserRole.ADMIN
  
  // Get display name
  const displayName = getRoleDisplayName(userRole) // "Administrator"
  
  // Get badge variant
  const badgeVariant = getRoleBadgeVariant(userRole) // "danger"
  
  // Check permissions
  const hasAdminAccess = isAdmin(userRole) // true
  
  return (
    <Badge variant={badgeVariant}>
      {displayName}
    </Badge>
  )
}`}
        </pre>
      </Card>
    </div>
  )
}

export default UserRoleExample
