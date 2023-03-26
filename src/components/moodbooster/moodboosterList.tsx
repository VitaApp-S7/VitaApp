import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from "react"
import { View, StyleSheet } from "react-native"
import {
  getAllActivities,
  getAllActiveActivities
} from "../../services/moodboosterService"

import {
  useFonts,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_400Regular as Poppins400Regular,
  Poppins_500Medium as Poppins500Medium
} from "@expo-google-fonts/poppins"
import ContentLoader, { Rect } from "react-content-loader/native"
import {
  UserMoodboosterType,
  MoodboosterType
} from "../../types/MoodboosterTypes"
import { AppContext } from "../../context/AppContext"
import Moodbooster from "./moodbooster"
interface MoodboosterList {
  refresh: boolean
  setRefreshing: Dispatch<SetStateAction<boolean>>
}

const MoodboosterList = (props: MoodboosterList) => {
  const [ moodboosterList, setMoodboosterList ] = useState<MoodboosterType[]>()
  const [ userMoodboosterList, setUserMoodboosterList ] =
    useState<UserMoodboosterType[]>()
  const { accessToken } = useContext(AppContext)

  //TOAST AFTER COMPLETE
  const handleActivities = async () => {
    const userMoodboosters = await getAllActiveActivities(accessToken)
    const moodboosters = await getAllActivities(accessToken)

    setMoodboosterList(moodboosters)
    setUserMoodboosterList(userMoodboosters)
  }

  useEffect(() => {
    handleActivities()
  }, [])

  useEffect(() => {
    if (props.refresh === true) {
      handleActivities()
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
      {moodboosterList ? (
        <View>
          {userMoodboosterList?.map((item) => (
            <Moodbooster mb={item} key={item.id} />
          ))}
          {moodboosterList?.map((item) => (
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
