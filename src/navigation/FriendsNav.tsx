import {
  createNativeStackNavigator,
  NativeStackNavigationOptions
} from "@react-navigation/native-stack"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"
import { ButtonTopBarNavigation } from "../components/ButtonTopBarNavigation"
import PageAddFriends from "../screens/page-friends/page-add-friends"
import PageFriends from "../screens/page-friends/page-friends"
import { useNavigation } from "@react-navigation/native"

const Stack = createNativeStackNavigator()

const HeaderRight = () => {
  const navigation = useNavigation()

  return (
    <ButtonTopBarNavigation onClick={() => navigation.navigate("Add Friends")}>
      <Ionicons name="person-add" size={25} color="#052D40" />
    </ButtonTopBarNavigation>
  )
}

const options: NativeStackNavigationOptions = {
  headerRight: HeaderRight,
  headerTitleAlign: "left"
}

const FriendsNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Friends" component={PageFriends} options={options} />
      <Stack.Screen name="Add Friends" component={PageAddFriends} />
    </Stack.Navigator>
  )
}

export default FriendsNav
