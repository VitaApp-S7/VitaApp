//import {useIsAuthenticated} from "@azure/msal-react";
import AppNav from "./src/navigation/AppNav/AppNav"
import React from "react"
// import * as Linking from "expo-linking"
import Toast from "react-native-toast-message"
import Notification from "./src/components/Notifications/Notification"
import "react-native-url-polyfill/auto"
import { QueryClient } from "@tanstack/react-query"
import { AppProvider } from "./src/context/AppContext"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import AsyncStorage from "@react-native-async-storage/async-storage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 24 * 60 * (60 * 1000),
      staleTime: 2 * (60 * 1000)
    }
  }
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "VITAAPP_ASYNC_STORAGE"
})

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <AppProvider>
        <AppNav />
        <Notification />
        <Toast />
      </AppProvider>
    </PersistQueryClientProvider>
  )
}
