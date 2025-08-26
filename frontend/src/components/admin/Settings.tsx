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

  const tabs = [
    { id: 'general', label: 'General Settings' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' }
  ]

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Settings</h1>
        <p>Manage your account and application preferences</p>
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
                <label>Admin Name</label>
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
                  <input type="checkbox" defaultChecked /> Appointment alerts
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> System updates
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
              <button className="btn btn-primary">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
