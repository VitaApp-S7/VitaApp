import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Image
} from "react-native"
import {
  useFonts,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_400Regular as Poppins400Regular
} from "@expo-google-fonts/poppins"
import React, { useState, useContext } from "react"
import {
  addFriend,
  getFriends,
  getSendedRequests,
  removeFriend,
  cancelFrRequest
} from "../../services/friendsService"
import { getAllUsers } from "../../services/userService"
import { AuthContext } from "../../context/AuthContext"
// import { __handlePersistedRegistrationInfoAsync } from "expo-notifications/build/DevicePushTokenAutoRegistration.fx"
import SecondaryBtn from "../../components/buttons/SecondaryBtn"
import PrimaryBtn from "../../components/buttons/PrimaryBtn"
import * as SecureStore from "expo-secure-store"
import Bg from "../../../assets/wave.svg"
import { useMutation, useQuery, useQueryClient } from "react-query"
import TertiaryBtn from "../../components/buttons/TertiaryBtn"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require("lodash")

const PageFriends = () => {
  const { accessToken } = useContext(AuthContext)

  const [ refreshing, setRefreshing ] = useState(false)

  const [ otherPeople, setOtherPeople ] = useState([])

  const currentUser = useQuery("currentUser", async () =>
    JSON.parse(await SecureStore.getItemAsync("User"))
  )

  const queryClient = useQueryClient()

  const friends: any = useQuery("friends", () => getFriends(accessToken), {
    onError: (error) => {
      console.log("friends get req error", error)
    }
  })

  const invites: any = useQuery(
    "invites",
    () => getSendedRequests(accessToken),
    {
      onError: (error) => {
        console.log("invites request error", error)
      }
    }
  )

  // fetching the users from db and setting other people array onSuccess
  // to set the array of other people we remove friends array and invites array from users.
  const users: any = useQuery("users", () => getAllUsers(accessToken), {
    enabled: !!currentUser && !!friends.data && !!invites.data,
    onSuccess: (users) => {
      const usersCopy = [ ...users ]
      const userIds = usersCopy.map((user) => user.id)
      const friendIds = friends.data.map((friend) => friend.userId)
      const inviteIds = invites.data.map((invite) => invite.friendId)
      const currentUserId = [ currentUser.data.id ]
      const otherPeopleIds = _.difference(
        userIds,
        friendIds,
        inviteIds,
        currentUser.data.id,
        currentUserId
      )
      const otherPeople = users.filter((user) =>
        otherPeopleIds.includes(user.id)
      )
      setOtherPeople(otherPeople)
    },
    onError: (error) => {
      console.log("error", error)
    }
  })

  // we use react query mutation to change values in front end
  const mutation = useMutation((id) => addFriend(accessToken, id))
  const mutationCancelInvites = useMutation((id) =>
    cancelFrRequest(accessToken, id)
  )
  const mutationDeleteFriend = useMutation((id) =>
    removeFriend(accessToken, id)
  )

  const sendInvite = async (id) => {
    try {
      const oldInvited = [ ...invites.data ]
      const oldOtherPeople = [ ...otherPeople ]
      const newOtherPeople = otherPeople.filter((user) => user.id !== id)
      const newInvited = await getSendedRequests(accessToken)

      queryClient.setQueryData([ "invites" ], newInvited)
      setOtherPeople(newOtherPeople)

      mutation.mutate(id, {
        onError: (error) => {
          console.log("error", error)
          queryClient.setQueryData([ "invites" ], oldInvited)
          queryClient.setQueryData([ "invites" ], oldInvited)
          setOtherPeople(oldOtherPeople)
        },
        onSuccess: () => queryClient.invalidateQueries("invites")
      })
    } catch (err) {
      console.log("Adding friend failed", err)
    }
  }

  const deleteFriend = async (friend) => {
    try {
      const oldFriends = [ ...friends.data ]
      const oldOtherPeople = [ ...otherPeople ]
      const newOtherPeople = [
        ...oldOtherPeople,
        users.data.find((user) => user.id === friend.userId)
      ]
      const newFriends = oldFriends.filter((user) => user.id !== friend.id)

      setOtherPeople(newOtherPeople)
      queryClient.setQueryData([ "friends" ], newFriends)

      mutationDeleteFriend.mutate(friend.id, {
        onError: (error) => {
          console.log("error", error)
          queryClient.setQueryData([ "friends" ], oldFriends)
          setOtherPeople(oldOtherPeople)
        }
      })
    } catch (err) {
      console.log("can't remove friend", err)
    }
  }

  const cancelInvite = async (userInvite) => {
    try {
      const oldInvited = [ ...invites.data ]
      const oldOtherPeople = [ ...otherPeople ]

      const userUsers = users.data.find(
        (user) => user.id === userInvite.friendId
      )
      const newOtherPeople = [ ...otherPeople, userUsers ]

      let newInvited = []

      newInvited = oldInvited.filter(
        (user) => user.friendId !== userInvite.friendId
      )

      queryClient.setQueryData([ "invites" ], newInvited)
      setOtherPeople(newOtherPeople)

      mutationCancelInvites.mutate(userInvite.id, {
        onError: (error) => {
          console.log("error", error)
          queryClient.setQueryData([ "invites" ], oldInvited)
          queryClient.setQueryData([ "invites" ], oldInvited)
          setOtherPeople(oldOtherPeople)
        }
      })
    } catch (err) {
      console.log("Cancel friend invite failed", err)
    }
  }

  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => queryClient.invalidateQueries()}
          />
        }
      >
        <Bg style={styles.wave} />
        <View>
          <Text style={styles.title}>Friends</Text>
          {!friends.isLoading && friends.data.length > 0 ? (
            friends.data.map((item, index) => (
              <View style={styles.card} key={index}>
                <View style={styles.wrapperTop}>
                  <View style={styles.joined}>
                    <Image
                      style={styles.pfp}
                      source={require("../../../assets/pfp.png")}
                    />
                    <Text style={styles.title}>{item.name}</Text>
                  </View>

                  <TertiaryBtn
                    text={"REMOVE"}
                    onPress={() => deleteFriend(item)}
                  ></TertiaryBtn>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.description}>No friends yet!</Text>
          )}
        </View>

        <View>
          <Text style={styles.title}>Invited</Text>
          {!invites.isLoading && invites.data.length > 0 ? (
            invites.data.map((item, index) => (
              <View style={styles.card} key={index}>
                <View style={styles.wrapperTop}>
                  <View style={styles.joined}>
                    <Image
                      style={styles.pfp}
                      source={require("../../../assets/pfp.png")}
                    />
                    <Text style={styles.title}>{item.name}</Text>
                  </View>

                  <SecondaryBtn
                    text={"CANCEL"}
                    onPress={() => cancelInvite(item)}
                  ></SecondaryBtn>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.description}>No invitations send!</Text>
          )}
        </View>
        <View>
          <Text style={styles.title}>Other people</Text>
          {otherPeople.length > 0 ? (
            otherPeople.map((item, index) => (
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
                    onPress={() => sendInvite(item.id)}
                  ></PrimaryBtn>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.description}>No users?</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PageFriends

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  pfp: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 999,
    backgroundColor: "green"
  },
  screen: { backgroundColor: "white" },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    backgroundColor: "white"
  },
  joined: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 16,
    color: "#052D40",
    paddingLeft: 12,
    width: "70%"
  },
  description: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4,
    paddingLeft: 12
  },
  wave: {
    width: "100%",
    position: "absolute"
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    margin: 8
  }
})
