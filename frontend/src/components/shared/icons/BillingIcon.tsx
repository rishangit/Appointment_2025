import React from 'react'

interface BillingIconProps {
  size?: number
  color?: string
}

const BillingIcon: React.FC<BillingIconProps> = ({ 
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
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <path d="M7 14h.01" />
      <path d="M12 14h.01" />
      <path d="M17 14h.01" />
      <path d="M7 18h.01" />
      <path d="M12 18h.01" />
      <path d="M17 18h.01" />
    </svg>
  )
}

export default BillingIcon
