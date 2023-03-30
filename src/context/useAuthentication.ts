import { useEffect, useMemo, useState } from "react";
import UserType from "../types/UserType";
import { checkUser, getUser, SetExpo } from "../services/userService";
import {
  ResponseType,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

let initialized = false

interface useAuthenticationType {
  accessToken: string;
  user: UserType;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthentication = (expoToken) => {
  const [ user, setUser ] = useState<UserType>(null)
  const [ accessToken, setAccessToken ] = useState<string>()
  useEffect(() => {
    if (expoToken !== null && user !== null && expoToken !== user.expoToken) {
      SetExpo(accessToken, expoToken)
    }
  }, [ expoToken, user ])

  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/913b1a98-9696-4db5-b548-9e17b6d3fc68/v2.0"
  )
  const redirectUri = useMemo(() => {
    switch (Platform.OS) {
    case "android":
      if (__DEV__)
        return "msauth://nl.gac.vitaapp/Xo8WBi6jzSxKDVR4drqm84yr9iU="
      else return "msauth://nl.gac.vitaapp/pOfkb4mKTCKio00pJyNy6QjAp1k="
    case "ios":
      return "msauth.nl.gac.vitaapp://auth"
    }
  }, [])

  const [ request, response, promptAsync ] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "215b09e4-54cb-49aa-837b-546f73fc29f6",
      scopes: [
        "openid",
        "profile",
        "email",
        "offline_access",
        "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"
      ],
      redirectUri: redirectUri
    },
    discovery
  )

  if (!initialized) {
    initialized = true
    SecureStore.getItemAsync("token")
      .then(async (token) => {
        await checkUser(token)
        setUser(JSON.parse(await SecureStore.getItemAsync("User")))
        setAccessToken(token)
        setUser(await getUser(token))
        await SecureStore.setItemAsync("user", JSON.stringify(user))
      })
      .catch(async () => {
        Toast.show({
          type: "info",
          text1: "Couldn't get previous login information",
          text2: "Please try logging in yourself",
          position: "bottom"
        })
        setUser(null)
        setAccessToken(null)
      })
  }
  const login = async () => {
    await promptAsync()
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync("token")
    setAccessToken(null)
    setUser(null)
  }

  useEffect(() => {
    if (response && response.type === "success") {
      checkUser(response.params.access_token)
        .then(async () => await getUser(response.params.access_token))
        .then(async (newUser) => {
          setUser(newUser)
          await SecureStore.setItemAsync("user", JSON.stringify(newUser))
        })
        .then(async () => {
          setAccessToken(response.params.access_token)
          await SecureStore.setItemAsync("token", response.params.access_token)
        })
        .catch((reason) => console.log(`Error during login: ${reason}`))
    }
  }, [ response ])

  return useMemo<useAuthenticationType>(() => {
    return {
      accessToken,
      user,
      login,
      logout
    }
  }, [ user, accessToken ])
}

export default useAuthentication
