import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { DashboardStats } from '../../types'
import { adminAPI } from '../../utils/api'

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalAppointments: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboard()
      if (response.success) {
        setStats({
          totalUsers: response.data.stats.users.total_users || 0,
          totalCompanies: response.data.stats.companies.total_companies || 0,
          totalAppointments: response.data.stats.appointments.total_appointments || 0,
          totalRevenue: response.data.stats.subscriptions.total_revenue || 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="number">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Companies</h3>
          <div className="number">{stats.totalCompanies}</div>
        </div>
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <div className="number">{stats.totalAppointments}</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="number">${stats.totalRevenue}</div>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/admin/companies" className="btn">Manage Companies</Link>
          <Link to="/admin/users" className="btn">Manage Users</Link>
          <Link to="/admin/appointments" className="btn">View Appointments</Link>
          <Link to="/admin/billing" className="btn">Billing & Payments</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
