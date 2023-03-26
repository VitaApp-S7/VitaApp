import React, { useCallback, useContext, useState } from "react"
import { Card, Paragraph, Subheading, Title } from "react-native-paper"
import Ionicons from "@expo/vector-icons/Ionicons"
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import { getEvents, joinEvent, leaveEvent } from "../../services/eventService"
import Bg from "../../../assets/wave.svg"
import PrimaryBtn from "../../components/buttons/PrimaryBtn"

import parseDate from "../../services/dataParser"
import { AppContext } from "../../context/AppContext"
import { useQuery } from "@tanstack/react-query"
import EventType from "../../types/EventType"
import TertiaryBtn from "../../components/buttons/TertiaryBtn"

const PageEvent = ({ navigation }) => {
  const { accessToken, user } = useContext(AppContext)
  const [ refreshing, setRefreshing ] = useState(false)

  const { data, isSuccess, refetch } = useQuery<EventType[]>(
    [ "events" ],
    async () => {
      const response = await getEvents(accessToken)
      return response.data
    },
    {
      onSuccess: (data) => {
        setJoinedEvents(
          data.filter((event) => event.userIds.includes(user.id))
        )
        setNotJoinedEvents(
          data.filter((event) => !event.userIds.includes(user.id))
        )
      }
    }
  )

  const [ joinedEvents, setJoinedEvents ] = useState<EventType[]>(
    (data ? data : []).filter((event) => event.userIds.includes(user.id))
  )
  const [ notJoinedEvents, setNotJoinedEvents ] = useState<EventType[]>(
    (data ? data : []).filter((event) => !event.userIds.includes(user.id))
  )

  const handleOnPress = (item: any) => {
    navigation.navigate("Event Details", { item })
  }

  const joinEventOnPress = async (id) => {
    const response = await joinEvent(accessToken, id)
    if (response.status === 200) {
      setJoinedEvents([
        ...joinedEvents,
        ...notJoinedEvents.filter((event) => event.id === id)
      ])
      setNotJoinedEvents(notJoinedEvents.filter((event) => event.id !== id))
      await refetch()
    }
  }

  const leaveEventOnPress = async (id) => {
    const response = await leaveEvent(accessToken, id)
    if (response.status === 200) {
      setNotJoinedEvents([
        ...notJoinedEvents,
        ...joinedEvents.filter((event) => event.id === id)
      ])
      setJoinedEvents(joinedEvents.filter((event) => event.id !== id))
      await refetch()
    }
  }

  // fonts
  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  const RightCardTitle = useCallback(
    (item) => (props) =>
      (
        <Subheading style={styles.date}>
          {parseDate(item.date)}
          {<Text> </Text>}
        </Subheading>
      ),
    []
  )

  if (!fontsLoaded) {
    return null
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true)
              await refetch()
              setRefreshing(false)
            }}
          />
        }
      >
        <Bg style={styles.wave} />
        <Text style={styles.moodtitle}>Signed Up</Text>
        {isSuccess && joinedEvents.length > 0 ? (
          joinedEvents.map((item, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                onPress={() => handleOnPress(item)}
                style={{ width: "100%" }}
              >
                <View style={styles.wrapperTop}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.date}>{parseDate(item.date)}</Text>
                </View>
                <Text style={styles.description}>{item.description}</Text>
              </TouchableOpacity>

              <View style={styles.wrapperBottom}>
                <View style={styles.joined}>
                  <Text style={styles.description}>
                    {item.userIds.length}/20
                  </Text>
                  <Ionicons
                    style={styles.icon}
                    name="people"
                    size={24}
                    color="#031D29"
                  />
                </View>
                <TertiaryBtn
                  text={"LEAVE"}
                  onPress={async () => await leaveEventOnPress(item.id)}
                ></TertiaryBtn>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.text}>
            Haven&apos;t signed up for events yet.
          </Text>
        )}
        <Text style={styles.moodtitle}>Available</Text>
        {isSuccess && notJoinedEvents.length > 0 ? (
          notJoinedEvents.map((item, index) => (
            // <View key={index} style={styles.card}>
            //   <TouchableOpacity
            //     onPress={() => handleOnPress(item)}
            //     style={{ width: "100%" }}
            //   >
            //     <View style={styles.wrapperTop}>
            //       <Text style={styles.title}>{item.title}</Text>
            //       <Text style={styles.date}>{parseDate(item.date)}</Text>
            //     </View>
            //     <Text style={styles.description}>{item.description}</Text>
            //   </TouchableOpacity>

            //   <View style={styles.wrapperBottom}>
            //     <View style={styles.joined}>
            //       <Text style={styles.description}>{item.userIds.length}/20</Text>
            //       <Ionicons
            //         style={styles.icon}
            //         name="people"
            //         size={24}
            //         color="#031D29"
            //       />
            //     </View>
            //     <PrimaryBtn
            //       text="JOIN"
            //       onPress={() => joinEventOnPress(item.id)}
            //     ></PrimaryBtn>
            //   </View>
            // </View>

            <Card
              style={styles.surface}
              mode="outlined"
              theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
              key={index}
            >
              <TouchableOpacity
                onPress={() => handleOnPress(item)}
                style={{ width: "100%" }}
              >
                <Card.Title
                  style={styles.title}
                  title={<Title style={styles.title}>{item.title}</Title>}
                  right={RightCardTitle(item)}
                  titleNumberOfLines={3}
                />
                <Card.Content>
                  <Paragraph numberOfLines={10} style={styles.description}>
                    {item.description}
                  </Paragraph>
                </Card.Content>
              </TouchableOpacity>
              <Card.Actions style={styles.buttons}>
                <View style={styles.joined}>
                  <Text style={styles.description}>
                    {item.userIds.length}/20
                  </Text>
                  <Ionicons
                    style={styles.icon}
                    name="people"
                    size={24}
                    color="#031D29"
                  />
                </View>
                <PrimaryBtn
                  text="JOIN"
                  onPress={async () => await joinEventOnPress(item.id)}
                ></PrimaryBtn>
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text>No events to join!</Text>
        )}
      </ScrollView>
    </>
  )
}

export default PageEvent

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    fontFamily: "Poppins600SemiBold",
    backgroundColor: "#FFFFFF"
  },
  screen: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    backgroundColor: "white"
  },
  joined: { flexDirection: "row" },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    color: "#031D29"
  },
  description: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4
  },
  date: {
    fontFamily: "Poppins700Bold",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#031D29"
  },
  icon: { paddingHorizontal: 8 },
  wave: {
    position: "absolute",
    backgroundColor: "white"
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4
  },
  wrapperBottom: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4
  },
  moodtitle: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 20,
    marginVertical: 8,
    color: "#031D29",
    paddingLeft: 20
  },
  text: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4,
    paddingLeft: 16
  }
})
