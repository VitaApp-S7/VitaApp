import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { useMoodboosterStartMutation } from "../mutations/MoodboosterMutations"
import ButtonPrimary from "./ButtonPrimary"
export const MoodBoosterDetails = ({ moodbooster, setUserMoodbooster }) => {
  const startMutation = useMoodboosterStartMutation(moodbooster.id)

  const handleToStart = async () => {
    if (!startMutation.isIdle) return
    setUserMoodbooster(await startMutation.mutateAsync())
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.wrapperTop}>
        <Text style={styles.title}>{moodbooster.title}</Text>
      </View>

      <Text style={styles.description}>{moodbooster.description}</Text>
      <View style={styles.buttons}>
        <ButtonPrimary
          text={"START"}
          disabled={!startMutation.isIdle}
          onPress={() => handleToStart()}
        ></ButtonPrimary>
      </View>
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
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4
  }
})
