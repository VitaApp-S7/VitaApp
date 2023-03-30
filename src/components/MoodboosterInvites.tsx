import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import ButtonTertiary from "./buttons/ButtonTertiary";
import { IconButton } from "react-native-paper";
import { inviteMoodbooster } from "../services/moodboosterService";
import { getFriends } from "../services/friendsService";
import ButtonPrimary from "./buttons/ButtonPrimary";
import Toast from "react-native-toast-message";
import { AppContext } from "../context/AppContext";

const moodboosterInvites = (props) => {
  const [ isModalVisible, setModalVisible ] = useState(false)
  const { accessToken } = useContext(AppContext)
  // const [dataState, setDataState] = useState(false);
  const [ friends, setFriends ] = useState([])

  const InfoToast = (toastData) => {
    Toast.show({
      type: "info",
      text1: `Invited ${toastData}`
    })
  }

  const toggleModalOn = () => {
    handleActivities()
    setModalVisible(!isModalVisible)
  }
  const toggleModalOff = () => {
    setModalVisible(!isModalVisible)
  }
  const handleActivities = async () => {
    const fetchedUsers = await fetchFriends()
    // console.log(fetchedUsers)
    setFriends(fetchedUsers)
  }
  const handleToInvite = async (user) => {
    await inviteMoodbooster(accessToken, props.moodboosterId, user.userId)
    InfoToast(user.name)
  }
  const fetchFriends = async () => {
    try {
      const res = await getFriends(accessToken)

      return res
    } catch (err) {
      console.log(err)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {}, [])

  const FriendsList = () => (
    <ScrollView>
      {friends.map((item, index) => (
        <View style={styles.card} key={index}>
          <View style={styles.wrapperTop}>
            <View style={styles.joined}>
              <Image
                style={styles.pfp}
                source={require("../../assets/pfp.png")}
              ></Image>
              <Text style={styles.title}>{item.name}</Text>
            </View>

            <ButtonPrimary
              text={"INVITE"}
              onPress={() => handleToInvite(item)}
            ></ButtonPrimary>
          </View>
        </View>
      ))}
    </ScrollView>
  )

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
          <ButtonTertiary text="DONE" onPress={toggleModalOff} />
        </View>
      </Modal>
    </View>
  )
}

export default moodboosterInvites

const styles = StyleSheet.create({
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
    marginVertical: 16,
    width: "100%",
    height: "80%"
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
    paddingLeft: 12,
    width: "70%"
  },
  joined: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
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
    backgroundColor: "white"
  },
  wrapperTop: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    margin: 8
  },
  pfp: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 999,
    backgroundColor: "green"
  },
  modalempty: {
    fontFamily: "Poppins500Medium",
    fontSize: 14,
    color: "#052D40",
    marginLeft: 10
  }
})
