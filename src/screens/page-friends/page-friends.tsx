import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image
} from "react-native"
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import React, { useContext, useState } from "react"
import { Card, Paragraph } from "react-native-paper"
import Bg from "../../../assets/wave.svg"
import {
  useFriendRequestsQuery,
  useFriendsQuery
} from "../../queries/FriendQueries"
import Friend from "../../components/Friend"
import { useQueryClient } from "@tanstack/react-query"
import { acceptFrRequest, cancelFrRequest } from "../../services/friendsService"
import { AppContext } from "../../context/AppContext"
import ButtonPrimary from "../../components/ButtonPrimary"
import ButtonSecondary from "../../components/ButtonSecondary"
import { useNavigation } from "@react-navigation/native"

const PageFriends = () => {
  const { accessToken } = useContext(AppContext)

  const navigation = useNavigation()

  const [ refreshing, setRefreshing ] = useState(false)

  const friends = useFriendsQuery()

  const queryClient = useQueryClient()

  const requestsQuery = useFriendRequestsQuery()

  const handleCancelRequest = async (id) => {
    try {
      const res = await cancelFrRequest(accessToken, id)
      if (res.status === 200) {
        queryClient.setQueryData(
          [ "friendRequests" ],
          requestsQuery.data.filter((item) => item.id !== id)
        )
      }
    } catch (err) {
      console.log("request couldn't be cancelled", err)
    }
  }

  const handleAcceptRequest = async (id) => {
    try {
      const res = await acceptFrRequest(accessToken, id)
      if (res.status === 200) {
        queryClient.setQueryData(
          [ "friendRequests" ],
          requestsQuery.data.filter((item) => item.id !== id)
        )
        await queryClient.invalidateQueries([ "friends" ])
        await queryClient.invalidateQueries([ "publicUsers" ])
      }
    } catch (err) {
      console.log("request couldn't be accepted", err)
    }
  }

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
                queryClient.invalidateQueries([ "friendRequests" ]),
                friends.refetch()
              ])
              setRefreshing(false)
            }}
          />
        }
      >
        {!friends.isSuccess ? (
          <>
            <Bg style={styles.wave} />
            <Text style={styles.title}>Loading ...</Text>
          </>
        ) : (
          <>
            <Bg style={styles.wave} />
            <>
              {requestsQuery.isSuccess && requestsQuery.data.length > 0 && (
                <>
                  <Text style={styles.title}>Have invited you</Text>

                  {requestsQuery.data.map((item) => (
                    <Card
                      style={styles.surface}
                      mode="outlined"
                      theme={{ colors: { outline: "rgba(0, 0, 0, 0)" }}}
                      key={item.id}
                    >
                      <Card.Content style={styles.cardcontent}>
                        <Image
                          style={styles.pfp}
                          source={require("../../../assets/pfp.png")}
                        ></Image>
                        <Paragraph style={styles.title}>{item.name}</Paragraph>
                      </Card.Content>
                      <Card.Actions style={styles.buttons}>
                        <ButtonSecondary
                          text={"DECLINE"}
                          onPress={() => handleCancelRequest(item.id)}
                        ></ButtonSecondary>
                        <ButtonPrimary
                          text={"ACCEPT"}
                          onPress={() => handleAcceptRequest(item.id)}
                        ></ButtonPrimary>
                      </Card.Actions>
                    </Card>
                  ))}
                </>
              )}
              <Text style={styles.title}>Friends</Text>
              {friends.isSuccess && friends.data.length > 0 ? (
                friends.data.map((item) => (
                  <Friend friend={item} key={item.userId} />
                ))
              ) : (
                <Text style={styles.description}>No friends yet!</Text>
              )}
              <ButtonPrimary
                style={styles.addFriendsBtn}
                text={"ADD FRIENDS"}
                onPress={() => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  navigation.navigate("Add Friends")
                }}
              ></ButtonPrimary>
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
  screen: {
    backgroundColor: "white",
    minHeight: 400
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
    paddingLeft: 12
  },
  wave: {
    width: "100%",
    position: "absolute"
  },
  surface: {
    borderRadius: 5,
    paddingRight: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    fontFamily: "Poppins600SemiBold"
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  pfp: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 999,
    backgroundColor: "green"
  },
  cardcontent: {
    flexDirection: "row",
    alignItems: "center"
  },
  addFriendsBtn: {
    display: "flex",
    alignItems: "center",
    marginTop: 30,
    width: 200,
    marginLeft: "auto",
    marginRight: "auto"
  }
})
