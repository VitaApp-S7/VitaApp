import React, { useContext, useState } from "react"
import { Card, Subheading, Title } from "react-native-paper"
import {
  RefreshControl,
  SectionList,
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
import ButtonPrimary from "../../components/buttons/ButtonPrimary"

import parseDate from "../../services/dataParser"
import { AppContext } from "../../context/AppContext"
import { useQuery } from "@tanstack/react-query"
import EventType from "../../types/EventType"
import ButtonTertiary from "../../components/buttons/ButtonTertiary"
import Ionicons from "@expo/vector-icons/Ionicons"

const PageEvent = ({ navigation }) => {
  const { accessToken, user } = useContext(AppContext)
  const [ refreshing, setRefreshing ] = useState(false)

  const setSortedListData = (data) => {
    setListData(
      createData(
        sortData(data.filter((evt) => evt.userIds.includes(user.id))),
        sortData(data.filter((evt) => !evt.userIds.includes(user.id)))
      )
    )
  }

  const sortData = (data) =>
    data.sort((evt, other) => -evt.date.localeCompare(other.date))

  const createData = (joined, notJoined) => {
    return [
      {
        key: "joined",
        title: "Signed Up",
        data: sortData(joined),
        emptyText: "Haven't signed up for any events"
      },
      {
        key: "not-joined",
        title: "Available",
        data: sortData(notJoined),
        emptyText: "No events available anymore"
      }
    ]
  }

  const { data, refetch } = useQuery<EventType[]>(
    [ "events" ],
    async () => (await getEvents(accessToken)).data,
    { onSuccess: setSortedListData }
  )

  const [ listData, setListData ] = useState(
    createData(
      (data ? data : []).filter((evt) => evt.userIds.includes(user.id)),
      (data ? data : []).filter((evt) => !evt.userIds.includes(user.id))
    )
  )

  const handleOnPress = (item: any) => {
    navigation.navigate("Event Details", { item })
  }

  const joinEventOnPress = async (id) => {
    const response = await joinEvent(accessToken, id)
    if (response.status === 200) {
      setSortedListData(
        data.map((evt) => {
          if (evt.id !== id) return evt

          evt.userIds.push(user.id)
          return evt
        })
      )
      await refetch()
    }
  }

  const leaveEventOnPress = async (id) => {
    const response = await leaveEvent(accessToken, id)
    if (response.status === 200) {
      setSortedListData(
        data.map((evt) => {
          if (evt.id !== id) return evt

          evt.userIds = evt.userIds.filter((userId) => userId !== user.id)
          return evt
        })
      )
      await refetch()
    }
  }

  // fonts
  useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  return (
    <View style={styles.screen}>
      <Bg style={styles.wave} />

      <SectionList
        sections={listData}
        keyExtractor={(item) => item.id}
        renderItem={(props) => (
          <Card
            style={styles.surface}
            mode="outlined"
            theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
            key={props.item.id}
          >
            <TouchableOpacity
              onPress={() => handleOnPress(props.item)}
              style={{ width: "100%" }}
            >
              <Card.Title
                style={styles.title}
                title={<Title style={styles.title}>{props.item.title}</Title>}
                right={() => (
                  <Subheading style={styles.date}>
                    {parseDate(props.item.date)}
                  </Subheading>
                )}
                titleNumberOfLines={3}
              />
            </TouchableOpacity>
            <Card.Actions style={styles.buttons}>
              <View style={styles.joined}>
                <Text style={styles.description}>
                  {props.item.userIds.length}/20
                </Text>
                <Ionicons
                  style={styles.icon}
                  name="people"
                  size={24}
                  color="#031D29"
                />
              </View>
              {props.section.key === "joined" ? (
                <TertiaryBtn
                  text="LEAVE"
                  onPress={async () => await leaveEventOnPress(props.item.id)}
                ></TertiaryBtn>
              ) : (
                <PrimaryBtn
                  text="JOIN"
                  onPress={async () => await joinEventOnPress(props.item.id)}
                ></PrimaryBtn>
              )}
            </Card.Actions>
          </Card>
        )}
        renderSectionHeader={(props) => {
          if (props.section.data.length === 0)
            return (
              <>
                <Text style={styles.moodtitle}>{props.section.title}</Text>
                <Text style={styles.text}>{props.section.emptyText}</Text>
              </>
            )
          return (
            <>
              <Text style={styles.moodtitle}>{props.section.title}</Text>
            </>
          )
        }}
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
      />
    </View>
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
    paddingRight: 10,
    fontSize: 12,
    color: "#031D29"
  },
  icon: { paddingHorizontal: 8 },
  wave: {
    position: "absolute",
    backgroundColor: "white"
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
    paddingLeft: 20
  }
})
