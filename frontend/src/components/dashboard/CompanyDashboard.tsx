import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { DashboardStats } from '../../types'
import { companyAPI } from '../../utils/api'

const CompanyDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await companyAPI.getDashboard()
      if (response.success) {
        setStats({
          totalServices: response.data.stats.services.total_services || 0,
          totalAppointments: response.data.stats.appointments.total_appointments || 0,
          upcomingAppointments: response.data.stats.appointments.upcoming_count || 0,
          totalRevenue: 0 // This would need to be calculated from appointments
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div>
      <h1>Company Dashboard</h1>
      
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Services</h3>
          <div className="number">{stats.totalServices}</div>
        </div>
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <div className="number">{stats.totalAppointments}</div>
        </div>
        <div className="stat-card">
          <h3>Upcoming Appointments</h3>
          <div className="number">{stats.upcomingAppointments}</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="number">${stats.totalRevenue}</div>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/company/profile" className="btn">Company Profile</Link>
          <Link to="/company/services" className="btn">Manage Services</Link>
          <Link to="/company/appointments" className="btn">View Appointments</Link>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard
