import React, { PropsWithChildren, useEffect, useMemo, useState } from "react"
import UserType from "../types/UserType"
import * as SecureStore from "expo-secure-store"
import { SetExpo } from "../services/userService"

interface AppContextType {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  moodPoints: number;
  setMoodPoints: React.Dispatch<React.SetStateAction<number>>;
  login: (token: string, newUser: UserType) => Promise<void>;
  logout: () => Promise<void>;
  expoToken: string;
  setExpoToken: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = React.createContext<AppContextType>({
  user: null,
  setUser: (user) => user,
  accessToken: null,
  setAccessToken: (accessToken) => accessToken,
  moodPoints: null,
  setMoodPoints: (moodPoints) => moodPoints,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  expoToken: null,
  setExpoToken: (accessToken) => accessToken
})

export const AppProvider = (props: PropsWithChildren) => {
  const [ user, setUser ] = useState<UserType>(null)
  const [ accessToken, setAccessToken ] = useState<string>(null)
  const [ moodPoints, setMoodPoints ] = useState(10)
  const [ expoToken, setExpoToken ] = useState<string>(null)

  const login = async (token: string, newUser: UserType) => {
    setAccessToken(token)
    setUser(newUser)
  }

  useEffect(() => {
    if(expoToken !== null && expoToken !== user.expoToken){
      SetExpo(accessToken, expoToken)
    }
  }, [ expoToken ])

  const logout = async () => {
    await SecureStore.deleteItemAsync("User")
    await SecureStore.deleteItemAsync("FirstLogin")
    await SecureStore.deleteItemAsync("token")
    setAccessToken(null)
    setUser(null)
  }

  const state = useMemo<AppContextType>(() => {
    return {
      user,
      setUser,
      accessToken,
      setAccessToken,
      moodPoints,
      setMoodPoints,
      login,
      logout,
      expoToken,
      setExpoToken
    }
  }, [ user, accessToken, moodPoints, expoToken ])

  useEffect(() => {
    if (user !== undefined && user !== null) {
      setMoodPoints(user.mood)
    }
  }, [ user ])

  return (
    <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
  )
}
