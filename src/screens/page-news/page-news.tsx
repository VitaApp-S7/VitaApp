import React, { useContext, useEffect, useState } from "react"
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
import { getNews } from "../../services/newsService"
import { AuthContext } from "../../context/AuthContext"
import Bg from "../../../assets/wave.svg"
import parseDate from "../../services/dataParser"

const PageNews = ({ navigation }) => {
  const [ news, setNews ] = useState([])
  const { accessToken } = useContext(AuthContext)

  useEffect(() => {
    handleData()
  }, [])

  const handleData = async () => {
    try {
      getNews(accessToken)
        .then((res) => res.data)
        .then((data) => {
          setNews(data)
        })
    } catch (err) {
      console.log("error fetching events : ", err)
    }
  }

  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  if (!fontsLoaded) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const wave = require("../../../assets/wave.png")

  const handleOnPress = (item: any) => {
    navigation.navigate("News Details", { item })
  }

  return (
    <ScrollView style={styles.screen}>
      <Bg style={styles.wave} />
      <Text style={styles.moodtitle}>Latest news</Text>

      {news.map((item, index) => (
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
        </View>
      ))}
    </ScrollView>
  )
}

export default PageNews

const styles = StyleSheet.create({
  screen: { backgroundColor: "white" },
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
  wave: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
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
  }
})
