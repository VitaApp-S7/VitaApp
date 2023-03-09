import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import StartupMood from "../PopUps/StartupMood"
import { Text } from "react-native-paper"
import Modal from "react-native-modal"
import Ionicons from "@expo/vector-icons/Ionicons"
import TertiaryBtn from "../buttons/TertiaryBtn"
import React, { useContext, useState } from "react"
import { updateUserMood } from "../../services/userService"
import { AuthContext } from "../../context/AuthContext"

export interface ResponsiveHeader {
  name: string
  moodPoints: number
  scrollOffset?: number
}

const ResponsiveHeader = (props: ResponsiveHeader) => {
  const [ changeMood, setChangeMood ] = useState(0)
  const [ isModalVisible, setModalVisible ] = useState(false)
  const { accessToken } = useContext(AuthContext)

  const moodDown = () => {
    if (changeMood <= 0) {
      setChangeMood(0)
    } else {
      setChangeMood(changeMood - 1)
    }
  }
  const moodUp = () => {
    if (changeMood >= 20) {
      setChangeMood(20)
    } else {
      setChangeMood(changeMood + 1)
    }
  }
  const toggleModalOn = () => {
    setChangeMood(mood)
    setModalVisible(!isModalVisible)
  }
  const toggleModalOff = async () => {
    if (changeMood !== mood) {
      await updateUserMood(accessToken, changeMood)
      userMood()
      setModalVisible(!isModalVisible)
      console.log("Updated Mood!")
    } else {
      setModalVisible(!isModalVisible)
      console.log("Cancelled!")
    }
  }

  return (
    <View style={styles.screen}>
      <StartupMood changeMood={userMood} />
      <View style={styles.top}>
        <ImageBackground
          source={require("../../../assets/wave.png")}
          style={styles.wave}
        >
          <View style={styles.homeTop}>
            <Text style={styles.heading2}>{props.name}</Text>
            <ChangePic />
            <View style={styles.moodcontainer}>
              <TouchableOpacity onPress={toggleModalOn}>
                <Image
                  style={styles.moodbg}
                  source={require("../../../assets/moodbg2.png")}
                />
                <Text style={styles.moodnmbr}>{props.moodPoints}</Text>
              </TouchableOpacity>

              <Modal isVisible={isModalVisible} style={styles.modal}>
                <View style={styles.changeMoodModal}>
                  <Text style={styles.changeMoodTitle}>
                    Manually change mood
                  </Text>
                  <View style={styles.moodModalGroup}>
                    <TouchableOpacity onPress={moodDown}>
                      <Ionicons
                        style={styles.modalIcons}
                        name="remove-circle-outline"
                        size={40}
                        color="#052D40"
                      />
                    </TouchableOpacity>
                    <Text style={styles.moodnmbrModal}>{changeMood}</Text>
                    <TouchableOpacity onPress={moodUp}>
                      <Ionicons
                        style={styles.modalIcons}
                        name="add-circle-outline"
                        size={40}
                        color="#052D40"
                      />
                    </TouchableOpacity>
                  </View>
                  <TertiaryBtn text="DONE" onPress={toggleModalOff} />
                </View>
              </Modal>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  moodnmbr: {
    position: "absolute",
    fontSize: 32,
    fontFamily: "Poppins600SemiBold",
    color: "#FFFFFF",
    zIndex: 3,
    textAlign: "center",
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 45
  },
  moodnmbrModal: {
    fontSize: 32,
    fontFamily: "Poppins600SemiBold",
    zIndex: 3,
    textAlign: "center",
    color: "#052D40"
  },
  moodbg: {
    zIndex: 2,
    position: "relative",
    width: 70,
    resizeMode: "contain",
    marginTop: 8
  },
  top: { height: "40%" },
  wave: { height: "90%" },
  heading2: {
    fontSize: 20,
    marginTop: 18,
    marginBottom: 8,
    fontFamily: "Poppins600SemiBold",
    color: "#052D40"
  },
  homeTop: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16
  },
  changeMoodTitle: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 24,
    color: "#052D40"
  },
  changeMoodModal: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    width: "100%",
    height: "30%",
    borderRadius: 8,
    backgroundColor: "white"
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  moodModalGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "50%"
  },
  modalIcons: { paddingLeft: 4 },
  moodcontainer: {
    justifyContent: "center",
    alignItems: "center",
    // margin: 8,
    marginTop: -16,
    marginBottom: 86
  },
  screen: {
    flex: 1,
    backgroundColor: "white"
  }
})
export default ResponsiveHeader
