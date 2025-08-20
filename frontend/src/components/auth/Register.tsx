import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import type { RootState } from '../../store'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { UserRole } from '../../types'

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
                     <select
             id="role"
             name="role"
             value={formData.role}
             onChange={handleChange}
             required
           >
             <option value={UserRole.USER}>User</option>
             <option value={UserRole.COMPANY}>Company</option>
           </select>
        </div>

                 {formData.role === UserRole.COMPANY && (
          <>
            <div className="form-group">
              <label htmlFor="companyName">Company Name:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyAddress">Company Address:</label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyPhone">Company Phone:</label>
              <input
                type="tel"
                id="companyPhone"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  )
}

export default Register
