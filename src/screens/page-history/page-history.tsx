import React, { useState } from "react"
import { FlatList, RefreshControl, StyleSheet, Text } from "react-native"
import { Card, Paragraph } from "react-native-paper"
import { useActivitiesCompletedQuery } from "../../queries/MoodboosterQueries"

const PageHistory = () => {
  const completedActivities = useActivitiesCompletedQuery()

  const [ refreshing, setRefreshing ] = useState(false)

  return (
    <FlatList
      data={completedActivities.data.reverse()}
      renderItem={(props) => (
        <Card
          style={styles.surface}
          mode="outlined"
          theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
          key={props.item.id}
        >
          <Card.Content>
            <Paragraph style={styles.title}>
              {new Date(props.item.completionDate).toDateString()}
            </Paragraph>
            <Text style={styles.description}>
              {props.item.moodbooster.description}
            </Text>
          </Card.Content>
        </Card>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await completedActivities.refetch()
            setRefreshing(false)
          }}
        />
      }
    />
  )
}

export default PageHistory

const styles = StyleSheet.create({
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    fontFamily: "Poppins600SemiBold",
    backgroundColor: "#FFFFFF"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 14,
    color: "#031D29"
  },
  description: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4
  }
})
