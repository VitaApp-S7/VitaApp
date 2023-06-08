import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View
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
import BackgroundShape from "../../components/backgroundShape"
import { globalStyle } from "../../globalStyle"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import ButtonCTA from "../../components/ButtonCTA"

const PageFriends = () => {
  const { accessToken } = useContext(AppContext)

  const navigation = useNavigation()

  const [ refreshing, setRefreshing ] = useState(false)

  const friends = useFriendsQuery()

  const queryClient = useQueryClient()

  const requestsQuery = useFriendRequestsQuery()
  const insets = useSafeAreaInsets()
  const safeAreaHeight = insets.top + insets.bottom

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
    <View style={styles.container}>
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
            <BackgroundShape />
            <Text style={styles.title}>Loading ...</Text>
          </>
        ) : (
          <>
            <BackgroundShape />
            <View style={{ marginTop: 40 + safeAreaHeight }}>
              {requestsQuery.isSuccess && requestsQuery.data.length > 0 && (
                <>
                  <Text style={[ globalStyle.text.title, { marginLeft: 10 }]}>
                    Have invited you
                  </Text>

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
                          source={require("../../../assets/hairyFriendAvatar.png")}
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
              <Text style={[ globalStyle.text.title, { marginLeft: 10 }]}>
                Friends
              </Text>
              {friends.isSuccess && friends.data.length > 0 ? (
                friends.data.map((item) => (
                  <Friend friend={item} key={item.userId} />
                ))
              ) : (
                <Text style={styles.description}>No friends yet!</Text>
              )}
              <ButtonCTA
                style={styles.addFriendsBtn}
                text={"ADD FRIENDS"}
                onPress={() => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  navigation.navigate("Add Friends")
                }}
              ></ButtonCTA>
            </View>
          </>
        )}
      </ScrollView>
    </View>
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
  surface: {
    borderRadius: 5,
    paddingRight: 10,
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
    marginTop: 40,
    width: 250,
    marginLeft: "auto",
    marginRight: "auto",
    ...globalStyle.color.gacDarkblue
  }
})
