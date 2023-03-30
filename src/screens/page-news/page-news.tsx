import React, { useContext, useState } from "react"
import {
  FlatList,
  RefreshControl,
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
import { getNews } from "../../services/newsService"
import { AppContext } from "../../context/AppContext"
import Bg from "../../../assets/wave.svg"
import { useQuery } from "@tanstack/react-query"
import NewsType from "../../types/NewsType"
import { Card, Subheading, Title } from "react-native-paper"
import Ionicons from "@expo/vector-icons/Ionicons"
import ButtonPrimary from "../../components/buttons/ButtonPrimary"
import parseDate from "../../services/dataParser"

const PageNews = ({ navigation }) => {
  const { accessToken } = useContext(AppContext)
  const [ refreshing, setRefreshing ] = useState(false)

  const { refetch, data } = useQuery<NewsType[]>([ "news" ], async () => {
    const response = await getNews(accessToken)
    return response.data.sort(
      (news, other) => -news.date.localeCompare(other.date)
    )
  })

  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular
  })

  if (!fontsLoaded) {
    return null
  }

  const handleOnPress = (item) => {
    navigation.navigate("News Details", { item })
  }

  return (
    <View style={styles.screen}>
      <Bg style={styles.wave} />
      <Text style={styles.moodtitle}>Latest news</Text>

      <FlatList
        data={data}
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
              />
            </TouchableOpacity>
          </Card>
        )}
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

export default PageNews

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    height: 1000,
    minHeight: 300
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 0,
    fontFamily: "Poppins600SemiBold",
    backgroundColor: "#FFFFFF"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    color: "#031D29"
  },
  date: {
    fontFamily: "Poppins700Bold",
    margin: 0,
    padding: 0,
    paddingRight: 10,
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
  moodtitle: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 20,
    marginVertical: 8,
    color: "#031D29",
    paddingLeft: 20
  }
})
