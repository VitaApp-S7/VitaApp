import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React from "react"
import PageChallenges from "../screens/page-challenges/page-challenges"
import { ChallengeType } from "../types/ChallengeType"
import PageLeaderboard from "../screens/page-leaderboard/page-leaderboard"
import PageChallengeOverview from "../screens/page-challenge-overview/page-challenge-overview"

type ChallengesNavStackParamList = {
  ChallengeScreen: undefined;
  "Challenge overview": { challenge: ChallengeType };
  Leaderboard: { challenge: ChallengeType };
};

const Stack = createNativeStackNavigator<ChallengesNavStackParamList>()
export type ChallengeStackProps = NativeStackScreenProps<ChallengesNavStackParamList>;
export type BoostersNavProps<T extends keyof ChallengesNavStackParamList> =
  NativeStackScreenProps<ChallengesNavStackParamList, T>;

export const ChallengesNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChallengeScreen"
        component={PageChallenges}
        options={{
          title: "Challenges",
          headerTransparent: true,
          headerTitleStyle: { fontFamily: "Poppins600SemiBold" }
        }}
      />
      <Stack.Screen
        name="Challenge overview"
        component={PageChallengeOverview}
        options={{
          headerTransparent: true,
          headerTitleStyle: { fontFamily: "Poppins600SemiBold" }
        }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={PageLeaderboard}
        options={{
          headerTransparent: true,
          headerTitleStyle: { fontFamily: "Poppins600SemiBold" }
        }}
      />
    </Stack.Navigator>
  )
}
