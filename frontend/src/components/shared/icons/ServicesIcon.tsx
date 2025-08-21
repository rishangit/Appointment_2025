import React from 'react'

interface ServicesIconProps {
  size?: number
  color?: string
}

const ServicesIcon: React.FC<ServicesIconProps> = ({ 
  size = 24, 
  color = 'currentColor' 
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
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <path d="M12 6l1.5 3L17 9.5l-2.5 2.5.5 3L12 13.5 9 15l.5-3L7 9.5l3.5-.5L12 6z" />
    </svg>
  )
}

export default ServicesIcon
