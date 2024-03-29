import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import React from "react"
import parseDate from "../../utility/DataParser"
import OpenURLButton from "../../components/OpenURLButton"
import RichTextViewer from "../../components/RichTextViewer"

const PageNewsDetails = ({ route }) => {
  const { item } = route.params

  return (
    <ScrollView style={styles.screen}>
      <Image
        source={require("../../../assets/header.png")}
        style={styles.header}
      ></Image>
      <View style={styles.wrapper}>
        <View>
          <View style={styles.wrapperTop}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{parseDate(item.date)}</Text>
          </View>
          {item.url && <OpenURLButton url={item.url}>{item.url}</OpenURLButton>}
          <RichTextViewer
            html={item.description}
            queryKey={`eventhtml${item.id}`}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default PageNewsDetails

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4
  }
})
