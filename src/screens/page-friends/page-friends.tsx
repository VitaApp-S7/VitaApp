import {
  Image,
  ImageSourcePropType,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native"
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import React, { useContext, useState } from "react"
import {
  addFriend,
  cancelFrRequest,
  getFriends,
  getSendedRequests,
  removeFriend
} from "../../services/friendsService"
import { getAllUsers } from "../../services/userService"
import { AppContext } from "../../context/AppContext"
// import { __handlePersistedRegistrationInfoAsync } from "expo-notifications/build/DevicePushTokenAutoRegistration.fx"
import ButtonSecondary from "../../components/ButtonSecondary"
import ButtonPrimary from "../../components/ButtonPrimary"
import Bg from "../../../assets/wave.svg"
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient
} from "@tanstack/react-query"
import ButtonTertiary from "../../components/ButtonTertiary"
import FriendType from "../../types/FriendType"
import SendedFriendType from "../../types/SendedFriendType"
import PublicUserType from "../../types/PublicUserType"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require("lodash")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pfp: ImageSourcePropType = require("../../../assets/pfp.png")

const PageFriends = () => {
  const { accessToken } = useContext(AppContext)

  const [ refreshing, setRefreshing ] = useState(false)

  const appContext = useContext(AppContext)

  const queryClient = useQueryClient()

  const friends = useQuery<FriendType[]>(
    [ "friends" ],
    () => getFriends(accessToken),
    {
      onError: (error) => {
        console.log("friends get req error", error)
      }
    }
  )

  const invites = useQuery<SendedFriendType[]>(
    [ "invites" ],
    () => getSendedRequests(accessToken),
    {
      onError: (error) => {
        console.log("invites request error", error)
      }
    }
  )

  // fetching the users from db and setting other people array onSuccess
  // to set the array of other people we remove friends array and invites array from users.
  const users = useQuery<PublicUserType[]>(
    [ "publicUsers" ],
    () => getAllUsers(accessToken),
    {
      enabled: !!appContext.user?.id && !!friends.data && !!invites.data,
      onSuccess: (users) => {
        const otherPeopleIds = _.difference(
          users.map((user) => user.id),
          friends.data.map((friend) => friend.userId),
          invites.data.map((invite) => invite.friendId),
          [ appContext.user.id ]
        )
        setOtherPeople(
          users.filter((user) => otherPeopleIds.includes(user.id))
        )
      },
      onError: (error) => {
        console.log("error", error)
      },
      staleTime: 30 * 60 * 1000,
      cacheTime: 3 * 24 * 60 * 60 * 1000
    }
  )

  const [ otherPeople, setOtherPeople ] = useState(
    (users.data ? users.data : []).filter((user) =>
      _.difference(
        users.data.map((user) => user.id),
        friends.data.map((friend) => friend.userId),
        invites.data.map((invite) => invite.friendId),
        [ appContext.user.id ]
      ).includes(user.id)
    )
  )

  // we use react query mutation to change values in front end
  const mutationAddFriend = useMutation((id) => addFriend(accessToken, id))
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

      mutationAddFriend.mutate(id, {
        onError: (error) => {
          console.log("error", error)
          queryClient.setQueryData([ "invites" ], oldInvited)
          queryClient.setQueryData([ "invites" ], oldInvited)
          setOtherPeople(oldOtherPeople)
        },
        onSuccess: () => queryClient.invalidateQueries([ "invites" ])
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

  // eslint-disable-next-line @typescript-eslint/no-var-requires

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true)
              await Promise.all([
                friends.refetch(),
                invites.refetch(),
                users.refetch()
              ])
              setRefreshing(false)
            }}
          />
        }
      >
        {!users.isSuccess ? (
          <>
            <Bg style={styles.wave} />
            <Text style={styles.title}>Loading ...</Text>
          </>
        ) : (
          <>
            <Bg style={styles.wave} />
            <>
              <Text style={styles.title}>Friends</Text>
              {!friends.isLoading && friends.data.length > 0 ? (
                friends.data.map((item, index) => (
                  <View style={styles.card} key={index}>
                    <View style={styles.wrapperTop}>
                      <View style={styles.joined}>
                        <Image style={styles.pfp} source={pfp} />
                        <Text style={styles.title}>{item.name}</Text>
                      </View>

                      <ButtonTertiary
                        text={"REMOVE"}
                        onPress={() => deleteFriend(item)}
                      ></ButtonTertiary>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.description}>No friends yet!</Text>
              )}
            </>

            <>
              <Text style={styles.title}>Invited</Text>
              {invites.status === "success" && invites.data.length > 0 ? (
                invites.data.map((item, index) => (
                  <View style={styles.card} key={index}>
                    <View style={styles.wrapperTop}>
                      <View style={styles.joined}>
                        <Image style={styles.pfp} source={pfp} />
                        <Text style={styles.title}>{item.name}</Text>
                      </View>

                      <ButtonSecondary
                        text={"CANCEL"}
                        onPress={() => cancelInvite(item)}
                      ></ButtonSecondary>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.description}>No invitations send!</Text>
              )}
            </>

            <>
              <Text style={styles.title}>Other people</Text>
              {otherPeople.length > 0 ? (
                otherPeople.map((item, index) => (
                  <View style={styles.card} key={index}>
                    <View style={styles.wrapperTop}>
                      <View style={styles.joined}>
                        <Image style={styles.pfp} source={pfp}></Image>
                        <Text style={styles.title}>{item.name}</Text>
                      </View>

                      <ButtonPrimary
                        text={"INVITE"}
                        onPress={() => sendInvite(item.id)}
                      ></ButtonPrimary>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.description}>No users?</Text>
              )}
            </>
          </>
        )}
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
    backgroundColor: "white"
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
    paddingTop: 6,
    width: "70%"
  },
  description: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
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
