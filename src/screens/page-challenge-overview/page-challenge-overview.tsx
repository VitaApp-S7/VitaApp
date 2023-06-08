import {
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View
} from "react-native"
import React, { useContext, useState } from "react"
import BackgroundShape from "../../components/backgroundShape"
import { useTeamsQuery } from "../../queries/TeamQueries"
import ButtonPrimary from "../../components/ButtonPrimary"
import { useTeamJoinMutation } from "../../mutations/TeamMutations"
import PieChart from "../../components/PieChart"
import { AppContext } from "../../context/AppContext"

const TeamComponent = ({ item }) => {
  const mutation = useTeamJoinMutation(item.data.id)
  const { teamQuery } = useTeamsQuery(item.data.challengeId)

  const { user } = useContext(AppContext)

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        marginHorizontal: 15
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row"
        }}
      >
        <View
          style={{
            borderRadius: 99999,
            backgroundColor: item.color,
            height: 75,
            width: 75
          }}
        />
        <View
          style={{
            alignSelf: "flex-start",
            flex: 1,
            flexDirection: "column",
            marginLeft: 15
          }}
        >
          <Text style={styles.teamTitle}>{item.data.name}</Text>
          <Text>{item.data.participants.length} members</Text>
        </View>
      </View>
      {!item.data.participants.some((participant) =>
        user.id.endsWith(participant.userId)
      ) ? (
          <ButtonPrimary
            text={"JOIN"}
            onPress={async () => {
              await mutation.mutateAsync()
              await teamQuery.refetch()
            }}
          ></ButtonPrimary>
        ) : null}
    </View>
  )
}

const PageChallengeOverview = ({ route }) => {
  const [ refreshing, setRefreshing ] = useState(false)

  const { teamQuery } = useTeamsQuery(route.params.challenge.id)

  const colors = [ "#4B5AAC", "#FF5B18", "#4CBD3A" ]

  let series = (teamQuery.data != null ? teamQuery.data : []).map(
    (data, index) => {
      return {
        data: data,
        color: colors[index]
      }
    }
  )
  series.sort((a, b) => b.data.score - a.data.score)

  if (series.length == 0) {
    series = [
      {
        data: {
          id: "0",
          score: 1,
          name: "",
          challengeId: "",
          participants: [],
          reward: ""
        },
        color: colors[0]
      },
      {
        data: {
          id: "1",
          score: 1,
          name: "",
          challengeId: "",
          participants: [],
          reward: ""
        },
        color: colors[1]
      },
      {
        data: {
          id: "2",
          score: 1,
          name: "",
          challengeId: "",
          participants: [],
          reward: ""
        },
        color: colors[2]
      }
    ]
  }

  return (
    <View>
      <SectionList
        overScrollMode={"never"}
        sections={[
          {
            key: "teams",
            title: "Teams",
            data: series ?? []
          }
        ]}
        keyExtractor={(item) => item.data.id}
        renderItem={TeamComponent}
        ListHeaderComponent={<BackgroundShape />}
        renderSectionHeader={(props) => {
          if (props.section.key !== "teams") return <></>

          return (
            <View>
              <View
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 110,
                  marginBottom: 0,
                  width: 310,
                  height: 310,
                  flex: 1,
                  flexDirection: "row",
                  alignContent: "center"
                }}
              >
                <PieChart
                  coverRadius={0.6}
                  widthAndHeight={300}
                  series={series.map((s) => s.data.score)}
                  sliceColor={series.map((s) => s.color)}
                />
              </View>
              <Text style={styles.title}>{props.section.title}</Text>
            </View>
          )
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

export default PageChallengeOverview

const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 18,
    color: "#052D40",
    paddingLeft: 16,
    paddingTop: 16,
    width: "70%"
  },
  teamTitle: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 18,
    color: "#052D40",
    width: "70%"
  }
})
