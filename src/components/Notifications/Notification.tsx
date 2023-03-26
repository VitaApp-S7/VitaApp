/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react"
import { StyleSheet, Platform, View } from "react-native"
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"
import * as Device from "expo-device"

import { setUserExpoPushToken } from "../../services/NotificationService"
import { AppContext } from "../../context/AppContext"
import { SetExpo } from "../../services/userService"


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export default function Notification() {
  const notificationListener = useRef()
  const responseListener = useRef()

  const { setExpoToken } = useContext(AppContext)

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async token => {
        const cleanedToken = token.replace("ExponentPushToken[", "").replace("]", "")
        setExpoToken(cleanedToken)
        console.log(token)
      })
      .catch(reason => console.log(reason))

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return <View></View>
}

// eslint-disable-next-line no-unused-vars
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" }
    },
    trigger: { seconds: 2 }
  })
}

async function registerForPushNotificationsAsync() {
  let token

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!")
      return
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: "5d6942ac-e779-47ab-885a-7d876e3ef01a" })).data
  } else {
    alert("Must use physical device for Push Notifications")
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [ 0, 250, 250, 250 ],
      lightColor: "#FF231F7C"
    })
  }

  return token
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// })
