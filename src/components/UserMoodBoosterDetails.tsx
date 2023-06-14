import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"
import { AppContext } from "../context/AppContext"
import {
  useMoodboosterCancelMutation,
  useMoodboosterCompleteChallengeMutation,
  useMoodboosterCompleteMutation
} from "../mutations/MoodboosterMutations"
import ButtonPrimary from "./ButtonPrimary"
import ButtonSecondary from "./ButtonSecondary"
import MoodboosterInvites from "./MoodboosterInvites"
import { useQueryClient } from "@tanstack/react-query"

export const UserMoodBoosterDetails = ({
  userMoodbooster,
  setUserMoodbooster,
  currentTeamId,
  challengeBoosterIds
}) => {
  const { moodPoints, setMoodPoints } = useContext(AppContext)

  const completeMoodboosterMutation = useMoodboosterCompleteMutation(
    userMoodbooster.id
  )
  const completeMoodboosterChallengeMutation =
    useMoodboosterCompleteChallengeMutation(userMoodbooster, currentTeamId)
  const cancelMoodboosterMutation = useMoodboosterCancelMutation(
    userMoodbooster.id
  )

  const queryClient = useQueryClient()

  const completedToast = () => {
    Toast.show({
      type: "success",
      text1: "Completed moodbooster!",
      text2: userMoodbooster.moodbooster.description
    })
  }
  const cancelledToast = () => {
    Toast.show({
      type: "error",
      text1: "Cancelled moodbooster!",
      text2: userMoodbooster.moodbooster.description
    })
  }

  const handleToComplete = async () => {
    if (!completeMoodboosterMutation.isIdle) return

    await completeMoodboosterMutation.mutateAsync()
    if (
      challengeBoosterIds.some((id) => id === userMoodbooster.moodbooster.id)
    ) {
      await completeMoodboosterChallengeMutation.mutateAsync()
      await queryClient.invalidateQueries({ queryKey: [ "teams" ]})
    }
    completedToast()
    setUserMoodbooster(null)
    setMoodPoints(moodPoints + userMoodbooster.moodbooster.points)
  }
  const handleToCancel = async () => {
    if (!cancelMoodboosterMutation.isIdle) return

    await cancelMoodboosterMutation.mutateAsync()
    cancelledToast()
    setUserMoodbooster(null)
  }

  return (
    <View style={styles.buttons}>
      <MoodboosterInvites
        disabled={
          !cancelMoodboosterMutation.isIdle ||
          !completeMoodboosterMutation.isIdle
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
    </View>
  )
}

const styles = StyleSheet.create({
  buttons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  }
})
