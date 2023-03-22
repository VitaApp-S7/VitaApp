import React, { useContext } from "react"
import { NavigationContainer } from "@react-navigation/native"
import WelcomeStack from "./WelcomeStack"
import AuthNav from "./AuthNav"
import TestPage from "../components/Notifications/Notification"
import { AppContext } from "../context/AppContext"

const AppNav = () => {
  const { accessToken } = useContext(AppContext)

  return (
    <NavigationContainer>
      <TestPage />
      {accessToken !== null ? <WelcomeStack /> : <AuthNav />}
    </NavigationContainer>
  )
}

export default AppNav
