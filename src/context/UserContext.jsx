import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    role: 'AE', // AE, SDR, BDR, CSM, AM
    accessLevel: 'User', // Owner, User
    isLoggedIn: true
  })

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const roles = ['AE', 'SDR', 'BDR', 'CSM', 'AM']
  const accessLevels = ['Owner', 'User']

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      roles,
      accessLevels
    }}>
      {children}
    </UserContext.Provider>
  )
}