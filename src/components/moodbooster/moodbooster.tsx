import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import {
  startActivity,
  cancelActivity,
  completeActivity
} from "../../services/moodboosterService"

import { Card, Paragraph } from "react-native-paper"
import {
  useFonts,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_400Regular as Poppins400Regular,
  Poppins_500Medium as Poppins500Medium
} from "@expo-google-fonts/poppins"
import Toast from "react-native-toast-message"
import PrimaryBtn from "../buttons/PrimaryBtn"
import SecondaryBtn from "../buttons/SecondaryBtn"
import InviteFriends from "../../components/challengeFriends/inviteFriends"
import {
  UserMoodboosterType,
  MoodboosterType,
  MoodboosterTypeToStarted
} from "../../types/MoodboosterTypes"
import { useNavigation } from "@react-navigation/native"
import { AppContext } from "../../context/AppContext"
interface Moodbooster {
  mb: UserMoodboosterType | MoodboosterType
}

const Moodbooster = (props: Moodbooster) => {
  const [ data, setData ] = useState<UserMoodboosterType>()
  const [ canStart, setCanStart ] = useState(true)
  const { moodPoints, setMoodPoints, accessToken } = useContext(AppContext)
  const navigation = useNavigation()

  useEffect(() => {
    if (Object.keys(props.mb).includes("moodbooster")) {
      setData(props.mb as UserMoodboosterType)
      setCanStart(false)
    } else {
      setData(MoodboosterTypeToStarted(props.mb as MoodboosterType))
      setCanStart(true)
    }
  }, [])

  //TOAST AFTER COMPLETE
  const completedToast = () => {
    Toast.show({
      type: "success",
      text1: "Completed moodbooster!",
      text2: "dfs"
    })
  }
  const cancelledToast = () => {
    Toast.show({
      type: "error",
      text1: "Cancelled moodbooster!",
      text2: data.moodbooster.description
    })
  }

  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular,
    Poppins500Medium
  })

  if (!fontsLoaded) {
    return null
  }

  const handleToStart = async () => {
    const userMoodbooster: UserMoodboosterType = await startActivity(
      data.moodbooster.id,
      accessToken
    )
    setData(userMoodbooster)
    setCanStart(false)
  }
  const handleToComplete = async () => {
    await completeActivity(data.id, accessToken)
    setCanStart(false)
    completedToast()
    setMoodPoints(moodPoints + data.moodbooster.points)
  }
  const handleToCancel = async () => {
    await cancelActivity(data.id, accessToken)
    cancelledToast()
    setCanStart(true)
  }

  const handleOnPress = () => {
    navigation.navigate("Moodbooster Details", { data })
  }

  return (
    <View>
      <Card
        style={styles.surface}
        mode="outlined"
        theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
        key={data.moodbooster.id}
        onPress={() => handleOnPress()}
      >
        <Card.Content>
          <Paragraph style={styles.description}>
            {data.moodbooster.description}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.buttons}>
          {canStart ? (
            <PrimaryBtn
              text={"START"}
              disabled={!canStart}
              onPress={() => handleToStart()}
            ></PrimaryBtn>
          ) : (
            <>
              <InviteFriends disabled={false} moodboosterId={data.id} />
              <SecondaryBtn
                text={"CANCEL"}
                onPress={() => handleToCancel()}
              ></SecondaryBtn>
              <PrimaryBtn
                text={"COMPLETE"}
                disabled={false}
                onPress={() => handleToComplete()}
              ></PrimaryBtn>
            </>
          )}
        </Card.Actions>
      </Card>
    </View>
  )
}
const styles = StyleSheet.create({
  buttons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  description: {
    fontFamily: "Poppins500Medium",
    fontSize: 16,
    color: "#031D29"
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    fontFamily: "Poppins600SemiBold",
    backgroundColor: "#FFFFFF"
  }
})

export default Moodbooster
