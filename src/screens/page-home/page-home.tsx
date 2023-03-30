import { View, StyleSheet, RefreshControl, ScrollView } from "react-native"
import React, { useState } from "react"
import { Text } from "react-native-paper"

import {
  useFonts,
  Poppins_500Medium as Poppins500Medium,
  Poppins_700Bold as Poppins700Bold,
  Poppins_600SemiBold as Poppins600SemiBold
} from "@expo-google-fonts/poppins"
import ChallengeFriends from "../../components/MoodboosterInviteRequests"
import ResponsiveHeader from "../../components/responsiveHeader"
import MoodboosterList from "../../components/MoodboosterList"

// eslint-disable-next-line no-unused-vars
const PageHome = () => {
  const [ refreshing, setRefreshing ] = useState(false)

  const [ fontsLoaded ] = useFonts({
    Poppins500Medium,
    Poppins700Bold,
    Poppins600SemiBold
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }
    >
      <ResponsiveHeader />
      <View style={styles.moodboostertop}>
        <Text style={styles.moodtitle}>Today&apos;s moodboosters</Text>
        <ChallengeFriends />
      </View>
      <MoodboosterList refresh={refreshing} setRefreshing={setRefreshing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  // styling here
  moodboostertop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 4,
    marginTop: -70
  },
  moodtitle: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 18,
    color: "#031D29"
  }
})

export default PageHome
