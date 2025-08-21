import React from 'react'

interface TextAreaProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  rows?: number
  className?: string
  fullWidth?: boolean
  maxLength?: number
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  error,
  rows = 4,
  className = '',
  fullWidth = true,
  maxLength
}) => {
  const textareaClasses = [
    'form-textarea',
    error ? 'textarea-error' : '',
    className
  ].filter(Boolean).join(' ')

  const wrapperClasses = [
    'textarea-wrapper',
    fullWidth ? 'w-full' : '',
    error ? 'textarea-wrapper-error' : ''
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
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={textareaClasses}
          maxLength={maxLength}
        />
        {maxLength && (
          <div className="character-count">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      
      {error && (
        <div className="textarea-error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  )
}

export default TextArea
