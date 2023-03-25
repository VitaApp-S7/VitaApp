import React, { useContext } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { AppContext } from "../context/AppContext"
import PageLogin from "../screens/page-login/page-login"
import { InAppTabNav } from "./InAppTabNav"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const AppNav = () => {
  const { accessToken } = useContext(AppContext)
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {accessToken !== null ? (
          <Stack.Screen
            name="App"
            component={InAppTabNav}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={PageLogin}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNav
