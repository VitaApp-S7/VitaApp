import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_500Medium as Poppins500Medium,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import Toast from "react-native-toast-message";
import ButtonPrimary from "./buttons/ButtonPrimary";
import ButtonSecondary from "./buttons/ButtonSecondary";
import InviteFriends from "./MoodboosterInvites";
import {
  MoodboosterType,
  UserMoodboosterType,
} from "../types/MoodboosterTypes";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import useMoodboosterMutations from "../services/useMoodboosterMutations";

interface Moodbooster {
  mb: MoodboosterType
  userMb?: UserMoodboosterType
}

const Moodbooster = (props: Moodbooster) => {
  const { moodPoints, setMoodPoints } = useContext(AppContext)
  const [ canStart, setCanStart ] = useState<boolean>(props.userMb ? false : true)
  const navigation = useNavigation()
  const {
    moodbooster: {
      startMoodboosterMutation,
      updateMoodboostersQuery,
      removeMoodboosterFromAllMoodboosters,
      updateUserMoodboostersQuery,
      completeMoodboosterMutation,
      removeMoodboosterFromUserMoodboosterQuery,
      cancelMoodboosterMutation
    }
  } = useMoodboosterMutations()

  //TOAST AFTER COMPLETE
  const completedToast = () => {
    Toast.show({
      type: "success",
      text1: "Completed moodbooster!",
      text2: props.mb.description
    })
  }
  const cancelledToast = () => {
    Toast.show({
      type: "error",
      text1: "Cancelled moodbooster!",
      text2: props.mb.description
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
    if (props.userMb || !canStart) {
      return
    }
    setCanStart(false)
    const userMoodbooster: UserMoodboosterType = await startMoodboosterMutation(
      props.mb.id
    )
    updateUserMoodboostersQuery(userMoodbooster)
    removeMoodboosterFromAllMoodboosters(props.mb.id)
  }
  const handleToComplete = async () => {
    if (!props.userMb || canStart) {
      return
    }
    setCanStart(true)
    await completeMoodboosterMutation(props.userMb.id)
    updateMoodboostersQuery(props.mb)
    removeMoodboosterFromUserMoodboosterQuery(props.userMb.id)

    completedToast()
    setMoodPoints(moodPoints + props.mb.points)
  }
  const handleToCancel = async () => {
    if (!props.userMb || canStart) {
      return
    }
    setCanStart(true)
    await cancelMoodboosterMutation(props.userMb.id)
    updateMoodboostersQuery(props.mb)
    removeMoodboosterFromUserMoodboosterQuery(props.userMb.id)
    cancelledToast()
  }

  const handleOnPress = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigation.navigate("Moodbooster Details", {
      mb: props.mb,
      userMb: props.userMb
    })
  }

  return (
    <View>
      <Card
        style={styles.surface}
        mode="outlined"
        theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
        key={props.mb.id}
        onPress={() => handleOnPress()}
      >
        <Card.Content>
          <Paragraph style={styles.title}>{props.mb.title}</Paragraph>
          <Paragraph style={styles.catagory}>
            {props.mb.category.name}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.buttons}>
          {!props.userMb ? (
            <ButtonPrimary
              text={"START"}
              onPress={() => handleToStart()}
            ></ButtonPrimary>
          ) : (
            <>
              <InviteFriends moodboosterId={props.userMb.id} />
              <ButtonSecondary
                text={"CANCEL"}
                onPress={() => handleToCancel()}
              ></ButtonSecondary>
              <ButtonPrimary
                text={"COMPLETE"}
                onPress={() => handleToComplete()}
              ></ButtonPrimary>
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
  catagory: {
    fontFamily: "Poppins500Medium",
    fontSize: 16,
    color: "#031D29"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    lineHeight: 24,
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
