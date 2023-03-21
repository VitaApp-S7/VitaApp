import React, { createContext, useState } from "react"
import * as SecureStore from "expo-secure-store"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    
  const [ accessToken, setAccessToken ] = useState(null)
  const [ user, setUser ] = useState(null)


  const login = async (token, newUser) => {
    setAccessToken(token)
    setUser(newUser)
  }
    
  const logout = async () => {
    await SecureStore.deleteItemAsync("User")
    await SecureStore.deleteItemAsync("FirstLogin")
    await SecureStore.deleteItemAsync("token")
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      accessToken,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}
