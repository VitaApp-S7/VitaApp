import React, { useContext } from "react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { AppContext } from "../../context/AppContext"
import PageLogin from "../../screens/page-login/page-login"
import { InAppTabNav } from "./InAppTabNav"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

type AppNavStackParamList = {
  App: undefined
  Login: undefined
}

const Stack = createNativeStackNavigator<AppNavStackParamList>()
//type StackProps = BottomTabScreenProps<AppNavStackParamList>
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF"
  }
}

const screenOptions = { headerShown: false }

const AppNav = () => {
  const { accessToken, user } = useContext(AppContext)

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator>
        {!accessToken || !user ? (
          <Stack.Screen
            name="Login"
            component={PageLogin}
            options={screenOptions}
          />
        ) : (
          <Stack.Screen
            name="App"
            component={InAppTabNav}
            options={screenOptions}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNav
