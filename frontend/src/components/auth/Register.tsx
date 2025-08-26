import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import type { RootState } from '../../store'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { UserRole } from '../../types'
import { Button, Input, Select, Alert, Card } from '../shared'
import { PasswordIcon, UserIcon, EmailIcon, BuildingIcon, LocationIcon, PhoneIcon, SelectArrowIcon } from '../shared/icons'
import { getAvailableRoles } from '../../utils/userRoleUtils'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, loading, error, isAuthenticated } = useAppSelector((state: RootState) => state.auth)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.USER,
    companyName: '',
    companyAddress: '',
    companyPhone: ''
  })
  const [success, setSuccess] = useState('')

  // Navigate when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setSuccess('Registration successful! Redirecting...')
      
      // Navigate based on user role
      if (user.role === UserRole.ADMIN) {
        navigate('/admin')
      } else if (user.role === UserRole.COMPANY) {
        navigate('/company')
      } else {
        navigate('/user')
      }
    }
  }, [isAuthenticated, user, navigate])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role' ? value as UserRole : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')

    try {
      // Prepare the request data
      const requestData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }

      // Add company data if registering as company
      if (formData.role === UserRole.COMPANY) {
        requestData.companyData = {
          name: formData.companyName,
          address: formData.companyAddress,
          phone: formData.companyPhone,
          email: formData.email
        }
      }

      await dispatch(registerUser(requestData)).unwrap()
    } catch (err) {
      // Error is handled by Redux state
    }
  }

  return (
    <div className="login-container">
      <Card 
        className="register-card"
        title="Create Account"
        subtitle="Join our appointment management system"
      >
        {error && (
          <Alert type="error" message={error} />
        )}

        {success && (
          <Alert type="success" message={success} />
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            label="Full Name"
            required
            icon={<UserIcon size={20} />}
            autoComplete="name"
          />

          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            label="Email Address"
            required
            icon={<EmailIcon size={20} />}
            autoComplete="email"
          />

          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            label="Password"
            required
            icon={<PasswordIcon size={20} />}
            autoComplete="new-password"
          />

          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={getAvailableRoles()}
            label="Account Type"
            required
            placeholder="Select account type"
            icon={<SelectArrowIcon size={16} />}
            searchable={true}
          />

          {formData.role === UserRole.COMPANY && (
            <>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                label="Company Name"
                required
                icon={<BuildingIcon size={20} />}
              />

              <Input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Enter company address"
                label="Company Address"
                required
                icon={<LocationIcon size={20} />}
              />

              <Input
                type="tel"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                placeholder="Enter company phone"
                label="Company Phone"
                required
                icon={<PhoneIcon size={20} />}
              />
            </>
          )}

          <Button 
            type="submit" 
            variant="primary"
            size="lg"
            loading={loading}
            fullWidth
            className="register-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="register-footer">
          <p className="login-link">
            Already have an account?{' '}
            <Link to="/login" className="link-primary">
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Register
