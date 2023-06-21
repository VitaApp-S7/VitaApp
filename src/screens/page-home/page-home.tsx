import {
  LayoutAnimation,
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  UIManager,
  View
} from "react-native"
import React, { useContext, useEffect, useMemo, useState } from "react"
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
import { useTeamsQuery } from "../../queries/TeamQueries"
import { AppContext } from "../../context/AppContext"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const PageHome = () => {
  const { user } = useContext(AppContext)
  const [ refreshing, setRefreshing ] = useState(false)
  const { sectionList } = useAllActivitiesQuery()
  const [ categoryFilter, setCategoryFilter ] = useState<null | string>(null)
  const activeChallenge = useActiveChallengeQuery()
  const [ currentTeamId, setCurrentTeamId ] = useState(null)
  const { teamQuery } = useTeamsQuery(activeChallenge.data?.id, { enabled: !!activeChallenge.data?.id })

  useEffect(() => {
    if (teamQuery.isSuccess) {
      console.log("useTeamsQuery")
      const teams = teamQuery.data.filter((t) =>
        t.participants.some((p) => p.userId === user?.id)
      )
      if (teams.length > 0) {
        setCurrentTeamId(teams[0].id)
      }
    }
  }, [ teamQuery.data ])

  const queryClient = useQueryClient()

  const UserMbOrMb = ({ item, section }) => {
    if (section.key === "active") {
      return (
        <UserMoodbooster
          userMb={item}
          key={`um${item.id}`}
          challengeBoosterIds={activeChallenge.data?.moodboosterIds}
          currentTeamId={currentTeamId}
        />
      )
    }
    return (
      <Moodbooster
        mb={item}
        key={`num${item.id}`}
        challengeBoosterIds={activeChallenge.data?.moodboosterIds}
      />
    )
  }
  const filteredList = useMemo(() => {
    if (categoryFilter === null) {
      return sectionList
    }

    if (Platform.OS !== "android") {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }

    return sectionList.map((booster) => {
      let filteredData

      if (booster.key === "active") {
        // userMoodboosters
        const userMoodboosters = booster.data as UserMoodboosterType[]

        if (categoryFilter === "challenge") {
          filteredData = userMoodboosters.filter((moodbooster) =>
            activeChallenge.data.moodboosterIds.includes(
              moodbooster.moodbooster.id
            )
          )
        } else {
          filteredData = userMoodboosters.filter(
            (moodbooster) =>
              moodbooster.moodbooster.category.id === categoryFilter
          )
        }
      } else {
        // normal moodboosters
        const moodboosters = booster.data as MoodboosterType[]

        if (categoryFilter === "challenge") {
          filteredData = moodboosters.filter((moodbooster) =>
            activeChallenge.data.moodboosterIds.includes(moodbooster.id)
          )
        } else {
          filteredData = moodboosters.filter(
            (moodbooster) => moodbooster.category.id === categoryFilter
          )
        }
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
          <View style={{ marginTop: -10 }}>
            <ChallengeFriends />
          </View>
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
    marginBottom: 15,
    marginTop: -70
  }
})

export default PageHome
