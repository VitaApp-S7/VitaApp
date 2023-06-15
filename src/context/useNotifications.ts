import * as Notifications from "expo-notifications"
import { Subscription } from "expo-notifications"
import { useEffect, useRef, useState } from "react"
import useNotificationUpdater from "./useNotificationListeners"
import * as Device from "expo-device"
import { Platform } from "react-native"

interface useNotificationsType {
  expoToken: string;
  notification: Notifications.Notification;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

const useNotifications = (): useNotificationsType => {
  const [ expoToken, setExpoToken ] = useState<string>(null)
  const { notification, setNotification } = useNotificationUpdater()
  const notificationListener = useRef<Subscription>()
  const responseListener = useRef<Subscription>()

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        const cleanedToken = token
          .replace("ExponentPushToken[", "")
          .replace("]", "")
        setExpoToken(cleanedToken)
        console.log(token)
      })
      .catch((reason) => console.log(reason))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotification(response.notification)
      })

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      )
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return {
    expoToken,
    notification
  }
}

async function registerForPushNotificationsAsync() {
  let token

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!")
      return
    }
    token = (
      await Notifications.getExpoPushTokenAsync({ projectId: "5d6942ac-e779-47ab-885a-7d876e3ef01a" })
    ).data
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

export default useNotifications
