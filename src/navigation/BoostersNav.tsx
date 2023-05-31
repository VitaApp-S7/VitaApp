import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps
} from "@react-navigation/native-stack"
import PageAccount from "../screens/page-account/page-account"
import PageHome from "../screens/page-home/page-home"
import Ionicons from "react-native-vector-icons/Ionicons"
import React, { useContext } from "react"
import PageHistory from "../screens/page-history/page-history"
import PageMoodboosterDetails from "../screens/page-moodbooster-details/page-moodbooster-details"
import { useNavigation } from "@react-navigation/native"
import { ButtonTopBarNavigation } from "../components/ButtonTopBarNavigation"
import { MoodboosterType, UserMoodboosterType } from "../types/MoodboosterTypes"
import { AppContext } from "../context/AppContext"
import { View } from "react-native-animatable"
import { Text } from "react-native"
import { globalStyle } from "../globalStyle"

type BoostersNavStackParamList = {
  Home: undefined
  Account: undefined
  History: undefined
  "Moodbooster Details": { mb: MoodboosterType; userMb?: UserMoodboosterType }
}

const Stack = createNativeStackNavigator<BoostersNavStackParamList>()
type StackProps = NativeStackScreenProps<BoostersNavStackParamList>
export type BoostersNavProps<T extends keyof BoostersNavStackParamList> =
  NativeStackScreenProps<BoostersNavStackParamList, T>

const HeaderRight = () => {
  const navigation = useNavigation<StackProps["navigation"]>()

  return (
    <ButtonTopBarNavigation onClick={() => navigation.navigate("History")}>
      <Ionicons name="time" size={32} color="#052D40" />
    </ButtonTopBarNavigation>
  )
}

const HeaderLeft = () => {
  const navigation = useNavigation<StackProps["navigation"]>()
  const { user } = useContext(AppContext)

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <ButtonTopBarNavigation onClick={() => navigation.navigate("Account")}>
        <Ionicons name="person-circle" size={32} color="#052D40" />
      </ButtonTopBarNavigation>
      <Text style={globalStyle.text.title}>{user.name}</Text>
    </View>
  )
}

const options: NativeStackNavigationOptions = {
  headerRight: HeaderRight,
  headerLeft: HeaderLeft,
  headerTitleAlign: "center",
  headerTitle: "",
  headerTransparent: true
}

const BoostersNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={PageHome} options={options} />
      <Stack.Screen name="Account" component={PageAccount} />
      <Stack.Screen name="History" component={PageHistory} />
      <Stack.Screen
        name="Moodbooster Details"
        component={PageMoodboosterDetails}
        options={{ animation: "none" }}
      />
    </Stack.Navigator>
  )
}

export default BoostersNav
