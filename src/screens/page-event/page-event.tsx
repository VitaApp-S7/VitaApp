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
import { joinEvent, leaveEvent } from "../../services/eventService"
import Bg from "../../../assets/wave.svg"
import ButtonPrimary from "../../components/ButtonPrimary"

import parseDate from "../../utility/DataParser"
import { AppContext } from "../../context/AppContext"
import ButtonTertiary from "../../components/ButtonTertiary"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useEventsQuery } from "../../queries/EventQueries"
import { useNavigation } from "@react-navigation/native"
import { useQueryClient } from "@tanstack/react-query"
import { BetterListItemAnimation } from "../../animations/BetterListItemAnimation"

const EventCard = ({ item, section }) => {
  const navigation = useNavigation()
  const { accessToken } = useContext(AppContext)
  const queryClient = useQueryClient()
  const [ isExiting, setIsExiting ] = useState(false)

  return (
    <BetterListItemAnimation elementHeight={156} isExiting={isExiting}>
      <Card
        style={styles.surface}
        mode="outlined"
        theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
        key={item.id}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Event Details", { item })
          }}
          style={{ width: "100%" }}
        >
          <Card.Title
            style={styles.title}
            title={<Title style={styles.title}>{item.title}</Title>}
            right={() => (
              <Subheading style={styles.date}>
                {parseDate(item.date)}
              </Subheading>
            )}
            titleNumberOfLines={3}
          />
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
          {section.key === "joined" ? (
            <ButtonTertiary
              text="LEAVE"
              onPress={async () => {
                const response = await leaveEvent(accessToken, item.id)
                if (response.status === 200) {
                  setIsExiting(true)
                  await queryClient.invalidateQueries([ "events" ])
                }
              }}
            ></ButtonTertiary>
          ) : (
            <ButtonPrimary
              text="JOIN"
              onPress={async () => {
                const response = await joinEvent(accessToken, item.id)
                if (response.status === 200) {
                  setIsExiting(true)
                  await queryClient.invalidateQueries([ "events" ])
                }
              }}
            ></ButtonPrimary>
          )}
        </Card.Actions>
      </Card>
    </BetterListItemAnimation>
  )
}

const PageEvent = () => {
  const [ refreshing, setRefreshing ] = useState(false)

  const { events, listData } = useEventsQuery()

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
          <EventCard item={props.item} section={props.section} />
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
              await events.refetch()
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
