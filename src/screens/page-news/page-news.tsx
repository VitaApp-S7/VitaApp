import React, { useState } from "react"
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
import { Card, Subheading, Title } from "react-native-paper"
import parseDate from "../../utility/DataParser"
import { useNewsQuery } from "../../queries/FeedQueries"
import { ListItemAnimation } from "../../animations/ListItemAnimation"
import BackgroundShape from "../../components/backgroundShape"
import { globalStyle } from "../../globalStyle"

const PageNews = ({ navigation }) => {
  const [ refreshing, setRefreshing ] = useState(false)

  const news = useNewsQuery()

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
      <BackgroundShape />
      <Text style={[ globalStyle.text.title, styles.moodtitle ]}>
        Latest news
      </Text>

      <FlatList
        data={news.data}
        renderItem={(props) => (
          <ListItemAnimation elementHeight={79} isExiting={false}>
            <Card style={styles.surface} key={props.item.id}>
              <TouchableOpacity
                onPress={() => handleOnPress(props.item)}
                style={{ width: "100%" }}
              >
                <Card.Title
                  style={styles.title}
                  title={
                    <Title style={globalStyle.text.cardTitle}>
                      {props.item.title}
                    </Title>
                  }
                  right={() => (
                    <Subheading
                      style={[ globalStyle.text.subText, { paddingRight: 10 }]}
                    >
                      {parseDate(props.item.date)}
                    </Subheading>
                  )}
                />
              </TouchableOpacity>
            </Card>
          </ListItemAnimation>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true)
              await news.refetch()
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
    marginVertical: 6,
    padding: 0,
    ...globalStyle.boxShadow.defaultShadow,
    backgroundColor: "#FFFFFF",
    elevation: 3
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    color: "#031D29"
  },
  moodtitle: {
    marginVertical: 8,
    color: "#031D29",
    paddingLeft: 20
  }
})
