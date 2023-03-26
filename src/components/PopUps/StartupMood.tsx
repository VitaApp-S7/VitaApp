import React, { useState, useEffect, useContext } from "react"
import { Alert, Modal, StyleSheet, Text, View, Pressable } from "react-native"
// import { useMoodPoints, useMoodPointsUpdate } from "./MoodPointsContext"
import {
  useFonts,
  Poppins_500Medium as Poppins500Medium,
  Poppins_700Bold as Poppins700Bold,
  Poppins_600SemiBold as Poppins600SemiBold
} from "@expo-google-fonts/poppins"
import { updateUserMood } from "../../services/userService"

import { SetModalVisable, SetDate, GetDate } from "../../services/userService"
import Frowney from "../../../assets/modalFrowney.svg"
import Neutral from "../../../assets/modalNeutral.svg"
import Happy from "../../../assets/modalHappy.svg"
import { AppContext } from "../../context/AppContext"

const StartupMood = ({ changeMood }) => {
  const [ modalVisible, setModalVisible ] = useState(false)
  // const mood = useMoodPoints()
  // const updateMood = useMoodPointsUpdate()
  
  const { setMoodPoints, accessToken } = useContext(AppContext)

  const date = new Date()

  useEffect(() => {
    GetDate(accessToken).then((databaseDate) => {
      if (databaseDate.toString() !== date.toDateString()) {
        setModalVisible(true)
      }
    })
  }, [])

  const updateMoodPopUp = async points => {
    setModalVisible(false)
    await SetModalVisable(accessToken, false)
    await updateUserMood(accessToken, points)
    await SetDate(accessToken, new Date().toDateString())
    setMoodPoints(points)
  }

  const [ fontsLoaded ] = useFonts({
    Poppins500Medium,
    Poppins700Bold,
    Poppins600SemiBold
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.")
        setModalVisible(!modalVisible)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>How are we feeling today?</Text>
          <View style={{ flexDirection: "row" }}>
            <Pressable style={styles.btn} onPress={async () => await updateMoodPopUp(1)}>
              {/* <Image source={require("../../../assets/modal_frowney.svg")} style={styles.emoji}/> */}
              <Frowney />
            </Pressable>
            <Pressable style={styles.btn} onPress={async () => await updateMoodPopUp(5)}>
              {/* <Image source={require("../../../assets/modal_neutral.svg")} style={styles.emoji}/> */}
              <Neutral />
            </Pressable>
            <Pressable style={styles.btn} onPress={async () => await updateMoodPopUp(10)}>
              {/* <Image source={require("../../../assets/modal_happy.svg")} style={styles.emoji}/> */}
              <Happy />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC"
  },
  btn: {
    margin: 16,
    justifyContent: "space-between",
    height: 48,
    width: 48,
    paddingBottom: 32
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    color: "#031D29",
    fontFamily: "Poppins700Bold"
  }
})

export default StartupMood
