import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import React, { useState } from "react"
import { useRoute } from "@react-navigation/native"
import { UserMoodboosterType } from "../../types/MoodboosterTypes"
import { BoostersNavProps } from "../../navigation/BoostersNav"
import { UserMoodBoosterDetails } from "../../components/UserMoodBoosterDetails"
import { MoodBoosterDetails } from "../../components/MoodBoosterDetails"

const PageMoodboosterDetails = () => {
  const route = useRoute<BoostersNavProps<"Moodbooster Details">["route"]>()
  const moodbooster = route.params?.mb
  const [ userMoodbooster, setUserMoodbooster ] =
    useState<UserMoodboosterType | null>(route.params?.userMb)

  return (
    <ScrollView style={styles.screen}>
      <Image
        source={require("../../../assets/header.png")}
        style={styles.header}
      ></Image>
      {userMoodbooster ? (
        <UserMoodBoosterDetails
          userMoodbooster={userMoodbooster}
          setUserMoodbooster={setUserMoodbooster}
        />
      ) : (
        <MoodBoosterDetails
          moodbooster={moodbooster}
          setUserMoodbooster={setUserMoodbooster}
        />
      )}
    </ScrollView>
  )
}

export default PageMoodboosterDetails

const styles = StyleSheet.create({
  header: { height: 200 },
  screen: {
    backgroundColor: "white",
    height: "100%"
  }
})
