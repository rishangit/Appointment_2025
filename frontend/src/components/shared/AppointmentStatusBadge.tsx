import React from 'react'
import { AppointmentStatus } from '../../types'
import StatusBadge from './StatusBadge'

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const statusConfig = {
    pending: {
      label: 'PENDING',
      backgroundColor: '#fd7e14',
      textColor: '#ffffff'
    },
    scheduled: {
      label: 'SCHEDULED',
      backgroundColor: '#007bff',
      textColor: '#ffffff'
    },
    completed: {
      label: 'COMPLETED',
      backgroundColor: '#28a745',
      textColor: '#ffffff'
    },
    cancelled: {
      label: 'CANCELLED',
      backgroundColor: '#dc3545',
      textColor: '#ffffff'
    }
  }

  return (
    <StatusBadge
      status={status}
      statusConfig={statusConfig}
      size={size}
      className={className}
    />
  )
}

export default AppointmentStatusBadge
