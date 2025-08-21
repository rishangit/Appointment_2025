import React from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  className?: string
  dismissible?: boolean
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  className = '',
  dismissible = false
}) => {
  const alertClasses = [
    'alert',
    `alert-${type}`,
    className
  ].filter(Boolean).join(' ')

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '⚠️'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={alertClasses}>
      <span className="alert-icon">{getIcon()}</span>
      <span className="alert-message">{message}</span>
      {dismissible && onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert
