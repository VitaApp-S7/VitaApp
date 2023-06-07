import { RefreshControl, SectionList, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Text } from "react-native-paper"

import {
  Poppins_500Medium as Poppins500Medium,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_700Bold as Poppins700Bold,
  useFonts
} from "@expo-google-fonts/poppins"
import ChallengeFriends from "../../components/MoodboosterInviteRequests"
import ResponsiveHeader from "../../components/ResponsiveHeader"
import { useQueryClient } from "@tanstack/react-query"
import { useAllActivitiesQuery } from "../../queries/MoodboosterQueries"
import UserMoodbooster from "../../components/UserMoodbooster"
import Moodbooster from "../../components/Moodbooster"
import BackgroundShape from "../../components/backgroundShape"
import { globalStyle } from "../../globalStyle"
import GradientRefreshControl from "../../components/gradientRefreshControl"

const UserMbOrMb = ({ item, section }) => {
  if (section.key === "active") {
    return <UserMoodbooster userMb={item} key={`um${item.id}`} />
  }
  return <Moodbooster mb={item} key={`num${item.id}`} />
}

const PageHome = () => {
  const [ refreshing, setRefreshing ] = useState(false)
  const { sectionList } = useAllActivitiesQuery()
  
  const queryClient = useQueryClient()

  useFonts({
    Poppins500Medium,
    Poppins700Bold,
    Poppins600SemiBold
  })

  return (
    <View>
      <SectionList
        overScrollMode={"never"}
        sections={sectionList}
        keyExtractor={(item) => item.id}
        renderItem={UserMbOrMb}
        renderSectionHeader={(props) => {
          if (props.section.key !== "active") return <></>
          return (
            <View>
              <BackgroundShape />
              <View style={{ marginTop: 80 }}>
                <ResponsiveHeader />
              </View>
              <View style={styles.moodboostertop}>
                <Text style={styles.moodtitle} onPress={async () => {
            
              await queryClient.invalidateQueries([ "moodboosters" ])
              await queryClient.invalidateQueries([ "moodboosterRequests" ])
              await queryClient.invalidateQueries([ "moodboostersActive" ])
              console.log("refetching moodboosters")
            }}>Today&apos;s moodboosters</Text>
                <ChallengeFriends />
              </View>
            </View>
          )
        }}
        refreshControl={
          <GradientRefreshControl
          style={{zIndex:1}}
            refreshing={refreshing} 
            onRefresh={async () => {
              setRefreshing(true)
              await queryClient.invalidateQueries([ "moodboosters" ])
              await queryClient.invalidateQueries([ "moodboosterRequests" ])
              await queryClient.invalidateQueries([ "moodboostersActive" ])
              setRefreshing(false)
            }}
          />
        }
      />
    </View>
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
  },
  wave: {
    height: 300,
    width: 300
  }
})

export default PageHome
