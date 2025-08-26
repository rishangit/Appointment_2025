import { UserRole } from '../types'

/**
 * Get the display name for a UserRole
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.COMPANY]: 'Company',
    [UserRole.USER]: 'User'
  }
  return roleNames[role] || role
}

/**
 * Get the badge variant for a UserRole
 */
export const getRoleBadgeVariant = (role: UserRole): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
  const roleVariants = {
    [UserRole.ADMIN]: 'danger' as const,
    [UserRole.COMPANY]: 'primary' as const,
    [UserRole.USER]: 'success' as const
  }
  return roleVariants[role]
}

/**
 * Get the short label for a UserRole (for badges)
 */
export const getRoleLabel = (role: UserRole): string => {
  const roleLabels = {
    [UserRole.ADMIN]: 'ADMIN',
    [UserRole.COMPANY]: 'COMPANY',
    [UserRole.USER]: 'USER'
  }
  return roleLabels[role]
}

/**
 * Check if a role has admin privileges
 */
export const isAdmin = (role: UserRole): boolean => {
  return role === UserRole.ADMIN
}

/**
 * Check if a role has company privileges
 */
export const isCompany = (role: UserRole): boolean => {
  return role === UserRole.COMPANY
}

/**
 * Check if a role has user privileges
 */
export const isUser = (role: UserRole): boolean => {
  return role === UserRole.USER
}

/**
 * Get the default route for a UserRole
 */
export const getDefaultRoute = (role: UserRole): string => {
  const routes = {
    [UserRole.ADMIN]: '/admin',
    [UserRole.COMPANY]: '/company',
    [UserRole.USER]: '/user'
  }
  return routes[role]
}

/**
 * Get all available roles for selection (excluding admin for registration)
 */
export const getAvailableRoles = (): Array<{ value: UserRole; label: string }> => {
  return [
    { value: UserRole.USER, label: 'Individual User - Book appointments with companies' },
    { value: UserRole.COMPANY, label: 'Company Owner - Manage services and appointments' }
  ]
}

/**
 * Get all roles including admin
 */
export const getAllRoles = (): Array<{ value: UserRole; label: string }> => {
  return [
    { value: UserRole.ADMIN, label: 'Administrator' },
    { value: UserRole.COMPANY, label: 'Company' },
    { value: UserRole.USER, label: 'User' }
  ]
}

/**
 * Check if a role can be deleted (admin users cannot be deleted)
 */
export const canDeleteRole = (role: UserRole): boolean => {
  return role !== UserRole.ADMIN
}

/**
 * Get the icon for a UserRole
 */
export const getRoleIcon = (role: UserRole): string => {
  const roleIcons = {
    [UserRole.ADMIN]: '👑',
    [UserRole.COMPANY]: '🏢',
    [UserRole.USER]: '👤'
  }
  return roleIcons[role]
}
