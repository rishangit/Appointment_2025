import React from 'react'

interface CheckIconProps {
  size?: number
  color?: string
  className?: string
}

const CheckIcon: React.FC<CheckIconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ color: 'var(--color-status-success)' }}
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  )
}

export default CheckIcon
