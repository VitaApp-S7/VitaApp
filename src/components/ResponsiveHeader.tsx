import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import StartupMoodModal from "./StartupMoodModal"
import Modal from "react-native-modal"
import { Text } from "react-native-paper"
import Ionicons from "@expo/vector-icons/Ionicons"
import ButtonTertiary from "./ButtonTertiary"
import React, { useContext, useState } from "react"
import { updateUserMood } from "../services/userService"
import { AppContext } from "../context/AppContext"

interface ChangePicProps {
  moodPoints: number
}

const ChangePic = ({ moodPoints }: ChangePicProps) => {
  const limitOfHappiness = 7
  const limitOfSadness = 4

  let source
  if (moodPoints > limitOfHappiness) {
    source = require("../../assets/Hairy.png")
  }
  if (moodPoints <= limitOfHappiness && moodPoints >= limitOfSadness) {
    source = require("../../assets/Hairy.png")
  }
  if (moodPoints < limitOfSadness) {
    source = require("../../assets/Hairy.png")
  }

  return (
    <Image
      source={source}
      style={{
        width: 300,
        height: undefined,
        aspectRatio: 1,
        resizeMode: "contain"
      }}
    />
  )
}

const ResponsiveHeader = () => {
  const [ isModalVisible, setModalVisible ] = useState<boolean>(false)
  const { accessToken, moodPoints, setMoodPoints } = useContext(AppContext)
  const UpdateUserMood = async () => {
    await updateUserMood(accessToken, moodPoints)
    setModalVisible(!isModalVisible)
  }

  return (
    <View style={styles.screen}>
      <StartupMoodModal changeMood={moodPoints} />
      <View>
        <View style={styles.homeTop}>
          <ChangePic moodPoints={moodPoints} />
          <View style={styles.moodcontainer}>
            <Modal isVisible={isModalVisible} style={styles.modal}>
              <View style={styles.changeMoodModal}>
                <Text style={styles.changeMoodTitle}>Manually change mood</Text>
                <View style={styles.moodModalGroup}>
                  <TouchableOpacity
                    onPress={() => setMoodPoints(moodPoints - 1)}
                  >
                    <Ionicons
                      style={styles.modalIcons}
                      name="remove-circle-outline"
                      size={40}
                      color="#052D40"
                    />
                  </TouchableOpacity>
                  <Text style={styles.moodnmbrModal}>{moodPoints}</Text>
                  <TouchableOpacity
                    onPress={() => setMoodPoints(moodPoints + 1)}
                  >
                    <Ionicons
                      style={styles.modalIcons}
                      name="add-circle-outline"
                      size={40}
                      color="#052D40"
                    />
                  </TouchableOpacity>
                </View>
                <ButtonTertiary
                  text="DONE"
                  onPress={async () => await UpdateUserMood()}
                />
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  moodnmbrModal: {
    fontSize: 32,
    fontFamily: "Poppins600SemiBold",
    zIndex: 3,
    textAlign: "center",
    color: "#052D40"
  },
  homeTop: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
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
  screen: { height: 420 }
})
export default ResponsiveHeader
