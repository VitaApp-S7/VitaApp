import { Image, StyleSheet, Text, View } from "react-native"
import React, { useState } from "react"
import { useRoute } from "@react-navigation/native"
import { UserMoodboosterType } from "../../types/MoodboosterTypes"
import { BoostersNavProps } from "../../navigation/BoostersNav"
import { UserMoodBoosterDetails } from "../../components/UserMoodBoosterDetails"
import { MoodBoosterDetails } from "../../components/MoodBoosterDetails"
import RichTextViewer from "../../components/RichTextViewer"

const PageMoodboosterDetails = () => {
  const route = useRoute<BoostersNavProps<"Moodbooster Details">["route"]>()
  const moodbooster = route.params?.mb
  const [ userMoodbooster, setUserMoodbooster ] =
    useState<UserMoodboosterType | null>(route.params?.userMb)

  return (
    <View style={styles.screen}>
      <Image
        source={require("../../../assets/header.png")}
        style={styles.header}
      ></Image>
      <View style={styles.wrapper}>
        <View style={styles.wrapperTop}>
          <Text style={styles.title}>{moodbooster.title}</Text>
        </View>

        <RichTextViewer
          html={moodbooster.description}
          queryKey={`mbhtml${moodbooster.id}`}
        />
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
      </View>
    </View>
  )
}

export default PageMoodboosterDetails

const styles = StyleSheet.create({
  header: { height: 200 },
  screen: {
    backgroundColor: "white",
    height: "100%"
  },
  wrapper: { margin: 16 },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    color: "#031D29"
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
