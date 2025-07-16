import { useState } from 'react'
import './SupportMenu.css'

const SupportMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const supportItems = [
    { id: 'about', name: 'About CxSE', icon: 'ℹ️' },
    { id: 'contact', name: 'Contact Support', icon: '💬' },
    { id: 'feedback', name: 'Give Product Feedback', icon: '💡' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'uploads', name: 'Uploads', icon: '📁' },
    { id: 'introduction', name: 'Introduction', icon: '👋' }
  ]

  const handleItemClick = (item) => {
    console.log(`Clicked: ${item.name}`)
    // Add actual functionality here
    setIsOpen(false)
  }

  return (
    <div className="support-menu">
      <button 
        className="support-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Support & Settings"
      >
        <span className="support-icon">⚙️</span>
        <span className="support-text">Support & Settings</span>
      </button>
      
      {isOpen && (
        <div className="support-dropdown">
          <div className="support-header">
            <h4>Support & Settings</h4>
          </div>
          <div className="support-items">
            {supportItems.map(item => (
              <button
                key={item.id}
                className="support-item"
                onClick={() => handleItemClick(item)}
              >
                <span className="support-item-icon">{item.icon}</span>
                <span className="support-item-text">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportMenu