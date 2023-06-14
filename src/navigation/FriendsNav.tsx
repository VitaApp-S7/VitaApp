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
import { Text, View } from "react-native"
import { globalStyle } from "../globalStyle"

const Stack = createNativeStackNavigator()

const HeaderRight = () => {
  const navigation = useNavigation()

  return (
    <ButtonTopBarNavigation onClick={() => navigation.navigate("Add Friends")}>
      <Ionicons name="person-add" size={25} color="#052D40" />
    </ButtonTopBarNavigation>
  )
}
const HeaderLeft = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <Text style={globalStyle.text.title}>Friends</Text>
    </View>
  )
}
const AddFriendsHeaderLeft = () => {
  const navigation = useNavigation()

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <ButtonTopBarNavigation onClick={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={32} color="black" />
      </ButtonTopBarNavigation>
      <Text style={globalStyle.text.title}>Add Friends</Text>
    </View>
  )
}

const options: NativeStackNavigationOptions = {
  headerRight: HeaderRight,
  headerLeft: HeaderLeft,
  headerTitleAlign: "left",
  title: "",
  headerTransparent: true
}
const AddFriendOptions: NativeStackNavigationOptions = {
  headerLeft: AddFriendsHeaderLeft,
  headerTitleAlign: "left",
  title: "",
  headerTransparent: true
}

const FriendsNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Friends2" component={PageFriends} options={options} />
      <Stack.Screen
        name="Add Friends"
        component={PageAddFriends}
        options={AddFriendOptions}
      />
    </Stack.Navigator>
  )
}

export default FriendsNav
