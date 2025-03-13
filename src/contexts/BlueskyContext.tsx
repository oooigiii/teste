import React, { createContext, useContext, useState } from 'react'
import { blueskyService } from '../services/bluesky'
import { BlueskyUser } from '../types/bluesky'

interface BlueskyContextType {
  isAuthenticated: boolean
  currentUser: BlueskyUser | null
  login: (identifier: string, password: string) => Promise<boolean>
  logout: () => void
}

const BlueskyContext = createContext<BlueskyContextType | undefined>(undefined)

export const BlueskyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<BlueskyUser | null>(null)

  const login = async (identifier: string, password: string) => {
    const response = await blueskyService.login(identifier, password)
    if (response.success) {
      setIsAuthenticated(true)
      const userResponse = await blueskyService.getCurrentUser()
      if (userResponse.success && userResponse.data) {
        setCurrentUser(userResponse.data)
      }
      return true
    }
    return false
  }

  const logout = () => {
    blueskyService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  return (
    <BlueskyContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout
      }}
    >
      {children}
    </BlueskyContext.Provider>
  )
}

export const useBluesky = () => {
  const context = useContext(BlueskyContext)
  if (context === undefined) {
    throw new Error('useBluesky must be used within a BlueskyProvider')
  }
  return context
}
