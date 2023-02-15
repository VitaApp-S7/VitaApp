import PageEvent from '../screens/page-event/page-event';
import PageNews from '../screens/page-news/page-news';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PageEventDetails from '../screens/page-event-details/page-event-details';
import { buildCodeAsync } from 'expo-auth-session/build/PKCE';
import { useIsFocused } from '@react-navigation/native';
import PageNewsDetails from '../screens/page-news-details/page-news-details';
import PageAccount from '../screens/page-account/page-account';
import PageHome from '../screens/page-home/page-home';
import Ionicons from "react-native-vector-icons/Ionicons";
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PageHistory from '../screens/page-history/page-history';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const Home = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={PageHome}  options={({ navigation, route }) => ({
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Account")}>
                <Ionicons
                  name="person-circle"
                  size={32}
                  color="#052D40"
                />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Ionicons
                  name="time"
                  size={32}
                  color="#052D40"
                />
              </TouchableOpacity>
            </View>
          ),
          headerTitleAlign: "center",
        })} />
            <Stack.Screen name="Account" component={PageAccount} options={{ headerShown: true }}/>
            <Stack.Screen name="History" component={PageHistory} options={{ headerShown: true }}/>
        </Stack.Navigator>
    )
}

export default Home;
