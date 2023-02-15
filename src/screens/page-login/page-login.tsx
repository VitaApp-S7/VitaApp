import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  ResponseType,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { checkUser, getUser, SetExpo } from "../../services/userService";
import { AuthContext } from "../../context/AuthContext";
import * as Linking from "expo-linking";
import Intrologo from "../../../assets/intrologo.svg";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import * as Notifications from 'expo-notifications';


const PageLogin = () => {
  // Endpoint
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/913b1a98-9696-4db5-b548-9e17b6d3fc68/v2.0"
  );

  const url = Linking.useURL();

  // Authentication Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "50f18b4e-1a58-4004-b6b8-5a15e3a2e863",
      scopes: [
        "openid",
        "profile",
        "email",
        "offline_access",
        "api://82b5a9e1-eaa2-4ee8-a3a0-7d3c41a4a1b5/User.All",
      ],
      redirectUri: makeRedirectUri({
         scheme: process.env.NODE_ENV === 'production' ?  'https://auth.expo.io/@vitaapp/stuff' : '',
         useProxy: true
        //scheme: url,
        
      }),

    },
    discovery
  );

  // Save values under keys in SecurStore
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  const { login } = useContext(AuthContext);

  //login function
  const handleLogin = async (token) => {
    const firstLogin = await checkUser(token);
    await save("FirstLogin", JSON.stringify(firstLogin)); //stringified because it gives an error message
    const user = await getUser(token);
    await save("User", JSON.stringify(user)) // user= id, nam, ... , mood
    await save("token", token);
    const expoToken = (await Notifications.getExpoPushTokenAsync({projectId:"5d6942ac-e779-47ab-885a-7d876e3ef01a"})).data;
    const cleanedToken = expoToken.replace("ExponentPushToken[", "").replace("]", "");
    await save("expoToken", expoToken);
    await SetExpo(token, cleanedToken);
    login(token)
}

  React.useEffect(() => {
    if (response && response.type === "success") {
      const access_token = response.params.access_token;

      if (access_token != null) {
        handleLogin(access_token);
      } else {
        // handle redirect error
        alert("Auth not working at the moment. Please try again later");
      }
    }
  }, [response]);

  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Intrologo style={styles.welcome} />
      <View style={styles.bottomcontainer}>
        <TouchableOpacity
          style={styles.loginbutton}
          onPress={() => {
            promptAsync({useProxy: true});
          }}
        >
          <Text style={styles.buttontext}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  welcome: {
    // height: "10%",
    // resizeMode: "contain",
  },
  loginbutton: {
    backgroundColor: "#052D40",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
    width: "80%",
    margin: 4,
  },
  buttontext: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    margin: 8,
    color: "white",
  },
  welcomecontainer: {
    // backgroundColor: "black",
    // flex: 1,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    width: "80%",
    height: "50%",
    margin: 4,
  },
  bottomcontainer: {
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
});

export default PageLogin;
