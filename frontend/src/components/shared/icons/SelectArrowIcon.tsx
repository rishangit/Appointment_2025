import React from 'react'

interface SelectArrowIconProps {
  size?: number
  color?: string
  className?: string
}

const SelectArrowIcon: React.FC<SelectArrowIconProps> = ({ 
  size = 16, 
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
      style={{ 
        color: 'var(--color-text-muted)',
        transition: 'transform 0.2s ease'
      }}
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  )
}

export default SelectArrowIcon
