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
import Reactotron from "reactotron-react-native"
import { QueryClientManager, reactotronReactQuery } from "reactotron-react-query"
import { StatusBar } from "expo-status-bar"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 24 * 60 * (60 * 1000),
      staleTime: 2 * (60 * 1000)
    }
  }
})

// @ts-ignore
const queryClientManager = new QueryClientManager({ queryClient })

if(__DEV__){
  Reactotron
    .use(reactotronReactQuery(queryClientManager))
    .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
    .configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .connect()
}

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
        <StatusBar style={"dark"}></StatusBar>
      </AppProvider>
    </PersistQueryClientProvider>
  )
}
