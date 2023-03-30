import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FeedNav from "../FeedNav";
import BoostersNav from "../BoostersNav";
import React from "react";
import FriendsNav from "../FriendsNav";
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";

type InAppTabNavTabParamList = {
  Boosters: undefined;
  Feed: undefined;
  Friends: undefined;
};

const Tab = createBottomTabNavigator<InAppTabNavTabParamList>()
type TabProps = BottomTabScreenProps<InAppTabNavTabParamList>;

const TabBarIcon = ({ focused, color, size }) => {
  const route = useRoute<TabProps["route"]>()

  switch (route.name) {
  case "Boosters":
    return (
      <Ionicons
        name={focused ? "trending-up" : "trending-up-outline"}
        size={size}
        color={color}
      />
    )
  case "Feed":
    return (
      <Ionicons
        name={focused ? "newspaper" : "newspaper-outline"}
        size={size}
        color={color}
      />
    )
  case "Friends":
    return (
      <Ionicons
        name={focused ? "ios-person" : "ios-person-outline"}
        size={size}
        color={color}
      />
    )
  }
}

const navigatorScreenOptions = {
  tabBarIcon: TabBarIcon,
  tabBarActiveTintColor: "#0A5172",
  tabBarInactiveTintColor: "gray",
  tabBarLabelStyle: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 11
  }
}

const screenOptions = { headerShown: false }

export const InAppTabNav = () => {
  useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  return (
    <Tab.Navigator
      initialRouteName="Boosters"
      screenOptions={navigatorScreenOptions}
    >
      <Tab.Screen name="Feed" component={FeedNav} options={screenOptions} />
      <Tab.Screen
        name="Boosters"
        component={BoostersNav}
        options={screenOptions}
      />
      <Tab.Screen name="Friends" component={FriendsNav} />
    </Tab.Navigator>
  )
}
