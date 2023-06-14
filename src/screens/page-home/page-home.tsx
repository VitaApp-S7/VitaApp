import {
  LayoutAnimation,
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  UIManager,
  View
} from "react-native"
import React, { useMemo, useState } from "react"
import { Text } from "react-native-paper"
import ChallengeFriends from "../../components/MoodboosterInviteRequests"
import ResponsiveHeader from "../../components/ResponsiveHeader"
import { useQueryClient } from "@tanstack/react-query"
import { useAllActivitiesQuery } from "../../queries/MoodboosterQueries"
import UserMoodbooster from "../../components/UserMoodbooster"
import Moodbooster from "../../components/Moodbooster"
import BackgroundShape from "../../components/backgroundShape"
import { globalStyle } from "../../globalStyle"
import MoodBoosterFilters from "../../components/MoodBoosterFilters"
import {
  MoodboosterType,
  UserMoodboosterType
} from "../../types/MoodboosterTypes"
import { useActiveChallengeQuery } from "../../queries/ChallengeQueries"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
const UserMbOrMb = ({ item, section }) => {
  if (section.key === "active") {
    return <UserMoodbooster userMb={item} key={`um${item.id}`} />
  }
  return <Moodbooster mb={item} key={`num${item.id}`} />
}

const PageHome = () => {
  const [ refreshing, setRefreshing ] = useState(false)
  const { sectionList } = useAllActivitiesQuery()
  const [ categoryFilter, setCategoryFilter ] = useState<null | string>(null)
  const activeChallenge = useActiveChallengeQuery()

  const queryClient = useQueryClient()

  const filteredList = useMemo(() => {
    if (categoryFilter === null) {
      return sectionList
    }
    if (Platform.OS !== "android")
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    return sectionList.map((booster) => {
      let filteredData = null
      if (booster.key === "active") {
        const usermb = booster.data as UserMoodboosterType[]
        filteredData = usermb.filter(
          (mb) => mb.moodbooster.category.id === categoryFilter
        )
      } else {
        const mb = booster.data as MoodboosterType[]
        filteredData = mb.filter((mb) => mb.category.id === categoryFilter)
      }
      return {
        ...booster,
        data: filteredData
      }
    })
  }, [ sectionList, categoryFilter, activeChallenge ])

  const Header = useMemo(
    () => (
      <View>
        <BackgroundShape />
        <View style={{ marginTop: 80 }}>
          <ResponsiveHeader />
        </View>
        <View style={styles.moodboostertop}>
          <Text style={globalStyle.text.title}>Moodboosters</Text>
          <ChallengeFriends />
        </View>
        <MoodBoosterFilters setFilter={setCategoryFilter} />
      </View>
    ),
    []
  )

  return (
    <View>
      <SectionList
        sections={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={UserMbOrMb}
        overScrollMode={"never"}
        ListHeaderComponent={Header}
        refreshControl={
          <RefreshControl
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
  }
})

export default PageHome
