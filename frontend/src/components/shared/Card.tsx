import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  headerActions?: React.ReactNode
  footer?: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerActions,
  footer,
  padding = 'md',
  shadow = 'md',
  hover = false
}) => {
  const cardClasses = [
    'card',
    `card-padding-${padding}`,
    `card-shadow-${shadow}`,
    hover ? 'card-hover' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClasses}>
      {(title || subtitle || headerActions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="card-header-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
