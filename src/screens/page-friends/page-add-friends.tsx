import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native"
import React, { useMemo, useState } from "react"
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import Bg from "../../../assets/wave.svg"
import {
  useFriendInvitesQuery,
  useFriendsQuery
} from "../../queries/FriendQueries"
import { useOtherPeopleQuery } from "../../queries/UserQueries"
import FriendInvite from "../../components/FriendInvite"
import FriendOther from "../../components/FriendOther"
import { TextInput } from "react-native-paper"
import Ionicons from "react-native-vector-icons/Ionicons"

const PageAddFriends = () => {
  const [ refreshing, setRefreshing ] = useState(false)
  const [ searchString, setSearchString ] = useState<string>("")

  const invites = useFriendInvitesQuery()
  const friends = useFriendsQuery()

  const { users, otherPeople } = useOtherPeopleQuery(friends, invites)

  const filteredOtherPeople = useMemo(() => {
    return otherPeople.filter((user) =>
      user.name.toLowerCase().includes(searchString.toLowerCase())
    )
  }, [ searchString, otherPeople ])

  const filteredInvited = useMemo(() => {
    return invites.data.filter((user) =>
      user.name.toLowerCase().includes(searchString.toLowerCase())
    )
  }, [ searchString, invites ])

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
            onRefresh={async () => {
              setRefreshing(true)
              setRefreshing(true)
              await Promise.all([
                friends.refetch(),
                invites.refetch(),
                users.refetch()
              ])
              setRefreshing(false)
              setRefreshing(false)
            }}
          />
        }
      >
        <Bg style={styles.wave} />
        <View>
          <>
            <View style={styles.searchSection}>
              <Ionicons
                style={styles.searchIcon}
                name="ios-search"
                size={20}
                color="#000"
              />
              <TextInput
                style={styles.input}
                placeholder="Search Friends"
                onChangeText={(searchString) => {
                  setSearchString(searchString)
                }}
                underlineColorAndroid="red"
              />
            </View>
            {invites.isSuccess && filteredInvited.length > 0 && (
              <>
                <Text style={styles.title}>Invited</Text>
                {filteredInvited.map((item) => (
                  <FriendInvite invite={item} key={item.friendId} />
                ))}
              </>
            )}
          </>
          <>
            <Text style={styles.title}>Other people</Text>
            {otherPeople.length > 0 ? (
              filteredOtherPeople.map((item) => (
                <FriendOther other={item} key={item.id} />
              ))
            ) : (
              <Text style={styles.description}>Everyone is your friend.</Text>
            )}
          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PageAddFriends

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  screen: {
    backgroundColor: "white",
    minHeight: 400
  },
  wave: {
    width: "100%",
    position: "absolute"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 16,
    color: "#052D40",
    paddingLeft: 12,
    paddingTop: 16,
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
  searchSection: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 70,
    overflow: "hidden",
    height: 50
  },
  searchIcon: { padding: 10 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#424242"
  }
})
