import React, { useState, useEffect, useContext } from "react";
import { Alert, Modal, StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Button } from "react-native-paper";
import { useMoodPoints, useMoodPointsUpdate } from "./MoodPointsContext";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { AuthContext } from "../../context/AuthContext";
import { updateUserMood } from "../../services/userService";
import { TouchableHighlight } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  GetModalVisable,
  SetModalVisable,
  SetDate,
  GetDate
} from "../../services/userService";
import Frowney from '../../../assets/modal_frowney.svg';
import Neutral from '../../../assets/modal_neutral.svg';
import Happy from '../../../assets/modal_happy.svg';


const StartupMood = ({ changeMood }) => {
  const { accessToken } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const mood = useMoodPoints()
  const updateMood = useMoodPointsUpdate()
  const date = new Date();

  useEffect(() => {

    IsModalVisable();

  }), [];

  async function IsModalVisable() {
    const test = await GetDate(accessToken)


    if (test.toString() !== date.toDateString()) {
      await SetDate(accessToken, date.toDateString())
      SetModalVisable(accessToken, true);
      setModalVisible(true)

    }

    else {
      if(modalVisible === false){
        SetModalVisable(accessToken, false);
        setModalVisible(false)
      }
    }
  };

  const updateMoodPopUp = async (points) => {

    setModalVisible(false);
    await SetModalVisable(accessToken, false);
    await updateUserMood(accessToken, points);
    changeMood(points)
    console.log(modalVisible);
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);

      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>How are we feeling today?</Text>
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={styles.btn}
              onPress={() => updateMoodPopUp(1)}>
              {/* <Image source={require("../../../assets/modal_frowney.svg")} style={styles.emoji}/> */}
              <Frowney />
            </Pressable>
            <Pressable
              style={styles.btn}
              onPress={() => updateMoodPopUp(5)}>
              {/* <Image source={require("../../../assets/modal_neutral.svg")} style={styles.emoji}/> */}
              <Neutral />
            </Pressable>
            <Pressable
              style={styles.btn}
              onPress={() => updateMoodPopUp(10)}>
              {/* <Image source={require("../../../assets/modal_happy.svg")} style={styles.emoji}/> */}
              <Happy />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  btn: {
    margin: 16,
    justifyContent: "space-between",
    height: 48,
    width: 48,
    paddingBottom: 32
  },
  PressableOpen: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  PressableClose: {
    backgroundColor: "#2196F3",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    color: "#031D29",
    fontFamily: "Poppins_700Bold",
  },
  emoji: {
    flex: 1,
    // flex: Platform.OS === 'ios' ? 1 : null,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 42,
    minHeight: 42,
    resizeMode: "stretch"
  }
});

export default StartupMood;