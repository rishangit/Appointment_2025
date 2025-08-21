import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  className?: string
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  text
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner-${size}`,
    `loading-spinner-${color}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="loading-container">
      <div className={spinnerClasses}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
