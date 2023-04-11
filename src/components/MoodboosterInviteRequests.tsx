import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import React, { useContext, useState } from "react"
import Modal from "react-native-modal"
import Ionicons from "@expo/vector-icons/Ionicons"
import ButtonTertiary from "./ButtonTertiary"
import { AppContext } from "../context/AppContext"
import {
  acceptMoodboosterRequest,
  declineMoodboosterRequest
} from "../services/moodboosterService"
import ButtonPrimary from "./ButtonPrimary"
import ButtonSecondary from "./ButtonSecondary"
import { Card, Paragraph } from "react-native-paper"
import Toast from "react-native-toast-message"
import { useQueryClient } from "@tanstack/react-query"
import { useMoodboosterRequestsQuery } from "../queries/MoodboosterQueries"

const FriendsList = () => {
  const [ refreshing, setRefreshing ] = useState(false)
  const { accessToken } = useContext(AppContext)
  const requestsQuery = useMoodboosterRequestsQuery()
  const queryClient = useQueryClient()

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

  const handleToDecline = async (user) => {
    try {
      await declineMoodboosterRequest(user.inviteId, accessToken)
      queryClient.setQueryData(
        [ "moodboosterRequests" ],
        requestsQuery.data.filter((item) => item.inviteId !== user.inviteId)
      )
    } catch (err) {
      console.log("request couldn't be declined", err)
    }
    cancelledToast(user.inviterName)
  }
  const handleToAccept = async (user) => {
    try {
      await acceptMoodboosterRequest(user.inviteId, accessToken)
      queryClient.setQueryData(
        [ "moodboosterRequests" ],
        requestsQuery.data.filter((item) => item.inviteId !== user.inviteId)
      )
      await queryClient.invalidateQueries([ "moodboosters" ])
      await queryClient.invalidateQueries([ "moodboostersActive" ])
    } catch (err) {
      console.log("request couldn't be accepted", err)
    }
    acceptedToast(user.inviterName)
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await queryClient.invalidateQueries([ "moodboosterRequests" ])
            setRefreshing(false)
          }}
        />
      }
    >
      {requestsQuery.isSuccess && requestsQuery.data.length > 0 ? (
        requestsQuery.data.map((item, index) => (
          <Card
            style={styles.surface}
            mode="outlined"
            theme={{ colors: { outline: "rgba(0, 0, 0, 0)" }}}
            key={index}
          >
            <Card.Content style={styles.cardcontent}>
              <Image
                style={styles.pfp}
                source={require("../../assets/pfp.png")}
              ></Image>
              <View style={styles.textcontent}>
                <Paragraph style={styles.title}>{item.inviterName}</Paragraph>
                <Text style={styles.description}>
                  {item.moodboosterDescription}
                </Text>
              </View>
            </Card.Content>
            <Card.Actions style={styles.buttons}>
              <ButtonSecondary
                text={"DECLINE"}
                onPress={() => handleToDecline(item)}
              ></ButtonSecondary>
              <ButtonPrimary
                text={"ACCEPT"}
                onPress={() => handleToAccept(item)}
              ></ButtonPrimary>
            </Card.Actions>
          </Card>
        ))
      ) : (
        <Text style={styles.modalempty}>No invitations</Text>
      )}
    </ScrollView>
  )
}

const MoodboosterInviteRequests = () => {
  const [ isModalVisible, setModalVisible ] = useState(false)

  const requestsQuery = useMoodboosterRequestsQuery()

  const queryClient = useQueryClient()

  const toggleModalOn = async () => {
    await queryClient.invalidateQueries([ "moodboosterRequests" ])
    setModalVisible(!isModalVisible)
  }
  const toggleModalOff = () => {
    setModalVisible(!isModalVisible)
  }

  return (
    <View>
      <TouchableOpacity onPress={toggleModalOn} style={styles.friendsbtn}>
        <Text style={styles.buttontext}>
          {requestsQuery?.data?.length ?? 0}
        </Text>
        <Ionicons style={styles.icon} name="people" size={24} color="#052D40" />
      </TouchableOpacity>
      {isModalVisible ? (
        <Modal isVisible={isModalVisible} style={styles.modal}>
          <View style={styles.friendsModal}>
            <Text style={styles.friendstitle}>Moodbooster invitations</Text>
            <View style={styles.friendslist}>
              {requestsQuery?.data?.length ? (
                <FriendsList />
              ) : (
                <Text style={styles.modalempty}>No invitations</Text>
              )}
            </View>
            <ButtonTertiary text="DONE" onPress={toggleModalOff} />
          </View>
        </Modal>
      ) : (
        <></>
      )}
    </View>
  )
}

export default MoodboosterInviteRequests

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
