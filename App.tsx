//import {useIsAuthenticated} from "@azure/msal-react";
import AppNav from "./src/navigation/AppNav/AppNav"
import React from "react"
// import * as Linking from "expo-linking"
import Toast from "react-native-toast-message"
import Notification from "./src/components/Notifications/Notification"
import "react-native-url-polyfill/auto"
import { QueryClient, QueryClientProvider } from "react-query"
import { AppProvider } from "./src/context/AppContext"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppNav />
        <Notification />
        <Toast />
      </AppProvider>
    </QueryClientProvider>
  )
}
