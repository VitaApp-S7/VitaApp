//import {useIsAuthenticated} from "@azure/msal-react";
import { AuthProvider } from "./src/context/AuthContext"
import AppNav from "./src/navigation/AppNav"
import React from "react"
import MoodPointsProvider from "./src/components/PopUps/MoodPointsContext"
import { NameProvider } from "./src/context/NameContext"
// import * as Linking from "expo-linking"
import Toast from "react-native-toast-message"
import Notification from "./src/components/Notifications/Notification"
import "react-native-url-polyfill/auto"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

export default function () {
  // const url = Linking.useURL()

  // const onScreenLoad = () => {
  //   console.log(url)
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MoodPointsProvider>
          <NameProvider>
            <AppNav />
          </NameProvider>
          <Notification />
          <Toast />
        </MoodPointsProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
