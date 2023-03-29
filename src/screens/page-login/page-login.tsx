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
  Constants.manifest.originalFullName = "@vitaapp/stuff"
  // Endpoint
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/913b1a98-9696-4db5-b548-9e17b6d3fc68/v2.0"
  )

  // const url = Linking.useURL()

  // Authentication Request
  // eslint-disable-next-line no-unused-vars
  const [ request, response, promptAsync ] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "50f18b4e-1a58-4004-b6b8-5a15e3a2e863",
      scopes: [
        "openid",
        "profile",
        "email",
        "offline_access",
        "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"
      ],
      redirectUri: makeRedirectUri({
        scheme:
          process.env.NODE_ENV === "production"
            ? "gacprjscheme"
            : "",
        useProxy: true,
        projectNameForProxy: "@vitaapp/stuff"
        //scheme: url,
      })
    },
    discovery
  )

  // Save values under keys in SecurStore
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value)
  }

  async function load(key) {
    return await SecureStore.getItemAsync(key)
  }

  const { login } = useContext(AppContext)

  //login function
  const handleLogin = async (token) => {
    const firstLogin = await checkUser(token)
    await save("FirstLogin", JSON.stringify(firstLogin))
    const user = await getUser(token)
    await save("User", JSON.stringify(user))
    await save("token", token)
    await login(token, user)
  }

  React.useEffect(() => {
    if (response && response.type === "success") {
      const accessToken = response.params.access_token

      if (accessToken != null) {
        handleLogin(accessToken)
      } else {
        // handle redirect error
        alert("Auth not working at the moment. Please try again later")
      }
    } else {
      load("token")
        .then((token) => handleLogin(token))
        .catch(() => {})
    }
  }, [ response ])

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
            console.log(request)
            await promptAsync({ useProxy: true })
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
