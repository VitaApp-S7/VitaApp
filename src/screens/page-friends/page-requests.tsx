import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native"
import React, { useContext, useState } from "react"
import { Card, Paragraph } from "react-native-paper"
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import { AppContext } from "../../context/AppContext"
import {
  acceptFrRequest,
  cancelFrRequest
} from "../../services/friendsService"
import Bg from "../../../assets/wave.svg"
import ButtonPrimary from "../../components/ButtonPrimary"
import ButtonSecondary from "../../components/ButtonSecondary"
import { useQueryClient } from "@tanstack/react-query"
import { useFriendRequestsQuery } from "../../queries/FriendQueries"

const PageRequests = () => {
  const { accessToken } = useContext(AppContext)

  const [ refreshing, setRefreshing ] = useState(false)

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
              await queryClient.invalidateQueries([ "friendRequests" ])
              setRefreshing(false)
            }}
          />
        }
      >
        <Bg style={styles.wave} />
        <View>
          {requestsQuery.isSuccess && requestsQuery.data.length > 0 ? (
            requestsQuery.data.map((item) => (
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
            ))
          ) : (
            <Text style={styles.description}>No requests yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PageRequests

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  screen: { backgroundColor: "white" },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  surface: {
    borderRadius: 5,
    paddingRight: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    fontFamily: "Poppins600SemiBold"
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
    width: "70%"
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
  description: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4,
    paddingLeft: 12
  }
})
