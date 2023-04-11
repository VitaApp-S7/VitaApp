import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text
} from "react-native"
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import React, { useState } from "react"
import Bg from "../../../assets/wave.svg"
import {
  useFriendInvitesQuery,
  useFriendsQuery
} from "../../queries/FriendQueries"
import { useOtherPeopleQuery } from "../../queries/UserQueries"
import Friend from "../../components/Friend"
import FriendInvite from "../../components/FriendInvite"
import FriendOther from "../../components/FriendOther"

const PageFriends = () => {
  const [ refreshing, setRefreshing ] = useState(false)

  const friends = useFriendsQuery()

  const invites = useFriendInvitesQuery()

  const { users, otherPeople } = useOtherPeopleQuery(friends, invites)

  useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        overScrollMode={"never"}
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
              {friends.isSuccess && friends.data.length > 0 ? (
                friends.data.map((item) => (
                  <Friend friend={item} key={item.userId} />
                ))
              ) : (
                <Text style={styles.description}>No friends yet!</Text>
              )}
            </>

            <>
              <Text style={styles.title}>Invited</Text>
              {invites.isSuccess && invites.data.length > 0 ? (
                invites.data.map((item) => (
                  <FriendInvite invite={item} key={item.friendId} />
                ))
              ) : (
                <Text style={styles.description}>No invitations sent!</Text>
              )}
            </>

            <>
              <Text style={styles.title}>Other people</Text>
              {otherPeople.length > 0 ? (
                otherPeople.map((item) => (
                  <FriendOther other={item} key={item.id} />
                ))
              ) : (
                <Text style={styles.description}>Everyone is your friend.</Text>
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
  screen: { backgroundColor: "white" },
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
  }
})
