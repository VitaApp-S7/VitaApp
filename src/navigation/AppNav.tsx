import React, { useContext } from "react"
import { NavigationContainer } from "@react-navigation/native"
import WelcomeStack from "./WelcomeStack"
import AuthNav from "./AuthNav"
import { AuthContext } from "../context/AuthContext"

const AppNav = () => {
  const { accessToken } = useContext(AuthContext)

  return (
    <NavigationContainer>
      {accessToken !== null ? <WelcomeStack /> : <AuthNav />}
    </NavigationContainer>
  )
}

export default AppNav
