import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import type { RootState } from '../../store'
import { loginUser, clearError } from '../../store/slices/authSlice'
import { UserRole } from '../../types'
import { Button, Input, Alert } from '../shared'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, loading, error, isAuthenticated } = useAppSelector((state: RootState) => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [success, setSuccess] = useState('')

  // Navigate when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setSuccess('Login successful! Redirecting...')
      
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    
    try {
      await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap()
    } catch (err) {
      // Error is handled by Redux state
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">📅</span>
            <h1>AMS</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && (
          <Alert type="error" message={error} />
        )}

        {success && (
          <Alert type="success" message={success} />
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            label="Email Address"
            required
            icon="📧"
            autoComplete="email"
          />

          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            label="Password"
            required
            icon="🔒"
            autoComplete="current-password"
          />

          <Button 
            type="submit" 
            variant="primary"
            size="lg"
            loading={loading}
            fullWidth
            className="login-button"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="login-footer">
          <p className="register-link">
            Don't have an account?{' '}
            <Link to="/register" className="link-primary">
              Create one here
            </Link>
          </p>
        </div>

        <div className="login-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  )
}

export default Login
