import React from 'react'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  icon?: React.ReactNode
  className?: string
  fullWidth?: boolean
  autoComplete?: string
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  error,
  icon,
  className = '',
  fullWidth = true,
  autoComplete
}) => {
  const inputClasses = [
    'form-input',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ')

  const wrapperClasses = [
    'input-wrapper',
    fullWidth ? 'w-full' : '',
    error ? 'input-wrapper-error' : ''
  ].filter(Boolean).join(' ')

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className={wrapperClasses}>
        {icon && (
          <span className="input-icon">{icon}</span>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          autoComplete={autoComplete}
        />
      </div>
      
      {error && (
        <div className="input-error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  )
}

export default Input
