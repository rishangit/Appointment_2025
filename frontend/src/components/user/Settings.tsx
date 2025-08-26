import React, { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { useTheme } from '../../theme/useTheme'
import Select from '../shared/Select'

const Settings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('general')
  const { currentThemeName, setTheme } = useTheme()

  // Theme options for the select component
  const themeOptions = [
    { value: 'myInterior', label: 'My Interior' },
    { value: 'modernDark', label: 'Modern Dark' },
    { value: 'driftwood', label: 'Driftwood' },
    { value: 'ravenClaw', label: 'Raven Claw' }
  ]

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' }
  ]

  // Time zone options
  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'Eastern Time' },
    { value: 'CST', label: 'Central Time' },
    { value: 'MST', label: 'Mountain Time' },
    { value: 'PST', label: 'Pacific Time' }
  ]

  const tabs = [
    { id: 'general', label: 'General Settings' },
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' }
  ]

  return (
    <div className="container">
      <div className="page-header">
        <h1>User Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="card">
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value={user?.role || ''} readOnly />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>Profile Information</h3>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea placeholder="Enter your address" rows={3} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input type="text" placeholder="Emergency contact name" />
              </div>
              <div className="form-group">
                <label>Emergency Phone</label>
                <input type="tel" placeholder="Emergency contact phone" />
              </div>
              <button className="btn btn-primary">Update Profile</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="form-group">
                <label>Change Password</label>
                <input type="password" placeholder="Current password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="New password" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>
              <button className="btn btn-primary">Update Password</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> Email notifications
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> Appointment reminders
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> Appointment confirmations
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> Appointment cancellations
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> Marketing emails
                </label>
              </div>
              <button className="btn btn-primary">Save Preferences</button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance Settings</h3>
              <div className="form-group">
                <Select
                  name="theme"
                  label="Theme"
                  value={currentThemeName}
                  onChange={(e) => setTheme(e.target.value)}
                  options={themeOptions}
                  placeholder="Select a theme"
                />
              </div>
              <div className="form-group">
                <Select
                  name="language"
                  label="Language"
                  value="en"
                  onChange={() => {}}
                  options={languageOptions}
                  placeholder="Select language"
                />
              </div>
              <div className="form-group">
                <Select
                  name="timezone"
                  label="Time Zone"
                  value="UTC"
                  onChange={() => {}}
                  options={timezoneOptions}
                  placeholder="Select time zone"
                />
              </div>
              <button className="btn btn-primary">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
