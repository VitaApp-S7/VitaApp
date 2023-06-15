import React from "react"
import { View, StyleSheet } from "react-native"
import { useMoodboosterStartMutation } from "../mutations/MoodboosterMutations"
import ButtonPrimary from "./ButtonPrimary"
export const MoodBoosterDetails = ({ moodbooster, setUserMoodbooster }) => {
  const startMutation = useMoodboosterStartMutation(moodbooster.id)

  const handleToStart = async () => {
    if (!startMutation.isIdle) return
    setUserMoodbooster(await startMutation.mutateAsync())
  }

  return (
    <View style={styles.buttons}>
      <ButtonPrimary
        text={"START"}
        disabled={!startMutation.isIdle}
        onPress={() => handleToStart()}
      ></ButtonPrimary>
    </View>
  )
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  }
})
