import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import React, { useContext, useState } from "react"
import Toast from "react-native-toast-message"
import { useRoute } from "@react-navigation/native"
import ButtonPrimary from "../../components/ButtonPrimary"
import { UserMoodboosterType } from "../../types/MoodboosterTypes"
import ButtonSecondary from "../../components/ButtonSecondary"
import { AppContext } from "../../context/AppContext"
import { BoostersNavProps } from "../../navigation/BoostersNav"
import InviteFriends from "../../components/MoodboosterInvites"
import {
  useMoodboosterCancelMutation,
  useMoodboosterCompleteMutation,
  useMoodboosterStartMutation
} from "../../mutations/MoodboosterMutations"

const PageMoodboosterDetails = () => {
  const route = useRoute<BoostersNavProps<"Moodbooster Details">["route"]>()
  const moodbooster = route.params?.mb
  const [ userMoodbooster, setUserMoodbooster ] =
    useState<UserMoodboosterType | null>(route.params?.userMb)

  const { moodPoints, setMoodPoints } = useContext(AppContext)

  const completeMoodboosterMutation = useMoodboosterCompleteMutation(
    userMoodbooster.id
  )
  const cancelMoodboosterMutation = useMoodboosterCancelMutation(
    userMoodbooster.id
  )
  const startMutation = useMoodboosterStartMutation(moodbooster.id)

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
    if (!startMutation.isIdle) return

    setUserMoodbooster(await startMutation.mutateAsync())
  }
  const handleToComplete = async () => {
    if (!completeMoodboosterMutation.isIdle) return

    await completeMoodboosterMutation.mutateAsync()
    completedToast()
    setUserMoodbooster(null)
    setMoodPoints(moodPoints + moodbooster.points)
  }
  const handleToCancel = async () => {
    if (!cancelMoodboosterMutation.isIdle) return

    await cancelMoodboosterMutation.mutateAsync()
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
                disabled={
                  !cancelMoodboosterMutation.isIdle ||
                  !completeMoodboosterMutation.isIdle ||
                  !startMutation.isIdle
                }
                moodboosterId={userMoodbooster.id}
              />
              <ButtonSecondary
                text={"CANCEL"}
                disabled={!cancelMoodboosterMutation.isIdle}
                onPress={() => handleToCancel()}
              ></ButtonSecondary>
              <ButtonPrimary
                text={"COMPLETE"}
                disabled={!completeMoodboosterMutation.isIdle}
                onPress={() => handleToComplete()}
              ></ButtonPrimary>
            </>
          ) : (
            <ButtonPrimary
              text={"START"}
              disabled={!startMutation.isIdle}
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
