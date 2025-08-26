import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import type { RootState } from '../../store'
import { UserRole, Company } from '../../types'
import { companyAPI } from '../../utils/api'
import { Input } from '../shared'
import { PasswordIcon } from '../shared/icons'



const Profile: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [companyData, setCompanyData] = useState<Company | null>(null)
  const [loadingCompany, setLoadingCompany] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }))
    }
  }, [user])

  // Load company data if user is a company owner
  useEffect(() => {
    if (user?.role === UserRole.COMPANY) {
      loadCompanyData()
    }
  }, [user])

  const loadCompanyData = async () => {
    setLoadingCompany(true)
    try {
      const response = await companyAPI.getCompanyProfile()
      const company = response.data
      setCompanyData(company)
      setCompanyFormData({
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email
      })
    } catch (error) {
      console.error('Failed to load company data:', error)
      setMessage('Failed to load company data')
      setMessageType('error')
    } finally {
      setLoadingCompany(false)
    }
  }



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyFormData({
      ...companyFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    // Validate passwords if changing password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage('New passwords do not match')
        setMessageType('error')
        return
      }
      if (formData.newPassword.length < 6) {
        setMessage('Password must be at least 6 characters')
        setMessageType('error')
        return
      }
    }

    try {
      setMessage('Profile updated successfully!')
      setMessageType('success')
      setIsEditing(false)
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      setMessage('Failed to update profile')
      setMessageType('error')
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      await companyAPI.updateCompanyProfile(companyFormData)
      setMessage('Company profile updated successfully!')
      setMessageType('success')
      setIsEditingCompany(false)
      await loadCompanyData() // Reload company data
    } catch (error) {
      setMessage('Failed to update company profile')
      setMessageType('error')
    }
  }

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Super Admin'
      case UserRole.COMPANY:
        return 'Company Owner'
      case UserRole.USER:
        return 'End User'
      default:
        return role
    }
  }

  if (!user) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      {/* Global Message */}
      {message && (
        <div className={`alert alert-${messageType}`} style={{ marginBottom: '20px' }}>
          {message}
        </div>
      )}

      <div className="profile-container">
        {/* User Profile Card */}
        <div className="card profile-card">
          <div className="profile-header">
            <h2>User Profile</h2>
            <button 
              className="btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="profile-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={getRoleDisplayName(user.role)}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Member Since</label>
                <input
                  type="text"
                  value={new Date(user.createdAt).toLocaleDateString()}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>

            {isEditing && (
              <div className="profile-section">
                <h3>Change Password</h3>
                <p className="text-muted">Leave blank if you don't want to change your password</p>
                
                <Input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  label="Current Password"
                  icon={<PasswordIcon size={20} />}
                />

                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  label="New Password"
                  icon={<PasswordIcon size={20} />}
                />

                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  label="Confirm New Password"
                  icon={<PasswordIcon size={20} />}
                />
              </div>
            )}

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: user.name,
                      email: user.email,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                    setMessage('')
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Company Profile Card - Only for Company Owners */}
        {user?.role === UserRole.COMPANY && (
          <div className="card profile-card">
            <div className="profile-header">
              <h2>Company Profile</h2>
              <button 
                className="btn"
                onClick={() => setIsEditingCompany(!isEditingCompany)}
                disabled={loadingCompany}
              >
                {isEditingCompany ? 'Cancel' : 'Edit Company'}
              </button>
            </div>

            {loadingCompany ? (
              <div className="text-center">Loading company data...</div>
            ) : (
              <form onSubmit={handleCompanySubmit}>
                <div className="profile-section">
                  <h3>Company Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      name="name"
                      value={companyFormData.name}
                      onChange={handleCompanyChange}
                      disabled={!isEditingCompany}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyAddress">Company Address</label>
                    <input
                      type="text"
                      id="companyAddress"
                      name="address"
                      value={companyFormData.address}
                      onChange={handleCompanyChange}
                      disabled={!isEditingCompany}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyPhone">Company Phone</label>
                    <input
                      type="tel"
                      id="companyPhone"
                      name="phone"
                      value={companyFormData.phone}
                      onChange={handleCompanyChange}
                      disabled={!isEditingCompany}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyEmail">Company Email</label>
                    <input
                      type="email"
                      id="companyEmail"
                      name="email"
                      value={companyFormData.email}
                      onChange={handleCompanyChange}
                      disabled={!isEditingCompany}
                      required
                    />
                  </div>

                  {companyData && (
                    <div className="form-group">
                      <label>Company Status</label>
                      <input
                        type="text"
                        value={companyData.status}
                        disabled
                        className="disabled-input"
                      />
                    </div>
                  )}
                </div>

                {isEditingCompany && (
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Save Company Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditingCompany(false)
                        if (companyData) {
                          setCompanyFormData({
                            name: companyData.name,
                            address: companyData.address,
                            phone: companyData.phone,
                            email: companyData.email
                          })
                        }
                        setMessage('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}


      </div>
    </div>
  )
}

export default Profile
