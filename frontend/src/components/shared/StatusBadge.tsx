import React from 'react'

interface StatusConfig {
  label: string
  backgroundColor: string
  textColor: string
}

interface StatusBadgeProps {
  status: string
  statusConfig: Record<string, StatusConfig>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusConfig,
  size = 'md',
  className = ''
}) => {
  const config = statusConfig[status] || {
    label: status.toUpperCase(),
    backgroundColor: '#6c757d',
    textColor: '#ffffff'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        padding: size === 'sm' ? '6px 12px' : size === 'md' ? '8px 16px' : '10px 20px',
        fontSize: size === 'sm' ? '12px' : size === 'md' ? '14px' : '16px',
        lineHeight: '1',
        whiteSpace: 'nowrap'
      }}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge
