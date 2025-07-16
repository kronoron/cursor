import { useState } from 'react'
import { useUser } from '../context/UserContext'
import './Navbar.css'

const Navbar = ({ darkMode, setDarkMode }) => {
  const [showProfile, setShowProfile] = useState(false)
  const { user, updateUser, roles, accessLevels } = useUser()
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(user.name)

  const handleNameSave = () => {
    updateUser({ name: tempName })
    setEditingName(false)
  }

  const handleNameCancel = () => {
    setTempName(user.name)
    setEditingName(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => window.location.reload()}>
          <span className="logo-text">CxSE</span>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="profile-container">
          <button 
            className="profile-button"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-avatar">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <span className="profile-name">{user.name}</span>
            <svg className={`dropdown-arrow ${showProfile ? 'open' : ''}`} viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-section">
                <h3>Profile Settings</h3>
                
                <div className="profile-field">
                  <label>Name:</label>
                  {editingName ? (
                    <div className="edit-name">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
                      />
                      <div className="edit-buttons">
                        <button onClick={handleNameSave} className="save-btn">✓</button>
                        <button onClick={handleNameCancel} className="cancel-btn">✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="name-display" onClick={() => setEditingName(true)}>
                      {user.name} <span className="edit-icon">✏️</span>
                    </div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Role:</label>
                  <select 
                    value={user.role} 
                    onChange={(e) => updateUser({ role: e.target.value })}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-field">
                  <label>Access Level:</label>
                  <select 
                    value={user.accessLevel} 
                    onChange={(e) => updateUser({ accessLevel: e.target.value })}
                  >
                    {accessLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-field">
                  <label>Theme:</label>
                  <div className="theme-toggle">
                    <button 
                      className={`theme-btn ${!darkMode ? 'active' : ''}`}
                      onClick={() => setDarkMode(false)}
                    >
                      Light
                    </button>
                    <button 
                      className={`theme-btn ${darkMode ? 'active' : ''}`}
                      onClick={() => setDarkMode(true)}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar