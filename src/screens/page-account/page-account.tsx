import React, { useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { AppContext } from "../../context/AppContext"

const PageAccount = () => {
  const { logout } = useContext(AppContext)

  return (
    <View style={styles.bottomcontainer}>
      <TouchableOpacity
        style={styles.loginbutton}
        onPress={() => {
          logout()
        }}
      >
        <Text style={styles.buttontext}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  )
}

export default PageAccount

const styles = StyleSheet.create({
  loginbutton: {
    backgroundColor: "#052D40",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
    width: "80%",
    margin: 4
  },
  buttontext: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 14,
    margin: 8,
    color: "white"
  },
  bottomcontainer: {
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%"
  }
})
