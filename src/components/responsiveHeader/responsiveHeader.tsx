import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import StartupMood from "../PopUps/StartupMood"
import Modal from "react-native-modal"
import { Text } from "react-native-paper"
import Ionicons from "@expo/vector-icons/Ionicons"
import TertiaryBtn from "../buttons/TertiaryBtn"
import React, { useContext, useState } from "react"
import { updateUserMood } from "../../services/userService"
import { AuthContext } from "../../context/AuthContext"
import { MoodPointsContext } from "../PopUps/MoodPointsContext"

const ResponsiveHeader = () => {
  const [ isModalVisible, setModalVisible ] = useState<boolean>(false)
  const { moodPoints, setMoodPoints } = useContext(MoodPointsContext)
  const { accessToken, user } = useContext(AuthContext)
  const UpdateUserMood = async () => {
    await updateUserMood(accessToken, moodPoints)
    setModalVisible(!isModalVisible)
  }

  const ChangePic = () => {
    if (moodPoints > 7) {
      return (
        <Image
          source={require("../../../assets/Hairy.png")}
          style={{
            width: 180,
	    height: 180
          }}
        />
      ) //<Moodperson />;
    } else if (moodPoints <= 7 && moodPoints >= 4) {
      return (
        <Image
          source={require("../../../assets/Hairy.png")}
          style={{
            width: 180,
            height: 180
          }}
        />
      ) //<MoodpersonNeutral />;
    } else if (moodPoints < 4) {
      return (
        <Image
          source={require("../../../assets/Hairy.png")}
          style={{
            width: 180,
            height: 180
          }}
        />
      ) //<MoodpersonSad />;
    }
  }

  return (
    <View style={styles.screen}>
      <StartupMood changeMood={moodPoints} />
      <View>
        <ImageBackground
          source={require("../../../assets/wave.png")}
          style={styles.wave}
        >
          <View style={styles.homeTop}>
            <Text style={styles.heading2}>{user.name}</Text>
            <ChangePic />
            <View style={styles.moodcontainer}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  style={styles.moodbg}
                  source={require("../../../assets/moodbg2.png")}
                />
                <Text style={styles.moodnmbr}>{moodPoints}</Text>
              </TouchableOpacity>

              <Modal isVisible={isModalVisible} style={styles.modal}>
                <View style={styles.changeMoodModal}>
                  <Text style={styles.changeMoodTitle}>
                    Manually change mood
                  </Text>
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
                  <TertiaryBtn text="DONE" onPress={async () => await UpdateUserMood()} />
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
  wave: { height: 300 },
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
  screen: {
    height: 420,
    backgroundColor: "white"
  }
})
export default ResponsiveHeader
