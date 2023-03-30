import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import React, { useContext, useState } from "react"
import Toast from "react-native-toast-message"
import { useRoute } from "@react-navigation/native"
import ButtonPrimary from "../../components/buttons/ButtonPrimary"
import { UserMoodboosterType } from "../../types/MoodboosterTypes"
import ButtonSecondary from "../../components/buttons/ButtonSecondary"
import { AppContext } from "../../context/AppContext"
import { BoostersNavProps } from "../../navigation/BoostersNav"
import useMoodboosterMutations from "../../services/useMoodboosterMutations"
import InviteFriends from "../../components/MoodboosterInvites"

const PageMoodboosterDetails = () => {
  const route = useRoute<BoostersNavProps<"Moodbooster Details">["route"]>()
  const moodbooster = route.params?.mb
  const [ userMoodbooster, setUserMoodbooster ] =
    useState<UserMoodboosterType | null>(route.params?.userMb)
  const [ canStart, setCanStart ] = useState<boolean>(
    userMoodbooster ? false : true
  )

  const { moodPoints, setMoodPoints } = useContext(AppContext)
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

  const completedToast = () => {
    Toast.show({
      type: "success",
      text1: "Completed moodbooster!",
      text2: moodbooster.description
    })
  }
  const cancelledToast = () => {
    Toast.show({
      type: "error",
      text1: "Cancelled moodbooster!",
      text2: moodbooster.description
    })
  }

  const handleToStart = async () => {
    if (!canStart) {
      return
    }
    setCanStart(false)
    const userMb: UserMoodboosterType = await startMoodboosterMutation(
      moodbooster.id
    )
    setUserMoodbooster(userMb)
    updateUserMoodboostersQuery(userMb)
    removeMoodboosterFromAllMoodboosters(moodbooster.id)
  }
  const handleToComplete = async () => {
    if (!userMoodbooster || canStart) {
      return
    }
    setCanStart(true)
    await completeMoodboosterMutation(userMoodbooster.id)
    updateMoodboostersQuery(moodbooster)
    removeMoodboosterFromUserMoodboosterQuery(userMoodbooster.id)

    completedToast()
    setMoodPoints(moodPoints + moodbooster.points)
    setUserMoodbooster(null)
  }
  const handleToCancel = async () => {
    if (!userMoodbooster || canStart) {
      return
    }
    setCanStart(true)
    await cancelMoodboosterMutation(userMoodbooster.id)
    updateMoodboostersQuery(moodbooster)
    removeMoodboosterFromUserMoodboosterQuery(userMoodbooster.id)
    cancelledToast()
    setUserMoodbooster(null)
  }

  return (
    <ScrollView style={styles.screen}>
      <Image
        source={require("../../../assets/header.png")}
        style={styles.header}
      ></Image>
      <View style={styles.wrapper}>
        <View style={styles.wrapperTop}>
          <Text style={styles.title}>{moodbooster.title}</Text>
        </View>

        <Text style={styles.description}>{moodbooster.description}</Text>
        <View style={styles.buttons}>
          {userMoodbooster ? (
            <>
              <InviteFriends
                disabled={canStart}
                moodboosterId={userMoodbooster.id}
              />
              <ButtonSecondary
                text={"CANCEL"}
                disabled={canStart}
                onPress={() => handleToCancel()}
              ></ButtonSecondary>
              <ButtonPrimary
                text={"COMPLETE"}
                disabled={canStart}
                onPress={() => handleToComplete()}
              ></ButtonPrimary>
            </>
          ) : (
            <ButtonPrimary
              text={"START"}
              disabled={!canStart}
              onPress={() => handleToStart()}
            ></ButtonPrimary>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default PageMoodboosterDetails

const styles = StyleSheet.create({
  buttons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  header: {
    width: "100%",
    height: 200
  },
  wrapper: { margin: 16 },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    color: "#031D29"
  },
  description: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4
  },
  screen: {
    backgroundColor: "white",
    height: "100%"
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4
  }
})
