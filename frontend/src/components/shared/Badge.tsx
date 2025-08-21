import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  dot?: boolean
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false
}) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    dot ? 'badge-dot' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClasses}>
      {dot && <span className="badge-dot-indicator"></span>}
      {children}
    </span>
  )
}

export default Badge
