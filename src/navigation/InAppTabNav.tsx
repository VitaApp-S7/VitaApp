import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicons from "react-native-vector-icons/Ionicons"
import Feed from "./FeedNav"
import Home from "./HomeNav"
import React from "react"
import FriendsNav from "./FriendsNav"

import {
  useFonts,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_400Regular as Poppins400Regular
} from "@expo-google-fonts/poppins"

export const InAppTabNav = () => {
  const Tab = createBottomTabNavigator()

  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  return (
    <Tab.Navigator
      initialRouteName="Boosters"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
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
        },
        tabBarActiveTintColor: "#0A5172",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontFamily: "Poppins600SemiBold",
          fontSize: 11
        },
        tabBarStyle: {}
      })}
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
      <Tab.Screen
        name="Friends"
        component={FriendsNav}
        options={{ headerShown: true }}
      />
    </Tab.Navigator>
  )
}
