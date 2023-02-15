import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  RefreshControl,
  Image,
} from "react-native";
import { Card, Button, Paragraph } from "react-native-paper";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { __handlePersistedRegistrationInfoAsync } from "expo-notifications/build/DevicePushTokenAutoRegistration.fx";
import {
  acceptFrRequest,
  cancelFrRequest,
  getFrRequests,
} from "../../services/friendsService";
import Bg from "../../../assets/wave.svg";
import PrimaryBtn from "../../components/buttons/PrimaryBtn";
import SecondaryBtn from "../../components/buttons/SecondaryBtn";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const PageRequests = () => {
  const wave = require("../../../assets/wave.png");

  const { accessToken } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  //const [isRequests, setIsRequests] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await fetchFrRequests();

    if (res.status === 200) {
      setRequests(await res.data);
    }

    // setRefreshing(true);
    // setRefreshing(false);
  };

  const fetchFrRequests = async () => {
    try {
      return await getFrRequests(accessToken);
    } catch (err) {
      console.log("couldn't get friend requests", err);
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      const res = await cancelFrRequest(accessToken, id);
      if (res.status === 200) {
        setRequests(requests.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.log("request couldn't be cancelled", err);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const res = await acceptFrRequest(accessToken, id);
      if (res.status === 200) {
        setRequests(requests.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.log("request couldn't be accepted", err);
    }
  };

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.screen}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />
        }
      >
        <Bg style={styles.wave} />
        <View>
          {requests.length ? (
            requests.map((item, index) => (
              // <Card style={styles.surface} elevation={1} key={index}>
              //   <Card.Title title={item.name} />
              //   <Card.Actions>
              //     <Button mode="contained" onPress={() => handleAcceptRequest(item.id)}>Accept</Button>
              //     <Button mode="contained" onPress={() => handleCancelRequest(item.id)}>Cancel</Button>
              //   </Card.Actions>
              // </Card>
              <Card
                style={styles.surface}
                mode="outlined"
                theme={{
                  colors: {
                    outline: "rgba(0, 0, 0, 0)",
                  },
                }}
                key={index}
              >
                <Card.Content style={styles.cardcontent}>
                  <Image
                    style={styles.pfp}
                    source={require("../../../assets/pfp.png")}
                  ></Image>
                    <Paragraph style={styles.title}>
                      {item.name}
                    </Paragraph>
                </Card.Content>
                <Card.Actions style={styles.buttons}>
                  <SecondaryBtn
                    text={"DECLINE"}
                    onPress={() => handleCancelRequest(item.id)}
                  ></SecondaryBtn>
                  <PrimaryBtn
                    text={"ACCEPT"}
                    onPress={() => handleAcceptRequest(item.id)}
                  ></PrimaryBtn>
                </Card.Actions>
              </Card>
            ))
          ) : (
            <Text style={styles.description}>No requests yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PageRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  screen: {
    backgroundColor: "white",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  surface: {
    borderRadius: 5,
    paddingRight: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    fontFamily: "Poppins_600SemiBold",
  },
  touchcard: {},
  wave: {
    width: "100%",
    position: "absolute",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#052D40",
    paddingLeft: 12,
    width: "70%",
  },
  pfp: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 999,
    backgroundColor: "green",
  },
  cardcontent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textcontent: {
    marginLeft: 8,
    flexDirection: "column",
    width: "80%",
  },
  description: {
    fontFamily: "Poppins_500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4,
    paddingLeft: 12,
  },
});
