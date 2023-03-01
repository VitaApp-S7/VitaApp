import { useContext, useEffect, useState } from "react"
import React from "react"
import { Text, StyleSheet, ScrollView } from "react-native"
import { getAllCompletedActivities } from "../../services/moodboosterService"
import { AuthContext } from "../../context/AuthContext"
import { Card, Paragraph } from "react-native-paper"

const PageHistory = () => {
  const [ completedData, setCompletedData ] = useState([])

  const handleActivities = async () => {
    const completedActivities = await getAllCompletedActivities(accessToken)
    // console.log(completedActivities)
    setCompletedData(await completedActivities.reverse())
  }

  useEffect(() => {
    handleActivities()
  }, [])
  const { accessToken } = useContext(AuthContext)

  return (
    <ScrollView>
      {completedData.map((item, index) => (
        <Card
          style={styles.surface}
          mode="outlined"
          theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
          key={index}
        >
          <Card.Content>
            <Paragraph style={styles.title}>
              {new Date(item.completionDate).toDateString()}
            </Paragraph>
            <Text style={styles.description}>
              {item.moodbooster.description}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
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
