import React, { useContext, useEffect, useState, useCallback } from "react"
import { Card, Paragraph, Subheading, Title } from "react-native-paper"
import Ionicons from "@expo/vector-icons/Ionicons"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native"

import {
  useFonts,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_400Regular as Poppins400Regular
} from "@expo-google-fonts/poppins"
import { getEvents, joinEvent, leaveEvent } from "../../services/eventService"
import Bg from "../../../assets/wave.svg"
import PrimaryBtn from "../../components/buttons/PrimaryBtn"
import * as SecureStore from "expo-secure-store"

import parseDate from "../../services/dataParser"
import { AppContext } from "../../context/AppContext"

const PageEvent = ({ navigation }) => {
  const { accessToken } = useContext(AppContext)
  const [ notJoinedEvents, setNotJoinedEvents ] = useState([])
  const [ joinedEvents, setJoinedEvents ] = useState([])
  const [ events, setEvents ] = useState([])

  useEffect(() => {
    eventsCallback()
  }, [ events ])

  const eventsCallback = useCallback(async () => {
    const arrayevents = await getEvents(accessToken)
    setEvents(arrayevents.data)
  }, [])

  useEffect(() => {
    joinedNotJoined()
  }, [ events ])

  const joinedNotJoined = async () => {
    const currentUser = JSON.parse(await SecureStore.getItemAsync("User"))
    const notjoined = events.filter(
      (event) => !event.userIds.includes(currentUser.id)
    ) //filter
    setNotJoinedEvents(notjoined)
    const joined = events.filter((event) =>
      event.userIds.includes(currentUser.id)
    ) //filter
    setJoinedEvents(joined)
  }

  const handleOnPress = (item: any) => {
    navigation.navigate("Event Details", { item })
  }

  const joinEventOnPress = async (id) => {
    const response = await joinEvent(accessToken, id)
    if (response.status === 200) {
      // alert
    }
  }

  const leaveEventOnPress = async (id) => {
    const response = await leaveEvent(accessToken, id)
    if (response.status === 200) {
      // alert
    }
  }

  // fonts
  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <ScrollView style={styles.screen}>
      <Bg style={styles.wave} />
      <Text style={styles.moodtitle}>Signed Up</Text>
      {joinedEvents.length ? (
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
                <Text style={styles.description}>{item.userIds.length}/20</Text>
                <Ionicons
                  style={styles.icon}
                  name="people"
                  size={24}
                  color="#031D29"
                />
              </View>
              <PrimaryBtn
                text={"LEAVE"}
                onPress={() => leaveEventOnPress(item.id)}
              ></PrimaryBtn>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.text}>Haven&apos;t signed up for events yet.</Text>
      )}
      <Text style={styles.moodtitle}>Available</Text>
      {notJoinedEvents ? (
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
              <Card.Title style={styles.title}
                title={<Title style={styles.title}>{item.title}</Title>}
                right={(props) => <Subheading style={styles.date}>{parseDate(item.date)}  </Subheading>}
                titleNumberOfLines={3}
              />
              <Card.Content >
                <Paragraph numberOfLines={10} style={styles.description}>{item.description}</Paragraph>
              </Card.Content>
            </TouchableOpacity>
            <Card.Actions style={styles.buttons}>
              <View style={styles.joined}>
                <Text style={styles.description}>{item.userIds.length}/20</Text>
                <Ionicons
                  style={styles.icon}
                  name="people"
                  size={24}
                  color="#031D29"
                />
              </View>
              <PrimaryBtn
                text="JOIN"
                onPress={() => joinEventOnPress(item.id)}
              ></PrimaryBtn>
            </Card.Actions>
          </Card>
          
        ))
      ) : (
        <Text>No events to join!</Text>
      )}
    </ScrollView>
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
    backgroundColor: "white"
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
  wave: { position: "absolute" },
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
