import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import TertiaryBtn from "../buttons/TertiaryBtn";
import { Card, IconButton, Paragraph } from "react-native-paper";
import {
  getAllMoodboosterRequests,
  inviteMoodbooster,
} from "../../services/moodboosterService";
import { AuthContext } from "../../context/AuthContext";
import { getFriends } from "../../services/friendsService";
import { getAllUsers } from "../../services/userService";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Toast from "react-native-toast-message";
import { MoodboosterContext } from "../../screens/page-home/moodboosterContext";

const inviteFriends = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [mount, setMount] = useState(false);
  const { accessToken } = useContext(AuthContext);
  // const [dataState, setDataState] = useState(false);
  const [friends, setFriends] = useState([]);
  const { moodboosterRequests, setMoodboosterRequests } =
    useContext(MoodboosterContext);

  const InfoToast = (toastData) => {
    Toast.show({
      type: "info",
      text1: "Invited " + toastData,
    });
  };

  const toggleModalOn = () => {
    handleActivities();
    setModalVisible(!isModalVisible);
  };
  const toggleModalOff = () => {
    setModalVisible(!isModalVisible);
  };
  const handleActivities = async () => {
    const fetchedUsers = await fetchFriends();
    // console.log(fetchedUsers)
    setFriends(fetchedUsers);
  };
  const handleToInvite = async (user) => {
    const invite = await inviteMoodbooster(
      accessToken,
      props.moodboosterId,
      user.userId
    );
    InfoToast(user.name);
  };
  const fetchFriends = async () => {
    try {
      const res = await getFriends(accessToken);

      return res;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {

  }, []);

  const FriendsList = () => (
    <ScrollView>
      {friends.map((item, index) => (
        <View style={styles.card} key={index}>
          <View style={styles.wrapperTop}>
            <View style={styles.joined}>
              <Image
                style={styles.pfp}
                source={require("../../../assets/pfp.png")}
              ></Image>
              <Text style={styles.title}>{item.name}</Text>
            </View>

            <PrimaryBtn
              text={"INVITE"}
              onPress={() => handleToInvite(item)}
            ></PrimaryBtn>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View>
      <IconButton
        mode="outlined"
        icon="account-plus"
        disabled={props.disabled}
        onPress={() => toggleModalOn()}
      />
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.friendsModal}>
          <Text style={styles.friendstitle}>Invite friends</Text>
          <View style={styles.friendslist}>
          {friends.length ? (
              <FriendsList />
            ) : (
              <Text style={styles.modalempty}>No friends added</Text>
            )}
          </View>
          <TertiaryBtn text="DONE" onPress={toggleModalOff} />
        </View>
      </Modal>
    </View>
  );
};

export default inviteFriends;

const styles = StyleSheet.create({
  buttontext: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginLeft: 8,
    color: "#052D40",
  },
  friendsbtn: {
    flexDirection: "row",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  icon: {
    paddingHorizontal: 8,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  friendsModal: {
    alignItems: "center",
    padding: 18,
    width: "100%",
    height: "80%",
    borderRadius: 8,
    backgroundColor: "white",
  },
  friendslist: {
    marginVertical: 16,
    width: "100%",
    height: "80%",
  },
  friendscard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  friendstitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: "#031D29",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#052D40",
    paddingLeft: 12,
    width: "70%",
  },
  joined: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: 8,
    marginVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    backgroundColor: "white",
  },
  wrapperTop: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    margin: 8,
  },
  pfp: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 999,
    backgroundColor: "green",
  },
  modalempty: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#052D40",
    marginLeft: 10,
  },
});
