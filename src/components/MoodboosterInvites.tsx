import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import React, { useContext, useState } from "react"
import Modal from "react-native-modal"
import ButtonTertiary from "./ButtonTertiary"
import { IconButton } from "react-native-paper"
import { inviteMoodbooster } from "../services/moodboosterService"
import ButtonPrimary from "./ButtonPrimary"
import Toast from "react-native-toast-message"
import { AppContext } from "../context/AppContext"
import { useFriendsQuery } from "../queries/FriendQueries"

const MoodboosterInvitesModal = ({
  isModalVisible,
  setModalVisible,
  moodboosterId
}) => {
  const { accessToken } = useContext(AppContext)
  const friendsQuery = useFriendsQuery()
  const InfoToast = (toastData) => {
    Toast.show({
      type: "info",
      text1: `Invited ${toastData}`
    })
  }
  const toggleModalOff = () => {
    setModalVisible(!isModalVisible)
  }
  const handleToInvite = async (user) => {
    await inviteMoodbooster(accessToken, moodboosterId, user.userId)
    InfoToast(user.name)
  }

  return (
    <Modal isVisible={isModalVisible} style={styles.modal}>
      <View style={styles.friendsModal}>
        <Text style={styles.friendstitle}>Invite friends</Text>
        <ScrollView style={styles.friendslist}>
          {friendsQuery.isSuccess && friendsQuery.data.length > 0 ? (
            friendsQuery.data.map(item => (
              <View style={styles.card} key={item.id}>
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
            ))
          ) : (
            <Text style={styles.modalempty}>No friends added</Text>
          )}
        </ScrollView>
        <ButtonTertiary text="DONE" onPress={toggleModalOff} />
      </View>
    </Modal>
  )
}

const MoodboosterInvites = (props) => {
  const [ isModalVisible, setModalVisible ] = useState(false)

  const toggleModalOn = () => {
    //handleActivities()
    setModalVisible(!isModalVisible)
  }

  return (
    <View>
      <IconButton
        mode="outlined"
        icon="account-plus"
        disabled={props.disabled}
        onPress={() => toggleModalOn()}
      />
      {isModalVisible ? (
        <MoodboosterInvitesModal
          moodboosterId={props.moodboosterId}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      ) : (
        <></>
      )}
    </View>
  )
}

export default MoodboosterInvites

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
