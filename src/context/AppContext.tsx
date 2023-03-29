import React, { PropsWithChildren, useEffect, useMemo, useState } from "react"
import UserType from "../types/UserType"
import * as SecureStore from "expo-secure-store"
import { SetExpo } from "../services/userService"
import * as Notifications from "expo-notifications"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import NewsType from "../types/NewsType"
import { getNews } from "../services/newsService"
import EventType from "../types/EventType"
import { getEvents } from "../services/eventService"
import { getFriends, getFrRequests, getSendedRequests } from "../services/friendsService"
import FriendType from "../types/FriendType"
import SendedFriendType from "../types/SendedFriendType"

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
  notification: Notifications.Notification;
  setNotification: (notification: Notifications.Notification) => void;
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
  setExpoToken: (accessToken) => accessToken,
  notification: null,
  setNotification: (notification) => notification
})

export const AppProvider = (props: PropsWithChildren) => {
  const [ user, setUser ] = useState<UserType>(null)
  const [ accessToken, setAccessToken ] = useState<string>(null)
  const [ moodPoints, setMoodPoints ] = useState(10)
  const [ expoToken, setExpoToken ] = useState<string>(null)
  const [ notification, setNotification ] = useState<Notifications.Notification>(null)

  const queryClient = useQueryClient()

  useEffect(() => {
    if(notification === null) return

    const title = notification.request.content.title

    if(title.includes("news") || title.includes("News")){
      queryClient.invalidateQueries([ "news" ])
    }
    if(title.includes("event") || title.includes("Event")){
      queryClient.invalidateQueries([ "events" ])
    }
    if(title.includes("request") || title.includes("Request")){
      queryClient.invalidateQueries([ "friends" ])
      if(title.includes("new") || title.includes("New")){
        queryClient.invalidateQueries([ "friendRequests" ])
      }
      if(title.includes("accepted") || title.includes("Accepted")){
        queryClient.invalidateQueries([ "invites" ])
      }
    }

  }, [ notification ])


  const login = async (token: string, newUser: UserType) => {
    setAccessToken(token)
    setUser(newUser)
  }

  const setNotificationMethod = async (notification: Notifications.Notification) => {
    setNotification(notification)
  }

  useEffect(() => {
    if(expoToken !== null && user !== null && expoToken !== user.expoToken){
      SetExpo(accessToken, expoToken)
    }
  }, [ expoToken, user ])

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
      setExpoToken,
      notification,
      setNotification: setNotificationMethod
    }
  }, [ user, accessToken, moodPoints, expoToken, notification ])

  useEffect(() => {
    if (user !== undefined && user !== null) {
      setMoodPoints(user.mood)
    }
  }, [ user ])

  return (
    <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
  )
}
