import {
  View,
  StyleSheet,
  Image,
  RefreshControl,
  ScrollView
} from "react-native"
import React, { useState, useEffect, useContext } from "react"
import { Text } from "react-native-paper"
import Moodbooster from "../../components/moodbooster/moodbooster"

import {
  useFonts,
  Poppins_500Medium as Poppins500Medium,
  Poppins_700Bold as Poppins700Bold,
  Poppins_600SemiBold as Poppins600SemiBold
} from "@expo-google-fonts/poppins"
import { getUser, updateUserMood } from "../../services/userService"
import { AuthContext } from "../../context/AuthContext"
import ChallengeFriends from "../../components/challengeFriends/challengeFriends"
import { MoodboosterContext } from "./moodboosterContext"
import * as SecureStore from "expo-secure-store"
import ResponsiveHeader from "../../components/responsiveHeader/responsiveHeader"

// eslint-disable-next-line no-unused-vars
const PageHome = ({ navigation }) => {
  const [ name, setName ] = useState("")
  const [ requestData, setRequestData ] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-var-requires

  const [ mood, setMood ] = useState(10)
  const [ refreshing, setRefreshing ] = useState(false)
  const [ refreshAction, setRefreshAction ] = useState(() => null)
  const { accessToken } = useContext(AuthContext)

  const userMood = async () => {
    const userData = await getUser(accessToken)
    const currentUser = JSON.parse(await SecureStore.getItemAsync("User"))
    setName(currentUser.name)
    setMood(userData.mood)
    console.log("userrrrrr", userData, currentUser)
  }

  useEffect(() => {
    userMood()
    console.log(mood)
  }, [])

  const [ fontsLoaded ] = useFonts({
    Poppins500Medium,
    Poppins700Bold,
    Poppins600SemiBold
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <MoodboosterContext.Provider
      value={{
        requestData,
        setRequestData
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshAction}
          />
        }
      >
        <ResponsiveHeader userMood={() => userMood} moodPoints={mood} />
        <View style={styles.moodboostertop}>
          <Text style={styles.moodtitle}>Today&apos;s moodboosters</Text>
          <ChallengeFriends />
        </View>
        <Moodbooster refreshAction={setRefreshAction} changeMood={userMood} />
      </ScrollView>
    </MoodboosterContext.Provider>
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
