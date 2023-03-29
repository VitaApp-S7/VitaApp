import React, { useContext, useEffect, useState } from "react"
import {
  RefreshControl,
  ScrollView,
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
import NativeWebView from "../../components/Webview/nativeWebView"
import { useQuery } from "@tanstack/react-query"
import NewsType from "../../types/NewsType"

const PageNews = ({ navigation }) => {
  const { accessToken } = useContext(AppContext)
  const [ refreshing, setRefreshing ] = useState(false)

  const { refetch, data, isSuccess } = useQuery<NewsType[]>(
    [ "news" ],
    async () => {
      const response = await getNews(accessToken)
      return response.data
    }
  )

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
    <ScrollView
      style={styles.screen}
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
    >
      <View style={{ minHeight: 300 }}>
        <Bg style={styles.wave} />
        <Text style={styles.moodtitle}>Latest news</Text>

        {isSuccess ? (
          data.map((item, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                onPress={() => handleOnPress(item)}
                style={{ width: "100%" }}
              >
                <View style={styles.wrapperTop}>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
                <NativeWebView />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.description}>No news found</Text>
        )}
      </View>
    </ScrollView>
  )
}

export default PageNews

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    height: 1000
  },
  card: {
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
