import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'warning' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  fullWidth = false
}) => {
  // Get button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-xs)',
      fontWeight: 'var(--font-fontWeight-medium)',
      transition: 'all 0.2s ease',
      fontFamily: 'var(--font-fontFamily-primary)',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
      position: 'relative' as const
    }

    // Size styles
    const sizeStyles = {
      sm: {
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        fontSize: 'var(--font-fontSize-sm)',
        minHeight: '32px'
      },
      md: {
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        fontSize: 'var(--font-fontSize-base)',
        minHeight: '40px'
      },
      lg: {
        padding: 'var(--spacing-md) var(--spacing-xl)',
        fontSize: 'var(--font-fontSize-lg)',
        minHeight: '48px'
      }
    }

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: 'var(--color-button-primary-background)',
        color: 'var(--color-button-primary-text)',
        border: '1px solid var(--color-button-primary-background)',
        '&:hover': {
          backgroundColor: 'var(--color-button-primary-hover)',
          borderColor: 'var(--color-button-primary-hover)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--color-shadow-md)'
        },
        '&:active': {
          backgroundColor: 'var(--color-button-primary-active)',
          borderColor: 'var(--color-button-primary-active)',
          transform: 'translateY(0)'
        }
      },
      secondary: {
        backgroundColor: 'var(--color-button-secondary-background)',
        color: 'var(--color-button-secondary-text)',
        border: '1px solid var(--color-button-secondary-background)',
        '&:hover': {
          backgroundColor: 'var(--color-button-secondary-hover)',
          borderColor: 'var(--color-button-secondary-hover)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--color-shadow-md)'
        },
        '&:active': {
          backgroundColor: 'var(--color-button-secondary-active)',
          borderColor: 'var(--color-button-secondary-active)',
          transform: 'translateY(0)'
        }
      },
      accent: {
        backgroundColor: 'var(--color-button-accent-background)',
        color: 'var(--color-button-accent-text)',
        border: '1px solid var(--color-button-accent-background)',
        '&:hover': {
          backgroundColor: 'var(--color-button-accent-hover)',
          borderColor: 'var(--color-button-accent-hover)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--color-shadow-md)'
        },
        '&:active': {
          backgroundColor: 'var(--color-button-accent-active)',
          borderColor: 'var(--color-button-accent-active)',
          transform: 'translateY(0)'
        }
      },
      danger: {
        backgroundColor: 'var(--color-status-error)',
        color: 'white',
        border: '1px solid var(--color-status-error)',
        '&:hover': {
          backgroundColor: '#dc2626',
          borderColor: '#dc2626',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--color-shadow-md)'
        },
        '&:active': {
          backgroundColor: '#b91c1c',
          borderColor: '#b91c1c',
          transform: 'translateY(0)'
        }
      },
      success: {
        backgroundColor: 'var(--color-status-success)',
        color: 'white',
        border: '1px solid var(--color-status-success)',
        '&:hover': {
          backgroundColor: '#059669',
          borderColor: '#059669',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--color-shadow-md)'
        },
        '&:active': {
          backgroundColor: '#047857',
          borderColor: '#047857',
          transform: 'translateY(0)'
        }
      },
      warning: {
        backgroundColor: 'var(--color-status-warning)',
        color: 'white',
        border: '1px solid var(--color-status-warning)',
        '&:hover': {
          backgroundColor: '#d97706',
          borderColor: '#d97706',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--color-shadow-md)'
        },
        '&:active': {
          backgroundColor: '#b45309',
          borderColor: '#b45309',
          transform: 'translateY(0)'
        }
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
        border: '2px solid var(--color-border-primary)',
        '&:hover': {
          backgroundColor: 'var(--color-background-secondary)',
          borderColor: 'var(--color-border-accent)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--color-shadow-sm)'
        },
        '&:active': {
          backgroundColor: 'var(--color-background-tertiary)',
          borderColor: 'var(--color-border-secondary)',
          transform: 'translateY(0)'
        }
      }
    }

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    }
  }

  const buttonStyles = getButtonStyles()

  // Handle hover and active states with CSS custom properties
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    
    const button = e.currentTarget
    const variant = button.dataset.variant
    
    if (variant === 'primary') {
      button.style.backgroundColor = 'var(--color-button-primary-hover)'
      button.style.borderColor = 'var(--color-button-primary-hover)'
    } else if (variant === 'secondary') {
      button.style.backgroundColor = 'var(--color-button-secondary-hover)'
      button.style.borderColor = 'var(--color-button-secondary-hover)'
    } else if (variant === 'accent') {
      button.style.backgroundColor = 'var(--color-button-accent-hover)'
      button.style.borderColor = 'var(--color-button-accent-hover)'
    } else if (variant === 'danger') {
      button.style.backgroundColor = '#dc2626'
      button.style.borderColor = '#dc2626'
    } else if (variant === 'success') {
      button.style.backgroundColor = '#059669'
      button.style.borderColor = '#059669'
    } else if (variant === 'warning') {
      button.style.backgroundColor = '#d97706'
      button.style.borderColor = '#d97706'
    } else if (variant === 'outline') {
      button.style.backgroundColor = 'var(--color-background-secondary)'
      button.style.borderColor = 'var(--color-border-accent)'
    }
    
    button.style.transform = 'translateY(-1px)'
    button.style.boxShadow = variant === 'outline' ? 'var(--color-shadow-sm)' : 'var(--color-shadow-md)'
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    
    const button = e.currentTarget
    const variant = button.dataset.variant
    
    if (variant === 'primary') {
      button.style.backgroundColor = 'var(--color-button-primary-background)'
      button.style.borderColor = 'var(--color-button-primary-background)'
    } else if (variant === 'secondary') {
      button.style.backgroundColor = 'var(--color-button-secondary-background)'
      button.style.borderColor = 'var(--color-button-secondary-background)'
    } else if (variant === 'accent') {
      button.style.backgroundColor = 'var(--color-button-accent-background)'
      button.style.borderColor = 'var(--color-button-accent-background)'
    } else if (variant === 'danger') {
      button.style.backgroundColor = 'var(--color-status-error)'
      button.style.borderColor = 'var(--color-status-error)'
    } else if (variant === 'success') {
      button.style.backgroundColor = 'var(--color-status-success)'
      button.style.borderColor = 'var(--color-status-success)'
    } else if (variant === 'warning') {
      button.style.backgroundColor = 'var(--color-status-warning)'
      button.style.borderColor = 'var(--color-status-warning)'
    } else if (variant === 'outline') {
      button.style.backgroundColor = 'transparent'
      button.style.borderColor = 'var(--color-border-primary)'
    }
    
    button.style.transform = 'translateY(0)'
    button.style.boxShadow = 'none'
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    
    const button = e.currentTarget
    const variant = button.dataset.variant
    
    if (variant === 'primary') {
      button.style.backgroundColor = 'var(--color-button-primary-active)'
      button.style.borderColor = 'var(--color-button-primary-active)'
    } else if (variant === 'secondary') {
      button.style.backgroundColor = 'var(--color-button-secondary-active)'
      button.style.borderColor = 'var(--color-button-secondary-active)'
    } else if (variant === 'accent') {
      button.style.backgroundColor = 'var(--color-button-accent-active)'
      button.style.borderColor = 'var(--color-button-accent-active)'
    } else if (variant === 'danger') {
      button.style.backgroundColor = '#b91c1c'
      button.style.borderColor = '#b91c1c'
    } else if (variant === 'success') {
      button.style.backgroundColor = '#047857'
      button.style.borderColor = '#047857'
    } else if (variant === 'warning') {
      button.style.backgroundColor = '#b45309'
      button.style.borderColor = '#b45309'
    } else if (variant === 'outline') {
      button.style.backgroundColor = 'var(--color-background-tertiary)'
      button.style.borderColor = 'var(--color-border-secondary)'
    }
    
    button.style.transform = 'translateY(0)'
  }

  return (
    <button
      type={type}
      style={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      data-variant={variant}
      className={className}
    >
      {loading && (
        <span 
          className="loading-spinner"
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: 'var(--spacing-xs)'
          }}
        />
      )}
      {icon && !loading && (
        <span 
          className="btn-icon"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}

export default Button
