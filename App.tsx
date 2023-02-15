//import {useIsAuthenticated} from "@azure/msal-react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNav from "./src/navigation/AppNav";
import React, { useState, useEffect } from "react";
import { MoodProvider } from "./src/components/PopUps/MoodPointsContext";
import { NameProvider } from "./src/context/NameContext";
import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";
import Notification from './src/components/Notifications/Notification'
import "react-native-url-polyfill/auto";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App = () => {
  const url = Linking.useURL();

  const onScreenLoad = () => {
    console.log(url);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MoodProvider>
        <AuthProvider>
          <NameProvider>
            <AppNav />
          </NameProvider>
          <Notification/>
      </AuthProvider>
        <Toast />
      </MoodProvider>
    </QueryClientProvider>
  );
};
//TOAST has to be last child otherwise it won't work!
export default App;
