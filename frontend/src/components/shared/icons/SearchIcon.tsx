import React from 'react'

interface SearchIconProps {
  size?: number
  color?: string
  className?: string
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
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
      style={{ color: 'var(--color-text-secondary)' }}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export default SearchIcon
