import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, UserRole } from '../../types'
import { getRoleDisplayName } from '../../utils/userRoleUtils'
import { 
  DashboardIcon, 
  AppointmentsIcon, 
  ServicesIcon, 
  UsersIcon, 
  BillingIcon,
  BuildingIcon,
  XIcon,
  LogoutIcon,
  ShowcaseIcon,
  CalendarIcon,
  SettingsIcon
} from '../shared/icons'

interface SidebarProps {
  user: User
  onLogout: () => void
  isOpen: boolean
  onToggle: () => void
}

interface NavLink {
  to: string
  label: string
  icon: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, onToggle }) => {
  const location = useLocation()

  const isActive = (path: string) => {
    // Exact match
    if (location.pathname === path) {
      return true
    }

    // For dashboard paths, only match exact path or root path
    if (path === '/admin' || path === '/company' || path === '/user') {
      return location.pathname === path || location.pathname === path + '/'
    }

    // For other paths, check if it starts with the path
    return location.pathname.startsWith(path + '/')
  }

  const getNavLinks = (): NavLink[] => {
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { to: '/admin', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
          { to: '/admin/companies', label: 'Companies', icon: <BuildingIcon size={20} /> },
          { to: '/admin/users', label: 'Users', icon: <UsersIcon size={20} /> },
          { to: '/admin/appointments', label: 'Appointments', icon: <AppointmentsIcon size={20} /> },
          { to: '/admin/billing', label: 'Billing', icon: <BillingIcon size={20} /> },
          { to: '/admin/settings', label: 'Settings', icon: <SettingsIcon size={20} /> }
        ]
      case UserRole.COMPANY:
        return [
          { to: '/company', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
          { to: '/company/appointments', label: 'Appointments', icon: <AppointmentsIcon size={20} /> },
          { to: '/company/calendar', label: 'Calendar', icon: <CalendarIcon size={20} /> },
          { to: '/company/services', label: 'Services', icon: <ServicesIcon size={20} /> },
          { to: '/company/users', label: 'Users', icon: <UsersIcon size={20} /> },
          { to: '/company/billing', label: 'Billing', icon: <BillingIcon size={20} /> },
          { to: '/company/settings', label: 'Settings', icon: <SettingsIcon size={20} /> }
        ]
      case UserRole.USER:
        return [
          { to: '/user', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
          { to: '/user/my-appointments', label: 'My Appointments', icon: <AppointmentsIcon size={20} /> },
          { to: '/user/calendar', label: 'Calendar', icon: <CalendarIcon size={20} /> },
          { to: '/user/companies', label: 'Companies', icon: <BuildingIcon size={20} /> },
          { to: '/user/settings', label: 'Settings', icon: <SettingsIcon size={20} /> }
        ]
      default:
        return []
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>AMS</h2>
          <button className="sidebar-close" onClick={onToggle}>
            <XIcon size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <Link to="/profile" className="user-name-link">
              <div className="user-name">{user.name}</div>
            </Link>
            <div className="user-role">{getRoleDisplayName(user.role)}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {getNavLinks().map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => {
                // Close sidebar on mobile when link is clicked
                if (window.innerWidth <= 768) {
                  onToggle()
                }
              }}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </Link>
          ))}
          
          {/* Separator */}
          <div className="sidebar-separator"></div>
          
          {/* Component Showcase Link - Available for all users */}
          <Link
            to="/userscontrols"
            className={`sidebar-link ${isActive('/userscontrols') ? 'active' : ''}`}
            onClick={() => {
              // Close sidebar on mobile when link is clicked
              if (window.innerWidth <= 768) {
                onToggle()
              }
            }}
          >
            <span className="sidebar-icon">
              <ShowcaseIcon size={20} />
            </span>
            <span className="sidebar-label">Component Showcase</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="sidebar-logout">
            <span className="sidebar-icon">
              <LogoutIcon size={20} />
            </span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
