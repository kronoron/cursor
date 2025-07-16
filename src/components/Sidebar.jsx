import './Sidebar.css'

const Sidebar = ({ currentModule, setCurrentModule }) => {
  const modules = [
    { id: 'onboarding', name: 'Onboarding', icon: '🎯', disabled: true },
    { id: 'training', name: 'Training', icon: '🏋️', disabled: false },
    { id: 'pipeline', name: 'Pipeline', icon: '📊', disabled: true },
    { id: 'analytics', name: 'Data & Analytics', icon: '📈', disabled: true },
    { id: 'other', name: 'Other', icon: '⚙️', disabled: true }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-modules">
          {modules.map(module => (
            <button
              key={module.id}
              className={`sidebar-btn ${currentModule === module.id ? 'active' : ''} ${module.disabled ? 'disabled' : ''}`}
              onClick={() => !module.disabled && setCurrentModule(module.id)}
              disabled={module.disabled}
              title={module.disabled ? 'Coming soon in future releases' : module.name}
            >
              <span className="sidebar-icon">{module.icon}</span>
              <span className="sidebar-text">{module.name}</span>
              {module.disabled && <span className="coming-soon-badge">Soon</span>}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar