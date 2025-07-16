import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import SupportMenu from './components/SupportMenu'
import TrainingModule from './components/TrainingModule'
import { UserProvider } from './context/UserContext'

function App() {
  const [currentModule, setCurrentModule] = useState('training')
  const [darkMode, setDarkMode] = useState(true)

  return (
    <UserProvider>
      <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="app-layout">
          <Sidebar currentModule={currentModule} setCurrentModule={setCurrentModule} />
          <main className="main-content">
            {currentModule === 'training' && <TrainingModule />}
            {currentModule !== 'training' && (
              <div className="coming-soon">
                <h2>Coming Soon</h2>
                <p>This module is not yet available in the MVP.</p>
              </div>
            )}
          </main>
          <SupportMenu />
        </div>
      </div>
    </UserProvider>
  )
}

export default App