import React from 'react'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps {
  name: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  className?: string
  fullWidth?: boolean
  multiple?: boolean
}

const Select: React.FC<SelectProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  label,
  required = false,
  disabled = false,
  error,
  className = '',
  fullWidth = true,
  multiple = false
}) => {
  const selectClasses = [
    'form-select',
    error ? 'select-error' : '',
    className
  ].filter(Boolean).join(' ')

  const wrapperClasses = [
    'select-wrapper',
    fullWidth ? 'w-full' : '',
    error ? 'select-wrapper-error' : ''
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={selectClasses}
          multiple={multiple}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {error && (
        <div className="select-error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  )
}

export default Select
