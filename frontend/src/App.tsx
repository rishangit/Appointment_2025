import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './store/hooks'
import type { RootState } from './store'
import { checkAuthStatus, logout } from './store/slices/authSlice'
import { UserRole } from './types'

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

// Company components
import Appointments from './components/company/Appointments'
import Services from './components/company/Services'
import CompanyUsers from './components/company/CompanyUsers'

// User components
import MyAppointments from './components/user/MyAppointments'
import BookAppointment from './components/user/BookAppointment'
import UserCompanies from './components/user/Companies'

// Profile component
import Profile from './components/profile/Profile'

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
            isAuthenticated && user?.role === UserRole.ADMIN ? (
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/users" element={<Users />} />
                <Route path="/appointments" element={<AdminAppointments />} />
                <Route path="/billing" element={<Billing />} />
              </Routes>
            ) : <Navigate to="/login" />
          } />
          <Route path="/company/*" element={
            isAuthenticated && user?.role === UserRole.COMPANY ? (
              <Routes>
                <Route path="/" element={<CompanyDashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/services" element={<Services />} />
                <Route path="/users" element={<CompanyUsers />} />
              </Routes>
            ) : <Navigate to="/login" />
          } />
          <Route path="/user/*" element={
            isAuthenticated && user?.role === UserRole.USER ? (
              <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/companies" element={<UserCompanies />} />
              </Routes>
            ) : <Navigate to="/login" />
          } />
          
          {/* Global profile route for all authenticated users */}
          <Route path="/profile" element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
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
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
