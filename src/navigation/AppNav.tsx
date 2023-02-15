import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeStack from "./WelcomeStack";
import AuthNav from "./AuthNav";
import { AuthContext } from "../context/AuthContext";
import TestPage from "../components/Notifications/Notification";

const AppNav = () => {
  const { accessToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <TestPage />
      {accessToken !== null ? <WelcomeStack /> : <AuthNav />}
    </NavigationContainer>
  );
};

export default AppNav;
