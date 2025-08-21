import React from 'react'

interface BuildingIconProps {
  size?: number
  color?: string
  className?: string
}

const BuildingIcon: React.FC<BuildingIconProps> = ({ 
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
      style={{ color: 'var(--color-text-primary)' }}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <rect x="9" y="9" width="1" height="1" />
      <rect x="14" y="9" width="1" height="1" />
      <rect x="9" y="14" width="1" height="1" />
      <rect x="14" y="14" width="1" height="1" />
      <line x1="5" y1="5" x2="19" y2="5" />
    </svg>
  )
}

export default BuildingIcon
