import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import PageHome from "../screens/page-home/page-home";
import PageFriends from "../screens/page-friends/page-friends";
import Feed from "./FeedNav";
import Home from "./HomeNav";
import React from "react";
import FriendsNav from "./FriendsNav";
import { useNavigation } from "@react-navigation/native";

import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";

export const InAppTabNav = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  return (
    <Tab.Navigator
      initialRouteName="Boosters"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Boosters") {
            iconName = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "Feed") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } else if (route.name === "Friends") {
            iconName = focused ? "ios-person" : "ios-person-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0A5172",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontFamily: "Poppins_600SemiBold",
          fontSize: 11,
        },
        tabBarStyle: {},
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
  );
};
