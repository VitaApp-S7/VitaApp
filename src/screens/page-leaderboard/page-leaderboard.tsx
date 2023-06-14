import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native"
import React, { useMemo, useState } from "react"
import Bg from "../../../assets/wave.svg"
import { useTeamsQuery } from "../../queries/TeamQueries"

const PageLeaderboard = ({ route }) => {
  const [ refreshing, setRefreshing ] = useState(false)

  const { teamQuery } = useTeamsQuery(route.params.challenge.id)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true)
              setRefreshing(false)
            }}
          />
        }
      >
        <Bg style={styles.wave} />
        <View>
          <>

          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PageLeaderboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
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
    paddingVertical: 4,
    paddingLeft: 12
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
  }
})
