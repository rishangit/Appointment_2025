import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'company' | 'user'
}

interface NavbarProps {
  user: User
  onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const getNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard' },
          { to: '/admin/companies', label: 'Companies' },
          { to: '/admin/users', label: 'Users' }
        ]
      case 'company':
        return [
          { to: '/company', label: 'Dashboard' },
          { to: '/company/appointments', label: 'Appointments' },
          { to: '/company/services', label: 'Services' }
        ]
      case 'user':
        return [
          { to: '/user', label: 'Dashboard' },
          { to: '/user/my-appointments', label: 'My Appointments' }
        ]
      default:
        return []
    }
  }

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2 style={{ margin: 0 }}>Appointment Management System</h2>
            <span>Welcome, {user.name} ({user.role})</span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <button onClick={onLogout} className="btn" style={{ backgroundColor: '#dc3545' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
