import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { DashboardStats } from '../../types'
import { userAPI } from '../../utils/api'

const UserDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointmentsUser: 0,
    upcomingAppointmentsUser: 0,
    completedAppointmentsUser: 0,
    cancelledAppointmentsUser: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await userAPI.getDashboard()
      if (response.success) {
        setStats({
          totalAppointmentsUser: response.data.stats.totalAppointments || 0,
          upcomingAppointmentsUser: response.data.stats.upcomingAppointments || 0,
          completedAppointmentsUser: response.data.stats.completedAppointments || 0,
          cancelledAppointmentsUser: response.data.stats.cancelledAppointments || 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <div className="number">{stats.totalAppointmentsUser}</div>
        </div>
        <div className="stat-card">
          <h3>Upcoming Appointments</h3>
          <div className="number">{stats.upcomingAppointmentsUser}</div>
        </div>
        <div className="stat-card">
          <h3>Completed Appointments</h3>
          <div className="number">{stats.completedAppointmentsUser}</div>
        </div>
        <div className="stat-card">
          <h3>Cancelled Appointments</h3>
          <div className="number">{stats.cancelledAppointmentsUser}</div>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/user/companies" className="btn">Browse Companies</Link>
          <Link to="/user/book-appointment" className="btn">Book Appointment</Link>
          <Link to="/user/my-appointments" className="btn">My Appointments</Link>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
