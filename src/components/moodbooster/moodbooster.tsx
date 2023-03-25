import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from "react"
import { View, StyleSheet } from "react-native"
import {
  getAllActivities,
  startActivity,
  cancelActivity,
  getAllActiveActivities,
  completeActivity
} from "../../services/moodboosterService"

import { Card, Paragraph, Title } from "react-native-paper"
import {
  useFonts,
  Poppins_600SemiBold as Poppins600SemiBold,
  Poppins_400Regular as Poppins400Regular,
  Poppins_500Medium as Poppins500Medium
} from "@expo-google-fonts/poppins"
import Toast from "react-native-toast-message"
import ContentLoader, { Rect } from "react-content-loader/native"
import PrimaryBtn from "../buttons/PrimaryBtn"
import SecondaryBtn from "../buttons/SecondaryBtn"
import InviteFriends from "../../components/challengeFriends/inviteFriends"
import {
  UserMoodboosterType,
  MoodboosterType
} from "../../types/MoodboosterTypes"
import { useNavigation } from "@react-navigation/native"
import { AppContext } from "../../context/AppContext"
interface Moodbooster {
  refresh: boolean
  setRefreshing: Dispatch<SetStateAction<boolean>>
}

const Moodbooster = (props: Moodbooster) => {
  const [ data, setData ] = useState([])
  const [ activeData, setActiveData ] = useState([])
  const [ disabledState, setDisabledState ] = useState(false)
  const { moodPoints, setMoodPoints, accessToken } = useContext(AppContext)
  const navigation = useNavigation()
  //TOAST AFTER COMPLETE
  const completedToast = (toastData) => {
    Toast.show({
      type: "success",
      text1: "Completed moodbooster!",
      text2: toastData.moodbooster.description
    })
  }
  const cancelledToast = (toastData) => {
    Toast.show({
      type: "error",
      text1: "Cancelled moodbooster!",
      text2: toastData.moodbooster.description
    })
  }

  const handleActivities = async () => {
    const activeActivities = await getAllActiveActivities(accessToken)
    const activities = await getAllActivities(accessToken)
    // console.log(activeActivities);

    setData(activities)

    setActiveData(activeActivities)
    if (activeActivities[0]) {
      setDisabledState(true)
    } else {
      setDisabledState(false)
    }
  }

  useEffect(() => {
    handleActivities()
  }, [])

  useEffect(() => {
    if (props.refresh === true) {
      handleActivities()
      props.setRefreshing(false)
    }
  }, [ props.refresh ])

  const [ fontsLoaded ] = useFonts({
    Poppins600SemiBold,
    Poppins400Regular,
    Poppins500Medium
  })

  if (!fontsLoaded) {
    return null
  }

  const handleToStart = async (index) => {
    await startActivity(data[index].id, accessToken)
    handleActivities()
    setDisabledState(true)
  }
  const handleToComplete = async (index) => {
    await completeActivity(activeData[index].id, accessToken)
    handleActivities()
    setDisabledState(false)
    completedToast(activeData[index])
    setMoodPoints(moodPoints + activeData[index].moodbooster.points)
  }
  const handleToCancel = async (index) => {
    await cancelActivity(activeData[index].id, accessToken)
    cancelledToast(activeData[index])
    handleActivities()
    setDisabledState(false)
  }

  const handleOnPress = (item: MoodboosterType | UserMoodboosterType) => {
    console.log(typeof navigation)
    navigation.navigate("Moodbooster Details", { item })
  }

  const ActiveCards = () => (
    <View>
      {activeData.map((item, index) => (
        <Card
          style={styles.surface}
          mode="outlined"
          theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
          key={index}
          onPress={() => handleOnPress(item)}
        >
          <Card.Content>
            <Paragraph style={styles.description}>
              {item.moodbooster.description}
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.buttons}>
            <InviteFriends disabled={false} moodboosterId={item.id} />
            <SecondaryBtn
              text={"CANCEL"}
              onPress={() => handleToCancel(index)}
            ></SecondaryBtn>
            <PrimaryBtn
              text={"COMPLETE"}
              disabled={false}
              onPress={() => handleToComplete(index)}
            ></PrimaryBtn>
          </Card.Actions>
        </Card>
      ))}
    </View>
  )
  const MainCard = () => (
    <View>
      {data.map((item, index) => (
        <Card
          style={styles.surface}
          mode="outlined"
          theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
          key={index}
          onPress={() => handleOnPress(item)}
        >
          <Card.Content>
            <Title style={styles.description}>{item.description}</Title>
            <Paragraph style={styles.category}>{item.category.name}</Paragraph>
          </Card.Content>
          <Card.Actions style={styles.buttons}>
            <PrimaryBtn
              text={"START"}
              disabled={disabledState}
              onPress={() => handleToStart(index)}
            ></PrimaryBtn>
          </Card.Actions>
        </Card>
      ))}
    </View>
  )

  return (
    <View>
      <ActiveCards />
      {data[0] ? (
        <MainCard />
      ) : (
        <ContentLoader
          speed={2}
          width={400}
          height={460}
          viewBox="0 0 400 460"
          backgroundColor="#e6e6e6"
          foregroundColor="#d6d6d6"
        >
          <Rect x="10" y="0" rx="2" ry="2" width="350" height="100" />
          <Rect x="10" y="110" rx="2" ry="2" width="320" height="100" />
          <Rect x="10" y="220" rx="2" ry="2" width="340" height="100" />
        </ContentLoader>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  buttons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  description: {
    fontFamily: "Poppins500Medium",
    fontSize: 16,
    color: "#031D29"
  },
  category: {
    fontFamily: "Poppins400Regular",
    fontSize: 14,
    color: "#031D29"
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    fontFamily: "Poppins600SemiBold",
    backgroundColor: "#FFFFFF"
  }
})

export default Moodbooster
