import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import React from "react"
import PageFriends from "../screens/page-friends/page-friends"
import PageRequests from "../screens/page-friends/page-requests"

const Tab = createMaterialTopTabNavigator()

const FriendsNav = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: "#031D29",
        tabBarInactiveTintColor: "#031D29",
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: "Poppins600SemiBold",
          textTransform: "none"
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#FA9901",
          height: 3
        }
      })}
    >
      <Tab.Screen name="People" component={PageFriends} />
      <Tab.Screen name="Requests" component={PageRequests} />
    </Tab.Navigator>
  )
}

export default FriendsNav
