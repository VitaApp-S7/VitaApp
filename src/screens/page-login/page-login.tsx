import React, { useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  ResponseType
} from "expo-auth-session"
import * as SecureStore from "expo-secure-store"
import { checkUser, getUser, SetExpo } from "../../services/userService"
// import * as Linking from "expo-linking"
import Intrologo from "../../../assets/intrologo.svg"
import {
  useFonts,
  Poppins_500Medium as Poppins500Medium,
  Poppins_700Bold as Poppins700Bold,
  Poppins_600SemiBold as Poppins600SemiBold
} from "@expo-google-fonts/poppins"
import * as Notifications from "expo-notifications"
import { AppContext } from "../../context/AppContext"
import Constants from "expo-constants"

const PageLogin = () => {
  const { login } = useContext(AppContext)

  const [ fontsLoaded ] = useFonts({
    Poppins500Medium,
    Poppins700Bold,
    Poppins600SemiBold
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container}>
      <Intrologo />
      <View style={styles.bottomcontainer}>
        <TouchableOpacity
          style={styles.loginbutton}
          onPress={async () => {
            await login()
          }}
        >
          <Text style={styles.buttontext}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
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

export default PageLogin
