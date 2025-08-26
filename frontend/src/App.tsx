import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './store/hooks'
import type { RootState } from './store'
import { checkAuthStatus, logout } from './store/slices/authSlice'
import { UserRole } from './types'
import { isAdmin, isCompany, isUser } from './utils/userRoleUtils'
import { ThemeProvider } from './theme/ThemeProvider'

// Auth components
import Login from './components/auth/Login'
import Register from './components/auth/Register'

// Dashboard components
import AdminDashboard from './components/dashboard/AdminDashboard'
import CompanyDashboard from './components/dashboard/CompanyDashboard'
import UserDashboard from './components/dashboard/UserDashboard'

// Layout components
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'

// Admin components
import Companies from './components/admin/Companies'
import Users from './components/admin/Users'
import Billing from './components/admin/Billing'
import AdminAppointments from './components/admin/Appointments'
import AdminSettings from './components/admin/Settings'

// Company components
import Appointments from './components/company/Appointments'
import Calendar from './components/company/Calendar'
import Services from './components/company/Services'
import CompanyUsers from './components/company/CompanyUsers'
import CompanyBilling from './components/company/Billing'
import CompanySettings from './components/company/Settings'

// User components
import MyAppointments from './components/user/MyAppointments'
import UserCalendar from './components/user/Calendar'
import BookAppointment from './components/user/BookAppointment'
import UserCompanies from './components/user/Companies'
import UserSettings from './components/user/Settings'

// Profile component
import Profile from './components/profile/Profile'

// Component Showcase
import ComponentShowcase from './components/userscontrols/ComponentShowcase'
import { ThemeShowcase } from './components/shared/ThemeShowcase'
import { IconShowcase } from './components/shared'

function AppContent() {
  const dispatch = useAppDispatch()
  const { user, loading, isAuthenticated } = useAppSelector((state: RootState) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check auth status on app load
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    setSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="App">
      {isAuthenticated && user && (
        <>
          <Sidebar 
            user={user} 
            onLogout={handleLogout} 
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        </>
      )}
      
      <div className={`main-content ${isAuthenticated && user ? 'with-sidebar' : ''}`}>
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? <Login /> : <Navigate to="/" />
          } />
          <Route path="/register" element={
            !isAuthenticated ? <Register /> : <Navigate to="/" />
          } />
          <Route path="/admin/*" element={
            isAuthenticated && user && isAdmin(user.role) ? (
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/users" element={<Users />} />
                <Route path="/appointments" element={<AdminAppointments />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/settings" element={<AdminSettings />} />
              </Routes>
            ) : <Navigate to="/login" />
          } />
          <Route path="/company/*" element={
            isAuthenticated && user && isCompany(user.role) ? (
              <Routes>
                <Route path="/" element={<CompanyDashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/services" element={<Services />} />
                <Route path="/users" element={<CompanyUsers />} />
                <Route path="/billing" element={<CompanyBilling />} />
                <Route path="/settings" element={<CompanySettings />} />
              </Routes>
            ) : <Navigate to="/login" />
          } />
          <Route path="/user/*" element={
            isAuthenticated && user && isUser(user.role) ? (
              <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
                <Route path="/calendar" element={<UserCalendar />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/companies" element={<UserCompanies />} />
                <Route path="/settings" element={<UserSettings />} />
              </Routes>
            ) : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          } />
          <Route path="/userscontrols" element={
            isAuthenticated ? <ComponentShowcase /> : <Navigate to="/login" />
          } />
          <Route path="/theme-showcase" element={
            isAuthenticated ? <ThemeShowcase /> : <Navigate to="/login" />
          } />
          <Route path="/icon-showcase" element={
            isAuthenticated ? <IconShowcase /> : <Navigate to="/login" />
          } />
          <Route path="/" element={
            isAuthenticated && user ? (
              user.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
              user.role === UserRole.COMPANY ? <Navigate to="/company" /> :
              <Navigate to="/user" />
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
