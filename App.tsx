import AppNav from "./src/navigation/AppNav/AppNav"
import React from "react"
import Toast from "react-native-toast-message"
import "react-native-url-polyfill/auto"
import { QueryClient } from "@tanstack/react-query"
import { AppProvider } from "./src/context/AppContext"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Reactotron from "reactotron-react-native"
import {
  QueryClientManager,
  reactotronReactQuery
} from "reactotron-react-query"
import { StatusBar } from "expo-status-bar"
import * as poppins from "@expo-google-fonts/poppins"

const Minute = 1000 * 60
const Hour = Minute * 60
const Day = Hour * 24

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 2 * Day,
      staleTime: 1 * Minute,
      onError: (error) => {
        console.log(error)
      }
    }
  }
})

//@ts-ignore
const queryClientManager = new QueryClientManager({ queryClient })

if (__DEV__) {
  Reactotron.use(reactotronReactQuery(queryClientManager))
    .setAsyncStorageHandler(AsyncStorage)
    .configure()
    .useReactNative()
    .connect()
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "VITAAPP_ASYNC_STORAGE"
})

export default function App() {
  poppins.useFonts({
    Poppins700Bold: poppins.Poppins_700Bold,
    Poppins600SemiBold: poppins.Poppins_600SemiBold,
    Poppins400Regular: poppins.Poppins_400Regular,
    Poppins500Medium: poppins.Poppins_500Medium,
    Poppins300Light: poppins.Poppins_300Light,
    Poppins800ExtraBold: poppins.Poppins_800ExtraBold
  })

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <AppProvider>
        <AppNav />
        <Toast />
        <StatusBar style={"dark"}></StatusBar>
      </AppProvider>
    </PersistQueryClientProvider>
  )
}
