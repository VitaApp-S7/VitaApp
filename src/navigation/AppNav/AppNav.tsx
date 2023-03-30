import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppContext } from "../../context/AppContext";
import PageLogin from "../../screens/page-login/page-login";
import { InAppTabNav } from "./InAppTabNav";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type AppNavStackParamList = {
  App: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<AppNavStackParamList>()
//type StackProps = BottomTabScreenProps<AppNavStackParamList>

const screenOptions = { headerShown: false }

const AppNav = () => {
  const { accessToken, user } = useContext(AppContext)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {accessToken !== null && user !== null ? (
          <Stack.Screen
            name="App"
            component={InAppTabNav}
            options={screenOptions}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={PageLogin}
            options={screenOptions}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNav
