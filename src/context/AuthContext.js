import React, { createContext, useState } from "react"
import * as SecureStore from "expo-secure-store"

export const AuthContext = createContext() 

export const AuthProvider = ({ children }) => {
    
  const [ accessToken, setAccessToken ] = useState(null)


  const login = async (token) => {
    setAccessToken(token)
  }
    
  const logout = async () => {
    await SecureStore.deleteItemAsync("User")
    await SecureStore.deleteItemAsync("FirstLogin")
    await SecureStore.deleteItemAsync("token")
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      accessToken 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
