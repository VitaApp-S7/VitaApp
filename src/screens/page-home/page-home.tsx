import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Text } from "react-native-paper"

import {
  Poppins_500Medium as Poppins500Medium,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_700Bold as Poppins700Bold,
  useFonts
} from "@expo-google-fonts/poppins"
import ChallengeFriends from "../../components/MoodboosterInviteRequests"
import ResponsiveHeader from "../../components/ResponsiveHeader"
import MoodboosterList from "../../components/MoodboosterList"
import { useQueryClient } from "@tanstack/react-query"

// eslint-disable-next-line no-unused-vars
const PageHome = () => {
  const [ refreshing, setRefreshing ] = useState(false)
  const queryClient = useQueryClient()

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
          onRefresh={async () => {
            setRefreshing(true)
            await queryClient.invalidateQueries([ "moodboosterRequests" ])
            setRefreshing(false)
          }}
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
