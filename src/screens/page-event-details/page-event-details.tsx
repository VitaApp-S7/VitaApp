import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import parseDate from "../../services/dataParser"
import React from "react"
import OpenURLButton from "../../components/OpenURLButton"
import TrixHtmlView from "../../components/Webview/trixHtmlView"

const PageEventDetails = ({ route }) => {
  const { item } = route.params

  return (
    <ScrollView style={styles.screen}>
      <Image
        source={require("../../../assets/header.png")}
        style={styles.header}
      ></Image>
      <View style={styles.wrapper}>
        <View style={styles.wrapperTop}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{parseDate(item.date)}</Text>
        </View>
        {item.url && <OpenURLButton url={item.url}>{item.url}</OpenURLButton>}
        <TrixHtmlView html={item.description} queryKey={`eventhtml${item.id}`} />
      </View>
    </ScrollView>
  )
}

export default PageEventDetails

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 200
  },
  wrapper: { margin: 16 },
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
  screen: {
    backgroundColor: "white",
    height: "100%"
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4
  }
})
