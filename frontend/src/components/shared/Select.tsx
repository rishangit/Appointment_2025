import React, { useState, useEffect, useRef } from 'react'

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
  icon?: React.ReactNode
  searchable?: boolean
}
-''
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
  multiple = false,
  icon,
  searchable = false
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

  // Searchable dropdown state
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: SelectOption) => {
    const syntheticEvent = {
      target: {
        name,
        value: option.value
      }
    } as React.ChangeEvent<HTMLSelectElement>
    onChange(syntheticEvent)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  // If searchable is enabled, render searchable dropdown
  if (searchable) {
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
        )}
        
        <div className="searchable-dropdown" ref={dropdownRef}>
          <div 
            className="dropdown-trigger"
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <input
              type="text"
              className="dropdown-input"
              placeholder={placeholder}
              value={selectedOption ? selectedOption.label : ''}
              readOnly
              disabled={disabled}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-autocomplete="list"
            />
            {icon && (
              <span className="dropdown-arrow">{icon}</span>
            )}
          </div>
          
          {isOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-search">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </div>
              <div className="dropdown-options" role="listbox">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                      onClick={() => !option.disabled && handleSelect(option)}
                      role="option"
                      aria-selected={option.value === value}
                    >
                      {option.label}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-no-results">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div id={`${name}-error`} className="select-error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>
    )
  }

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
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={error ? 'true' : 'false'}
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
        {icon && (
          <span className="select-icon">{icon}</span>
        )}
      </div>
      
      {error && (
        <div id={`${name}-error`} className="select-error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  )
}

export default Select
