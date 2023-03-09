import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import Modal from "react-native-modal"
import Ionicons from "@expo/vector-icons/Ionicons"
import TertiaryBtn from "../buttons/TertiaryBtn"
import { AuthContext } from "../../context/AuthContext"
import {
  acceptMoodboosterRequest,
  getAllMoodboosterRequests
} from "../../services/moodboosterService"
import { declineMoodboosterRequest } from "../../services/moodboosterService"
import PrimaryBtn from "../buttons/PrimaryBtn"
import SecondaryBtn from "../buttons/SecondaryBtn"
import { Card, Paragraph } from "react-native-paper"
import Toast from "react-native-toast-message"

const challengeFriends = () => {
  const [ isModalVisible, setModalVisible ] = useState(false)
  const { accessToken } = useContext(AuthContext)
  // const [dataState, setDataState] = useState(false);
  const [ friends, setFriends ] = useState([])
  // const [moodboosterRequests, setMoodboosterRequests] = useState(0);
  const cancelledToast = (toastData) => {
    Toast.show({
      type: "error",
      text1: `Declined invitation from ${toastData}`
    })
  }
  const acceptedToast = (toastData) => {
    Toast.show({
      type: "info",
      text1: `Accepted invitation from ${toastData}`
    })
  }

  useEffect(() => {
    handleActivities()
    return () => {
      return
    }
  }, [])

  const toggleModalOn = () => {
    setModalVisible(!isModalVisible)
    handleActivities()
  }
  const toggleModalOff = () => {
    setModalVisible(!isModalVisible)
  }
  const handleActivities = async () => {
    const fetchedMoodboosterRequests = await fetchMoodboosterRequests()
    // console.log(fetchedMoodboosterRequests);
    setFriends(fetchedMoodboosterRequests)
  }
  const handleToDecline = async (user) => {
    await declineMoodboosterRequest(user.inviteId, accessToken)
    cancelledToast(user.inviterName)
    handleActivities()
  }
  const handleToAccept = async (user) => {
    await acceptMoodboosterRequest(user.inviteId, accessToken)
    acceptedToast(user.inviterName)
    handleActivities()
  }
  const fetchMoodboosterRequests = async () => {
    try {
      const res = await getAllMoodboosterRequests(accessToken)

      return res
    } catch (err) {
      console.log(err)
    }
  }

  const FriendsList = () => (
    <ScrollView>
      {friends.map((item, index) => (
        <Card
          style={styles.surface}
          mode="outlined"
          theme={{ colors: { outline: "rgba(0, 0, 0, 0)" }}}
          key={index}
        >
          <Card.Content style={styles.cardcontent}>
            <Image
              style={styles.pfp}
              source={require("../../../assets/pfp.png")}
            ></Image>
            <View style={styles.textcontent}>
              <Paragraph style={styles.title}>{item.inviterName}</Paragraph>
              <Text style={styles.description}>
                {item.moodboosterDescription}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.buttons}>
            <SecondaryBtn
              text={"DECLINE"}
              onPress={() => handleToDecline(item)}
            ></SecondaryBtn>
            <PrimaryBtn
              text={"ACCEPT"}
              onPress={() => handleToAccept(item)}
            ></PrimaryBtn>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  )

  return (
    <View>
      <TouchableOpacity onPress={toggleModalOn} style={styles.friendsbtn}>
        <Text style={styles.buttontext}>{friends?.length ?? 0}</Text>
        <Ionicons style={styles.icon} name="people" size={24} color="#052D40" />
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.friendsModal}>
          <Text style={styles.friendstitle}>Moodbooster invitations</Text>
          <View style={styles.friendslist}>
            {friends.length ? (
              <FriendsList />
            ) : (
              <Text style={styles.modalempty}>No invitations</Text>
            )}
          </View>
          <TertiaryBtn text="DONE" onPress={toggleModalOff} />
        </View>
      </Modal>
    </View>
  )
}

export default challengeFriends

const styles = StyleSheet.create({
  buttontext: {
    fontFamily: "Poppins700Bold",
    fontSize: 18,
    marginLeft: 8,
    color: "#052D40"
  },
  friendsbtn: {
    flexDirection: "row",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC"
  },
  icon: { paddingHorizontal: 8 },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  friendsModal: {
    alignItems: "center",
    padding: 18,
    width: "100%",
    height: "80%",
    borderRadius: 8,
    backgroundColor: "white"
  },
  friendslist: {
    flex: 1,
    marginVertical: 16,
    width: "100%"
    // height: "90%",
  },
  friendstitle: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 24,
    color: "#031D29"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 16,
    color: "#052D40",
    width: "80%"
  },
  pfp: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 999,
    backgroundColor: "green"
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  description: {
    fontFamily: "Poppins500Medium",
    fontSize: 12,
    color: "#052D40"
  },
  modalempty: {
    fontFamily: "Poppins500Medium",
    fontSize: 14,
    color: "#052D40",
    marginLeft: 10
  },
  surface: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: 8,
    marginVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    backgroundColor: "white"
  },
  cardcontent: {
    flexDirection: "row",
    alignItems: "center"
  },
  textcontent: {
    marginLeft: 8,
    flexDirection: "column",
    width: "80%"
  }
})
