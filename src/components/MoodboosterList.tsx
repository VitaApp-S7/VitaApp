import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react"
import { View } from "react-native"

import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_500Medium as Poppins500Medium,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import ContentLoader, { Rect } from "react-content-loader/native"
import Moodbooster from "./Moodbooster"
import {
  useActivitiesActiveQuery,
  useActivitiesQuery
} from "../queries/MoodboosterQueries"

interface MoodboosterListProps {
  refresh: boolean;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
}

const MoodboosterList = (props: MoodboosterListProps) => {
  const moodboosters = useActivitiesQuery()
  const userMoodboosters = useActivitiesActiveQuery()

  const nonUserMoodboosters = useCallback(() => {
    return moodboosters.data
      ?.filter(
        (mb) =>
          !userMoodboosters.data?.find(
            (userMb) => userMb.moodbooster.id === mb.id
          )
      )
      .sort((mb, other) => mb.id.localeCompare(other.id))
  }, [ moodboosters.data, userMoodboosters.data ])

  useEffect(() => {
    if (props.refresh === true) {
      moodboosters.refetch()
      userMoodboosters.refetch()
      props.setRefreshing(false)
    }
  }, [ props.refresh ])

  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular,
    Poppins500Medium
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View>
      {moodboosters.isSuccess && userMoodboosters.isSuccess ? (
        <View>
          {userMoodboosters.data?.map((item) => (
            <Moodbooster mb={item.moodbooster} userMb={item} key={item.id} />
          ))}
          {nonUserMoodboosters()?.map((item) => (
            <Moodbooster mb={item} key={item.id} />
          ))}
        </View>
      ) : (
        <ContentLoader
          speed={2}
          width={400}
          height={460}
          viewBox="0 0 400 460"
          backgroundColor="#e6e6e6"
          foregroundColor="#d6d6d6"
        >
          <Rect x="10" y="0" rx="2" ry="2" width="350" height="100" />
          <Rect x="10" y="110" rx="2" ry="2" width="320" height="100" />
          <Rect x="10" y="220" rx="2" ry="2" width="340" height="100" />
        </ContentLoader>
      )}
    </View>
  )
}

export default MoodboosterList
