import {
  Image,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View
} from "react-native"
import React, { useEffect, useState } from "react"
import { useTeamsQuery } from "../../queries/TeamQueries"
import BackgroundShape from "../../components/backgroundShape"
import { ParticipantType } from "../../types/ChallengeType"
import { globalStyle } from "../../globalStyle"

const LeaderBoardItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.wrapperTop}>
      <View style={styles.joined}>
        <Image
          style={styles.pfp}
          source={require("../../../assets/hairyFriendAvatar.png")}
        />
        <Text style={[ globalStyle.text.cardTitle, styles.cardTitle ]}>
          {item.name}
        </Text>
      </View>
      <Text style={[ globalStyle.text.cardTitle, styles.cardScore ]}>
        {item.score}
      </Text>
    </View>
  </View>
)

const TopThreeItem = (props: {
  participant: ParticipantType;
  size: number;
  position: number;
}) => {
  return (
    <View style={{
      alignSelf: props.position == 1 ? "flex-start" : "flex-end",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      width: props.size + 10
    }}>
      <Text style={[ globalStyle.text.title ]}>{props.position}</Text>
      <Image
        style={[
          styles.topThree, {
            width: props.size,
            height: props.size
          }
        ]}
        source={require("../../../assets/hairyTopThree.png")}
      />
      <Text style={[ globalStyle.text.title, { marginTop: 0 }]}>{props.participant.score ?? 0}</Text>
      <Text style={[ globalStyle.text.cardTitle, { opacity: 0.74 }]}>{props.participant.name ?? ""}</Text>
    </View>

  )
}

const SectionHeader = (topThree: ParticipantType[]) => {
  const first = topThree[0] ?? {
    id: "1",
    score: 0,
    name: "",
    userId:"" 
  }
  const second = topThree[1] ?? {
    id: "1",
    score: 0,
    name: "",
    userId:"" 
  }
  const third = topThree[2] ?? {
    id: "1",
    score: 0,
    name: "",
    userId:"" 
  }

  return (
    <View
      style={{
        display: "flex",
        marginTop: 90,
        marginBottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
        height: 250
      }}
    >
      <TopThreeItem participant={second} size={100} position={2}></TopThreeItem>
      <TopThreeItem participant={first} size={125} position={1}></TopThreeItem>
      <TopThreeItem participant={third} size={100} position={3}></TopThreeItem>
    </View>
  )
}

const PageLeaderboard = ({ route }) => {
  const [ refreshing, setRefreshing ] = useState(false)

  const [ leaderBoardItems, setLeaderBoardItems ] = useState<ParticipantType[]>(
    []
  )

  const [ topThree, setTopThree ] = useState<ParticipantType[]>([])

  const { teamQuery } = useTeamsQuery(route.params.challenge.id)

  useEffect(() => {
    if (teamQuery.isSuccess) {
      const allParticipants = teamQuery.data
        .map((t) => t.participants)
        .reduce((x, y) => x.concat(y))
        .sort((x, y) => y.score - x.score)
      setTopThree(allParticipants.slice(0, 3))
      if (allParticipants.length > 3) {
        setLeaderBoardItems(allParticipants.slice(-allParticipants.length + 3))
      }
    }
  }, [ teamQuery.data ])

  return (
    <View>
      <SectionList
        overScrollMode={"never"}
        sections={[
          {
            key: "leaderboard",
            title: "Leaderboard",
            data: leaderBoardItems ?? []
          }
        ]}
        keyExtractor={(item) => item.score}
        renderItem={LeaderBoardItem}
        ListHeaderComponent={<BackgroundShape />}
        renderSectionHeader={(props) => {
          if (props.section.key !== "leaderboard") return <></>
          return SectionHeader(topThree)
        }}
        refreshControl={
          <RefreshControl
            style={{ zIndex: 5 }}
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true)
              await teamQuery.refetch()
              setRefreshing(false)
            }}
          />
        }
      />
    </View>
  )
}

export default PageLeaderboard

const styles = StyleSheet.create({
  pfp: {
    height: 56,
    width: 56,
    marginBottom: -6,
    borderRadius: 999,
    backgroundColor: "white"
  },
  topThree: {},
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 6,
    paddingHorizontal: 12,
    ...globalStyle.boxShadow.defaultShadow,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 3
  },
  joined: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  cardTitle: {
    paddingLeft: 12,
    paddingTop: 6,
    width: "70%"
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    margin: 8
  },
  title: {
    fontFamily: "Poppins700SemiBold",
    fontSize: 16,
    color: "#052D40",
    paddingLeft: 12,
    paddingTop: 16,
    width: "70%"
  },
  cardScore: {
    fontFamily: "Poppins700Bold",
    paddingTop: 6,
    paddingRight: 20
  }
})
