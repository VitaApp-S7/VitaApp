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
import { ListItemAnimation } from "../../animations/ListItemAnimation"
import { sleep } from "../../utility/Sleep"
import BackgroundShape from "../../components/backgroundShape"
import { globalStyle } from "../../globalStyle"

const EventCard = ({ item, section }) => {
  const navigation = useNavigation()
  const { accessToken } = useContext(AppContext)
  const queryClient = useQueryClient()
  const [ isExiting, setIsExiting ] = useState(false)

  return (
    <ListItemAnimation elementHeight={156} isExiting={isExiting}>
      <Card style={styles.surface} key={item.id}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Event Details", { item })
          }}
          style={{ width: "100%" }}
        >
          <Card.Title
            style={styles.title}
            title={
              <Title style={globalStyle.text.cardTitle}>{item.title}</Title>
            }
            right={() => (
              <Subheading style={[ globalStyle.text.subText, styles.date ]}>
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
                  sleep(500)
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
                  sleep(500)
                }
              }}
            ></ButtonPrimary>
          )}
        </Card.Actions>
      </Card>
    </ListItemAnimation>
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
      <BackgroundShape />

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
                <Text style={[ globalStyle.text.title, styles.moodtitle ]}>
                  {props.section.title}
                </Text>
                <Text style={[ globalStyle.text.description, styles.text ]}>
                  {props.section.emptyText}
                </Text>
              </>
            )
          return (
            <>
              <Text style={[ globalStyle.text.title, styles.moodtitle ]}>
                {props.section.title}
              </Text>
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
    backgroundColor: "#FFFFFF",
    ...globalStyle.boxShadow.defaultShadow,
    elevation: 3
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
    margin: 0,
    padding: 0,
    paddingRight: 10
  },
  icon: { paddingHorizontal: 8 },
  moodtitle: {
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
