import React from 'react'

interface DropdownArrowIconProps {
  size?: number
  color?: string
  className?: string
  direction?: 'down' | 'up' | 'left' | 'right'
}

const DropdownArrowIcon: React.FC<DropdownArrowIconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  className = '',
  direction = 'down'
}) => {
  const getRotation = () => {
    switch (direction) {
      case 'up': return 'rotate(180deg)'
      case 'left': return 'rotate(90deg)'
      case 'right': return 'rotate(-90deg)'
      default: return 'rotate(0deg)'
    }
  }

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
      style={{ 
        color: 'var(--color-text-secondary)',
        transform: getRotation(),
        transition: 'transform 0.2s ease'
      }}
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  )
}

export default DropdownArrowIcon
