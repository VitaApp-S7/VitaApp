import React, { PropsWithChildren, useEffect, useState } from "react"
import UserType from "../types/UserType"
import * as Notifications from "expo-notifications"
import useAuthentication from "./useAuthentication"
import useNotifications from "./useNotifications"

const initialized = false

interface AppContextType {
  user: UserType;
  accessToken: string;
  moodPoints: number;
  setMoodPoints: React.Dispatch<React.SetStateAction<number>>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  expoToken: string;
  notification: Notifications.Notification;
}

export const AppContext = React.createContext<AppContextType>({
  user: null,
  accessToken: null,
  moodPoints: null,
  setMoodPoints: (moodPoints) => moodPoints,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  expoToken: null,
  notification: null
})

export const AppProvider = (props: PropsWithChildren) => {
  const [ moodPoints, setMoodPoints ] = useState(10)
  const { expoToken, notification } = useNotifications()
  const { user, accessToken, login, logout } = useAuthentication(expoToken)

  useEffect(() => {
    if (user !== undefined && user !== null) {
      setMoodPoints(user.mood)
    }
  }, [ user ])

  return (
    <AppContext.Provider
      value={{
        user,
        accessToken,
        moodPoints,
        setMoodPoints,
        login,
        logout,
        expoToken,
        notification
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
