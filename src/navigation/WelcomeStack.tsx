//import {useIsAuthenticated} from "@azure/msal-react"
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { InAppTabNav } from "./InAppTabNav"

const WelcomeStack = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="CreateCharacter" component={PageCharacter} options={{ headerShown: false }} /> */}
      <Stack.Screen
        name="App"
        component={InAppTabNav}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default WelcomeStack
