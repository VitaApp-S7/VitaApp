import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import React, { useContext, useState } from "react"
import Toast from "react-native-toast-message"
import { useRoute } from "@react-navigation/native"
import PrimaryBtn from "../../components/buttons/PrimaryBtn"
import { UserMoodboosterType } from "../../types/MoodboosterTypes"
import SecondaryBtn from "../../components/buttons/SecondaryBtn"
import { AppContext } from "../../context/AppContext"
import { BoostersNavProps } from "../../navigation/BoostersNav"
import useMoodboosterMutations from "../../services/useMoodboosterMutations"
import InviteFriends from "../../components/challengeFriends/inviteFriends"

const PageMoodboosterDetails = () => {
  const route = useRoute<BoostersNavProps<"Moodbooster Details">["route"]>()
  const moodbooster = route.params?.mb
  const [ userMoodbooster, setUserMoodbooster ] =
    useState<UserMoodboosterType | null>(route.params?.userMb)

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
    const userMb: UserMoodboosterType = await startMoodboosterMutation(
      moodbooster.id
    )
    setUserMoodbooster(userMb)
    updateUserMoodboostersQuery(userMb)
    removeMoodboosterFromAllMoodboosters(moodbooster.id)
  }
  const handleToComplete = async () => {
    if (!userMoodbooster) {
      return
    }
    await completeMoodboosterMutation(userMoodbooster.id)
    updateMoodboostersQuery(moodbooster)
    removeMoodboosterFromUserMoodboosterQuery(userMoodbooster.id)

    completedToast()
    setMoodPoints(moodPoints + moodbooster.points)
    setUserMoodbooster(null)
  }
  const handleToCancel = async () => {
    if (!userMoodbooster) {
      return
    }
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
                disabled={false}
                moodboosterId={userMoodbooster.id}
              />
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
          ) : (
            <PrimaryBtn
              text={"START"}
              disabled={!!userMoodbooster}
              onPress={() => handleToStart()}
            ></PrimaryBtn>
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
