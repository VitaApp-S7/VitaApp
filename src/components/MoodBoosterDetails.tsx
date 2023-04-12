import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { useMoodboosterStartMutation } from "../mutations/MoodboosterMutations"
import ButtonPrimary from "./ButtonPrimary"
import RichTextViewer from "./RichTextViewer"
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
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  }
})
