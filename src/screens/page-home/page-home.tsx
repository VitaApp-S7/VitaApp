import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Touchable,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Text, Card, Avatar, IconButton } from "react-native-paper";
import Moodbooster from "../../components/moodbooster/moodbooster";
import Modal from "react-native-modal";
import Moodperson from "../../../assets/moodperson.svg";
import Moodperson_sad from "../../../assets/moodperson_sad.svg";
import Moodperson_neutral from "../../../assets/moodperson_neutral.svg";
import Ionicons from "@expo/vector-icons/Ionicons";

import StartupMood from "../../components/PopUps/StartupMood";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { getUser, updateUserMood } from "../../services/userService";
import { AuthContext } from "../../context/AuthContext";
import ChallengeFriends from "../../components/challengeFriends/challengeFriends";
import { MoodboosterContext } from "./moodboosterContext";
import * as SecureStore from "expo-secure-store";
import TertiaryBtn from "../../components/buttons/TertiaryBtn";

const PageHome = ({ navigation }) => {
  const [name, setName] = useState("");
  const [requestData, setRequestData] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const wave = require("../../../assets/wave.png");

  const [mood, setMood] = useState(10);
  const [changeMood, setChangeMood] = useState(0);
  const userMood = async () => {
    var userData = await getUser(accessToken);
    const currentUser = JSON.parse(await SecureStore.getItemAsync("User"));
    setName(currentUser.name);
    setMood(userData.mood);

  };
  const toggleModalOn = () => {
    setChangeMood(mood);
    setModalVisible(!isModalVisible);
  };
  const toggleModalOff = async () => {
    if (changeMood !== mood) {
      await updateUserMood(accessToken, changeMood);
      userMood();
      setModalVisible(!isModalVisible);
      console.log("Updated Mood!");
    } else {
      setModalVisible(!isModalVisible);
      console.log("Cancelled!");
    }
  };
  const moodDown = () => {
    if (changeMood <= 0) {
      setChangeMood(0);
    } else {
      setChangeMood(changeMood - 1);
    }
  };
  const moodUp = () => {
    if (changeMood >= 20) {
      setChangeMood(20);
    } else {
      setChangeMood(changeMood + 1);
    }
  };
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    userMood();
    console.log(mood)
  }, []);

  const ChangePic = () => {
    const userMoodConditions = mood;
    if (userMoodConditions > 7) {
      return <Moodperson />;
    } else if (userMoodConditions <= 7 && userMoodConditions >= 4) {
      return <Moodperson_neutral />;
    } else if (userMoodConditions < 4) {
      return <Moodperson_sad />;
    }
  };

  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <MoodboosterContext.Provider
      value={{ requestData, setRequestData }}
    >
      <View style={styles.screen}>
        <StartupMood changeMood={userMood} />
        <View style={styles.top}>
          <ImageBackground source={wave} style={styles.wave}>
            <View style={styles.homeTop}>
              <Text style={styles.heading2}>{name}</Text>
              <ChangePic />
              <View style={styles.moodcontainer}>
                <TouchableOpacity onPress={toggleModalOn}>
                  <Image
                    style={styles.moodbg}
                    source={require("../../../assets/moodbg2.png")}
                  />
                  <Text style={styles.moodnmbr}>{mood}</Text>
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
        <View style={styles.moodboostertop}>
          <Text style={styles.moodtitle}>Today's moodboosters</Text>
          <ChallengeFriends />
        </View>
        <Moodbooster changeMood={userMood} />
      </View>
    </MoodboosterContext.Provider>
  );
};

const styles = StyleSheet.create({
  // styling here
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  moodboostertop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 4,
  },
  moodcontainer: {
    justifyContent: "center",
    alignItems: "center",
    // margin: 8,
    marginTop: -16,
  },
  moodtitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#031D29",
  },
  moodnmbr: {
    position: "absolute",
    fontSize: 32,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    zIndex: 3,
    textAlign: "center",
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 45,
  },
  moodnmbrModal: {
    fontSize: 32,
    fontFamily: "Poppins_600SemiBold",
    zIndex: 3,
    textAlign: "center",
    color: "#052D40",
  },
  moodbg: {
    zIndex: 2,
    position: "relative",
    width: 70,
    resizeMode: "contain",
    marginTop: 8,
  },
  pic: {
    marginTop: 18,
  },
  top: {
    height: "50%",
  },
  wave: {
    height: "95%",
  },
  heading2: {
    fontSize: 20,
    marginTop: 18,
    marginBottom: 8,
    fontFamily: "Poppins_600SemiBold",
    color: "#052D40",
  },
  homeTop: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  changeMoodTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: "#052D40",
  },
  changeMoodModal: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    width: "100%",
    height: "30%",
    borderRadius: 8,
    backgroundColor: "white",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    paddingHorizontal: 8,
  },
  moodModalGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "50%",
  },
  modalIcons: {
    paddingLeft: 4,
  },

});

export default PageHome;
