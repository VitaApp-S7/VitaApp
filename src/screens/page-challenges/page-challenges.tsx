import {
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View
} from "react-native"
import React, { useState } from "react"
import BackgroundShape from "../../components/backgroundShape"
import { useChallengesQuery } from "../../queries/ChallengeQueries"
import { ChallengeType } from "../../types/ChallengeType"
import { Card, Paragraph } from "react-native-paper"
import ButtonPrimary from "../../components/ButtonPrimary"
import { ListItemAnimation } from "../../animations/ListItemAnimation"
import { useNavigation } from "@react-navigation/native"
import { ChallengeStackProps } from "../../navigation/ChallengesNav"

const PageChallenges = () => {
  const [ refreshing, setRefreshing ] = useState(false)

  const { sectionList, challengeQuery } = useChallengesQuery()

  return (
    <View style={{ height: "100%" }}>
      <SectionList
        overScrollMode={"never"}
        keyExtractor={(item) => item.id}
        renderItem={ChallengeCard}
        sections={sectionList}
        renderSectionHeader={(props) => {
          if (props.section.key !== "active")
            return <Text style={styles.title}>{props.section.title}</Text>
          return (
            <>
              <View style={{ marginTop: 80 }}></View>
              <BackgroundShape />
              <Text style={styles.title}>{props.section.title}</Text>
            </>
          )
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true)
              await challengeQuery.refetch()
              setRefreshing(false)
            }}
          />
        }
      />
    </View>
  )
}

const ChallengeCard = ({
  item,
  section
}: {
  item: ChallengeType;
  section: any;
}) => {
  const [ isExiting, setIsExiting ] = useState(false)
  const navigator = useNavigation<ChallengeStackProps["navigation"]>()

  const now = new Date()
  const endDate = new Date(item.endDate)
  const startDate = new Date(item.startDate)

  return (
    <ListItemAnimation isExiting={isExiting}>
      <Card
        mode="outlined"
        style={styles.surface}
        theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
      >
        <Card.Title
          title={item.title}
          titleStyle={styles.cardTitle}
          subtitle={item.description}
          subtitleStyle={styles.catagory}
        ></Card.Title>
        <Card.Content>
          {section.key === "active" ? (
            // eslint-disable-next-line react-native/no-raw-text
            <Paragraph style={styles.date}>{`${Math.ceil(
              Math.abs(now.valueOf() - endDate.valueOf()) /
                (24 * 60 * 60 * 1000)
            )} days left`}</Paragraph>
          ) : null}
          {section.key === "upcoming" ? (
            // eslint-disable-next-line react-native/no-raw-text
            <Paragraph
              style={styles.date}
            >{`${startDate.toDateString()} until ${endDate.toDateString()}`}</Paragraph>
          ) : null}
          {section.key === "inactive" ? (
            // eslint-disable-next-line react-native/no-raw-text
            <Paragraph
              style={styles.date}
            >{`${startDate.toLocaleDateString()} until ${endDate.toLocaleDateString()}`}</Paragraph>
          ) : null}
        </Card.Content>
        <Card.Actions>
          {section.key === "active" ? (
            <ButtonPrimary
              text="JOIN"
              onPress={() =>
                navigator.navigate("Challenge overview", { challenge: item })
              }
            />
          ) : null}
          {section.key === "upcoming" ? (
            <ButtonPrimary
              text="VIEW"
              onPress={() =>
                navigator.navigate("Challenge overview", { challenge: item })
              }
            />
          ) : null}
          {section.key === "inactive" ? (
            <ButtonPrimary
              text="VIEW"
              onPress={() =>
                navigator.navigate("Challenge overview", { challenge: item })
              }
            />
          ) : null}
        </Card.Actions>
      </Card>
    </ListItemAnimation>
  )
}

export default PageChallenges

const styles = StyleSheet.create({
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
    fontSize: 18,
    color: "#052D40",
    paddingLeft: 17,
    paddingTop: 16,
    width: "70%"
  },
  description: {
    fontFamily: "Poppins400Regular",
    margin: 0,
    padding: 0,
    fontSize: 16,
    color: "#052D40"
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
  },
  buttons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  catagory: {
    fontFamily: "Poppins400Regular",
    fontSize: 15,
    color: "#031D29"
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    fontFamily: "Poppins600SemiBold",
    backgroundColor: "#FFFFFF"
  },
  cardTitle: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 16,
    lineHeight: 24,
    color: "#031D29",
    marginTop: 15
  },
  date: {
    marginTop: 49,
    marginBottom: -49,
    fontSize: 14,
    fontFamily: "Poppins500Medium"
  }
})
