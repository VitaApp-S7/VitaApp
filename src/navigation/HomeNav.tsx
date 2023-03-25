import {
  createNativeStackNavigator,
  NativeStackNavigationOptions
} from "@react-navigation/native-stack"
import PageAccount from "../screens/page-account/page-account"
import PageHome from "../screens/page-home/page-home"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"
import PageHistory from "../screens/page-history/page-history"
import PageMoodboosterDetails from "../screens/page-moodbooster-details/page-moodbooster-details"
import { useNavigation } from "@react-navigation/native"
import {
  NavigationRouteParamList,
  RouteParamList
} from "../types/RouteParamList"
import { TopBarNavigationButton } from "../components/buttons/TopBarNavigationButton"

const Stack = createNativeStackNavigator<RouteParamList>()

const HeaderRight = () => {
  const navigation = useNavigation<NavigationRouteParamList>()

  return (
    <TopBarNavigationButton onClick={() => navigation.navigate("Account")}>
      <Ionicons name="person-circle" size={32} color="#052D40" />
    </TopBarNavigationButton>
  )
}

const HeaderLeft = () => {
  const navigation = useNavigation<NavigationRouteParamList>()

  return (
    <TopBarNavigationButton onClick={() => navigation.navigate("History")}>
      <Ionicons name="time" size={32} color="#052D40" />
    </TopBarNavigationButton>
  )
}

const options: NativeStackNavigationOptions = {
  headerRight: HeaderRight,
  headerLeft: HeaderLeft,
  headerTitleAlign: "center"
}

const Home = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={PageHome} options={options} />
      <Stack.Screen name="Account" component={PageAccount} />
      <Stack.Screen name="History" component={PageHistory} />
      <Stack.Screen
        name="Moodbooster Details"
        component={PageMoodboosterDetails}
      />
    </Stack.Navigator>
  )
}

export default Home
