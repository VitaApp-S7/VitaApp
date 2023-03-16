import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import React, { useContext, useState } from "react"
import {
  cancelActivity,
  completeActivity,
  startActivity
} from "../../services/moodboosterService"
import Toast from "react-native-toast-message"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RouteParamList } from "../../types/RouteParamList"
import { AuthContext } from "../../context/AuthContext"
import PrimaryBtn from "../../components/buttons/PrimaryBtn"
import { MoodboosterStartedType } from "../../types/MoodboosterTypes"
import { MoodPointsContext } from "../../components/PopUps/MoodPointsContext"
import SecondaryBtn from "../../components/buttons/SecondaryBtn"

const PageMoodboosterDetails = () => {
  const item = useRoute<RouteProp<RouteParamList, "Moodbooster Details">>()
    .params.item as any

  const moodbooster: MoodboosterStartedType = item.moodbooster
    ? item
    : { moodbooster: item }

  const { moodPoints, setMoodPoints } = useContext(MoodPointsContext)
  const [ disabledState, setDisabledState ] = useState(false)
  const { accessToken } = useContext(AuthContext)

  const completedToast = () => {
    Toast.show({
      type: "success",
      text1: "Completed moodbooster!",
      text2: moodbooster.moodbooster.description
    })
  }
  const cancelledToast = () => {
    Toast.show({
      type: "error",
      text1: "Cancelled moodbooster!",
      text2: moodbooster.moodbooster.description
    })
  }

  const handleToStart = async () => {
    await startActivity(moodbooster.moodbooster.id, accessToken)
    setDisabledState(true)
  }
  const handleToComplete = async () => {
    await completeActivity(moodbooster.moodbooster.id, accessToken)
    setDisabledState(false)
    completedToast()
    setMoodPoints(moodPoints + moodbooster.moodbooster.points)
  }
  const handleToCancel = async () => {
    await cancelActivity(moodbooster.moodbooster.id, accessToken)
    cancelledToast()
    setDisabledState(false)
  }

  return (
    <ScrollView style={styles.screen}>
      <Image
        source={require("../../../assets/header.png")}
        style={styles.header}
      ></Image>
      <View style={styles.wrapper}>
        <View style={styles.wrapperTop}>
          <Text style={styles.title}>{moodbooster.moodbooster.title}</Text>
        </View>

        <Text style={styles.description}>
          {moodbooster.moodbooster.description}
        </Text>
        <View style={styles.buttons}>
          {moodbooster.id ? (
            <>
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
              disabled={disabledState}
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
