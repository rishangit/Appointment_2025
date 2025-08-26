import React from 'react'

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
      </div>
    </header>
  )
}

export default Header
