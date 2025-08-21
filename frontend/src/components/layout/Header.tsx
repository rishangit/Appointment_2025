import React from 'react'
import { ThemeSwitcher } from '../shared/ThemeSwitcher'

interface HeaderProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
  return (
    <header className="header with-sidebar">
      <div className="header-content">
        <button className="hamburger-menu mobile-only" onClick={onToggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className="header-title">
          <h1>Appointment Management System</h1>
        </div>
        
        <div className="header-actions">
          <ThemeSwitcher variant="dropdown" />
        </div>
      </div>
    </header>
  )
}

export default Header
