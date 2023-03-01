//import {useIsAuthenticated} from "@azure/msal-react"
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import PageLogin from "../screens/page-login/page-login"

const AuthNav = () => {
  const Stack = createNativeStackNavigator()

  // const {isLoading, setIsLoading} = useState(false);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={PageLogin}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default AuthNav
