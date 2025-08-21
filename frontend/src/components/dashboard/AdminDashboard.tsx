import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Button from '../shared/Button'
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
      // Handle error silently
    }
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ 
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-fontSize-2xl)',
        fontWeight: 'var(--font-fontWeight-bold)',
        marginBottom: 'var(--spacing-xl)',
        textAlign: 'center'
      }}>
        Admin Dashboard
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div style={{
          backgroundColor: 'var(--color-background-card)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: 'var(--color-shadow-md)',
          textAlign: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <h3 style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-fontSize-lg)',
            fontWeight: 'var(--font-fontWeight-medium)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Total Users
          </h3>
          <div style={{ 
            fontSize: 'var(--font-fontSize-3xl)',
            fontWeight: 'var(--font-fontWeight-bold)',
            color: 'var(--color-primary)'
          }}>
            {stats.totalUsers}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'var(--color-background-card)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: 'var(--color-shadow-md)',
          textAlign: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <h3 style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-fontSize-lg)',
            fontWeight: 'var(--font-fontWeight-medium)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Total Companies
          </h3>
          <div style={{ 
            fontSize: 'var(--font-fontSize-3xl)',
            fontWeight: 'var(--font-fontWeight-bold)',
            color: 'var(--color-secondary)'
          }}>
            {stats.totalCompanies}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'var(--color-background-card)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: 'var(--color-shadow-md)',
          textAlign: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <h3 style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-fontSize-lg)',
            fontWeight: 'var(--font-fontWeight-medium)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Total Appointments
          </h3>
          <div style={{ 
            fontSize: 'var(--font-fontSize-3xl)',
            fontWeight: 'var(--font-fontWeight-bold)',
            color: 'var(--color-accent)'
          }}>
            {stats.totalAppointments}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'var(--color-background-card)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: 'var(--color-shadow-md)',
          textAlign: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <h3 style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-fontSize-lg)',
            fontWeight: 'var(--font-fontWeight-medium)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Total Revenue
          </h3>
          <div style={{ 
            fontSize: 'var(--font-fontSize-3xl)',
            fontWeight: 'var(--font-fontWeight-bold)',
            color: 'var(--color-status-success)'
          }}>
            ${stats.totalRevenue}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--color-background-card)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-primary)',
        boxShadow: 'var(--color-shadow-md)'
      }}>
        <h3 style={{ 
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-fontSize-xl)',
          fontWeight: 'var(--font-fontWeight-semibold)',
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'center'
        }}>
          Quick Actions
        </h3>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link to="/admin/companies" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">
              Manage Companies
            </Button>
          </Link>
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="lg">
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/appointments" style={{ textDecoration: 'none' }}>
            <Button variant="accent" size="lg">
              View Appointments
            </Button>
          </Link>
          <Link to="/admin/billing" style={{ textDecoration: 'none' }}>
            <Button variant="success" size="lg">
              Billing & Payments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
