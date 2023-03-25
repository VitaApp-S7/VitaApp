import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicons from "react-native-vector-icons/Ionicons"
import Feed from "./FeedNav"
import Home from "./HomeNav"
import React from "react"
import FriendsNav from "./FriendsNav"

import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import { useRoute } from "@react-navigation/native"

const TabBarIcon = ({ focused, color, size }) => {
  const route = useRoute()

  let iconName
  if (route.name === "Boosters") {
    iconName = focused ? "trending-up" : "trending-up-outline"
  } else if (route.name === "Feed") {
    iconName = focused ? "newspaper" : "newspaper-outline"
  } else if (route.name === "Friends") {
    iconName = focused ? "ios-person" : "ios-person-outline"
  }

  // You can return any component that you like here!
  return <Ionicons name={iconName} size={size} color={color} />
}

const Tab = createBottomTabNavigator()

export const InAppTabNav = () => {
  useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  return (
    <Tab.Navigator
      initialRouteName="Boosters"
      screenOptions={{
        tabBarIcon: TabBarIcon,
        tabBarActiveTintColor: "#0A5172",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontFamily: "Poppins600SemiBold",
          fontSize: 11
        }
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Boosters"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Friends" component={FriendsNav} />
    </Tab.Navigator>
  )
}
