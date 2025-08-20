import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, UserRole } from '../../types'

interface SidebarProps {
  user: User
  onLogout: () => void
  isOpen: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, onToggle }) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const getNavLinks = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { to: '/admin', label: 'Dashboard', icon: '📊' },
          { to: '/admin/companies', label: 'Companies', icon: '🏢' },
          { to: '/admin/users', label: 'Users', icon: '👥' },
          { to: '/admin/appointments', label: 'Appointments', icon: '📅' },
          { to: '/admin/billing', label: 'Billing', icon: '💰' }
        ]
      case UserRole.COMPANY:
        return [
          { to: '/company', label: 'Dashboard', icon: '📊' },
          { to: '/company/appointments', label: 'Appointments', icon: '📅' },
          { to: '/company/services', label: 'Services', icon: '🔧' },
          { to: '/company/users', label: 'Users', icon: '👥' }
        ]
              case UserRole.USER:
          return [
            { to: '/user', label: 'Dashboard', icon: '📊' },
            { to: '/user/my-appointments', label: 'My Appointments', icon: '📅' },
            { to: '/user/companies', label: 'Companies', icon: '🏢' }
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
            ✕
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
            <div className="user-role">{user.role}</div>
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
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="sidebar-logout">
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
