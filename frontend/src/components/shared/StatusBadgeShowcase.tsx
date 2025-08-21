import React from 'react'
import { StatusBadge, AppointmentStatusBadge } from './index'

const StatusBadgeShowcase: React.FC = () => {
  // Example status configurations for different types
  const companyStatusConfig = {
    pending: {
      label: 'PENDING',
      backgroundColor: '#ffc107',
      textColor: '#ffffff'
    },
    active: {
      label: 'ACTIVE',
      backgroundColor: '#28a745',
      textColor: '#ffffff'
    },
    suspended: {
      label: 'SUSPENDED',
      backgroundColor: '#dc3545',
      textColor: '#ffffff'
    }
  }

  const paymentStatusConfig = {
    pending: {
      label: 'PENDING',
      backgroundColor: '#ffc107',
      textColor: '#ffffff'
    },
    paid: {
      label: 'PAID',
      backgroundColor: '#28a745',
      textColor: '#ffffff'
    },
    failed: {
      label: 'FAILED',
      backgroundColor: '#dc3545',
      textColor: '#ffffff'
    }
  }

  const serviceStatusConfig = {
    active: {
      label: 'ACTIVE',
      backgroundColor: '#28a745',
      textColor: '#ffffff'
    },
    archived: {
      label: 'ARCHIVED',
      backgroundColor: '#6c757d',
      textColor: '#ffffff'
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Status Badge Components</h1>
        <p>Reusable status badge components for consistent styling across the application</p>
      </div>

      {/* Appointment Status Badges */}
      <div className="card">
        <div className="card-header">
          <h3>Appointment Status Badges</h3>
          <p>Specialized component for appointment statuses</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <strong>Small:</strong>
              <AppointmentStatusBadge status="pending" size="sm" />
            </div>
            <div>
              <strong>Medium:</strong>
              <AppointmentStatusBadge status="scheduled" size="md" />
            </div>
            <div>
              <strong>Large:</strong>
              <AppointmentStatusBadge status="completed" size="lg" />
            </div>
            <div>
              <strong>Cancelled:</strong>
              <AppointmentStatusBadge status="cancelled" size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Generic Status Badges */}
      <div className="card">
        <div className="card-header">
          <h3>Generic Status Badges</h3>
          <p>Flexible component for any type of status</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Company Status */}
            <div>
              <h4>Company Status</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <StatusBadge status="pending" statusConfig={companyStatusConfig} size="sm" />
                <StatusBadge status="active" statusConfig={companyStatusConfig} size="md" />
                <StatusBadge status="suspended" statusConfig={companyStatusConfig} size="lg" />
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <h4>Payment Status</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <StatusBadge status="pending" statusConfig={paymentStatusConfig} size="sm" />
                <StatusBadge status="paid" statusConfig={paymentStatusConfig} size="md" />
                <StatusBadge status="failed" statusConfig={paymentStatusConfig} size="lg" />
              </div>
            </div>

            {/* Service Status */}
            <div>
              <h4>Service Status</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <StatusBadge status="active" statusConfig={serviceStatusConfig} size="sm" />
                <StatusBadge status="archived" statusConfig={serviceStatusConfig} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="card">
        <div className="card-header">
          <h3>Usage Examples</h3>
          <p>How to use these components in your code</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <h4>Appointment Status Badge</h4>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
{`import { AppointmentStatusBadge } from '../shared'

// In your component
<AppointmentStatusBadge status="pending" size="sm" />
<AppointmentStatusBadge status="scheduled" size="md" />
<AppointmentStatusBadge status="completed" size="lg" />
<AppointmentStatusBadge status="cancelled" size="md" />`}
              </pre>
            </div>

            <div>
              <h4>Generic Status Badge</h4>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
{`import { StatusBadge } from '../shared'

// Define your status configuration
const statusConfig = {
  pending: {
    label: 'PENDING',
    backgroundColor: '#ffc107',
    textColor: '#ffffff'
  },
  active: {
    label: 'ACTIVE',
    backgroundColor: '#28a745',
    textColor: '#ffffff'
  }
}

// In your component
<StatusBadge status="pending" statusConfig={statusConfig} size="sm" />
<StatusBadge status="active" statusConfig={statusConfig} size="md" />`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusBadgeShowcase
