import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import PageAccount from "../screens/page-account/page-account";
import PageHome from "../screens/page-home/page-home";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import PageHistory from "../screens/page-history/page-history";
import PageMoodboosterDetails from "../screens/page-moodbooster-details/page-moodbooster-details";
import { useNavigation } from "@react-navigation/native";
import { ButtonTopBarNavigation } from "../components/buttons/ButtonTopBarNavigation";
import {
  MoodboosterType,
  UserMoodboosterType,
} from "../types/MoodboosterTypes";

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
    <ButtonTopBarNavigation onClick={() => navigation.navigate("Account")}>
      <Ionicons name="person-circle" size={32} color="#052D40" />
    </ButtonTopBarNavigation>
  )
}

const HeaderLeft = () => {
  const navigation = useNavigation<StackProps["navigation"]>()

  return (
    <ButtonTopBarNavigation onClick={() => navigation.navigate("History")}>
      <Ionicons name="time" size={32} color="#052D40" />
    </ButtonTopBarNavigation>
  )
}

const options: NativeStackNavigationOptions = {
  headerRight: HeaderRight,
  headerLeft: HeaderLeft,
  headerTitleAlign: "center"
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
      />
    </Stack.Navigator>
  )
}

export default BoostersNav
