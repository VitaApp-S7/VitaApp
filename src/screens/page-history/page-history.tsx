import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { getAllCompletedActivities } from "../../services/moodboosterService";
import { AuthContext } from "../../context/AuthContext";
import { Card, Paragraph } from "react-native-paper";

const PageHistory = () => {
  const [completedData, setCompletedData] = useState([]);

  const handleActivities = async () => {
    var completedActivities = await getAllCompletedActivities(accessToken);
    // console.log(completedActivities)
    setCompletedData(await completedActivities.reverse());
  };

  useEffect(() => {
    handleActivities();
  }, []);
  const { accessToken } = useContext(AuthContext);

  return (
    <ScrollView>
      {completedData.map((item, index) => (
        <Card
          style={styles.surface}
          mode="outlined"
          theme={{
            colors: {
              outline: "rgba(0, 0, 0, 0.2)",
            },
          }}
          key={index}
        >
          <Card.Content>
          <Paragraph style={styles.title}>{new Date(item.completionDate).toDateString()}</Paragraph>
            <Text style={styles.description}>{item.moodbooster.description}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

export default PageHistory;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 200,
  },
  wrapper: {
    margin: 16,
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    fontFamily: "Poppins_600SemiBold",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 14,
    color: "#031D29",
  },
  description: {
    fontFamily: "Poppins_500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4,
  },
  date: {
    fontFamily: "Poppins_700Bold",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#031D29",
  },
  screen: {
    backgroundColor: "white",
    height: "100%",
  },
  contentimage: {
    width: "100%",
    height: 150,
    paddingVertical: 4,
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4,
  },
});
