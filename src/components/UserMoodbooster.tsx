import React, { useContext, useState } from "react"
import { Platform, StyleSheet, View, Text } from "react-native"
import { Card, Paragraph } from "react-native-paper"
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_500Medium as Poppins500Medium,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import Toast from "react-native-toast-message"
import ButtonPrimary from "./ButtonPrimary"
import ButtonSecondary from "./ButtonSecondary"
import InviteFriends from "./MoodboosterInvites"
import { UserMoodboosterType } from "../types/MoodboosterTypes"
import { useNavigation } from "@react-navigation/native"
import { AppContext } from "../context/AppContext"
import {
  useMoodboosterCancelMutation,
  useMoodboosterCompleteChallengeMutation,
  useMoodboosterCompleteMutation
} from "../mutations/MoodboosterMutations"
import { ListItemAnimation } from "../animations/ListItemAnimation"
import { useQueryClient } from "@tanstack/react-query"
import { sleep } from "../utility/Sleep"
import { globalStyle } from "../globalStyle"
import ChallengeIcon from "../../assets/challengeIcon.svg"

interface Moodbooster {
  userMb: UserMoodboosterType
  challengeBoosterIds?: string[]
  currentTeamId?: string
}

const UserMoodbooster = (props: Moodbooster) => {
  const { moodPoints, setMoodPoints } = useContext(AppContext)
  const navigation = useNavigation()
  const [ isExiting, setIsExiting ] = useState(false)

  const completeMoodboosterMutation = useMoodboosterCompleteMutation(
    props.userMb.id
  )
  const completeMoodboosterChallengeMutation =
    useMoodboosterCompleteChallengeMutation(props.userMb, props.currentTeamId)
  const cancelMoodboosterMutation = useMoodboosterCancelMutation(
    props.userMb.id
  )

  const queryClient = useQueryClient()

  console.log(`${props.currentTeamId} CURRENT TEAM ID`)

  //TOAST AFTER COMPLETE
  const completedToast = () => {
    Toast.show({
      type: "success",
      text1: "Completed moodbooster!",
      text2: props.userMb.moodbooster.description
    })
  }
  const cancelledToast = () => {
    Toast.show({
      type: "error",
      text1: "Cancelled moodbooster!",
      text2: props.userMb.moodbooster.description
    })
  }

  useFonts({
    Poppins600SemiBold,
    Poppins400Regular,
    Poppins500Medium
  })

  const handleToComplete = async () => {
    if (!completeMoodboosterMutation.isIdle || isExiting) return

    await completeMoodboosterMutation.mutateAsync()
    if (
      props.challengeBoosterIds.some((id) => id === props.userMb.moodbooster.id)
    ) {
      await completeMoodboosterChallengeMutation.mutateAsync()
      await queryClient.invalidateQueries({ queryKey: [ "teams" ]})
    }
    setIsExiting(true)
    await queryClient.invalidateQueries([ "moodboostersActive" ])
    await queryClient.invalidateQueries([ "moodboosters" ])
    await queryClient.invalidateQueries([ "moodboostersCompleted" ])
    completedToast()
    setMoodPoints(moodPoints + props.userMb.moodbooster.points)
    sleep(500)
  }
  const handleToCancel = async () => {
    if (!cancelMoodboosterMutation.isIdle || isExiting) return

    await cancelMoodboosterMutation.mutateAsync()
    setIsExiting(true)
    await queryClient.invalidateQueries([ "moodboostersActive" ])
    await queryClient.invalidateQueries([ "moodboosters" ])
    cancelledToast()
    sleep(500)
  }

  const handleOnPress = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigation.navigate("Moodbooster Details", {
      mb: props.userMb.moodbooster,
      userMb: props.userMb,
      currentTeamId: props.currentTeamId,
      challengeBoosterIds: props.challengeBoosterIds
    })
  }

  return (
    <ListItemAnimation isExiting={isExiting}>
      <Card
        style={styles.surface}
        key={props.userMb.moodbooster.id}
        onPress={() => handleOnPress()}
        elevation={Platform.OS === "android" ? 3 : 0}
      >
        <Card.Content>
          <View
            style={{
              width: "100%",
              flexDirection: "row"
            }}
          >
            <Paragraph style={globalStyle.text.cardTitle}>
              {props.userMb.moodbooster.title}
            </Paragraph>
            <View
              style={{
                marginLeft: "auto",
                marginTop: -5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {props.userMb.userIds.length > 1 && <Text>x2</Text>}
              {props.challengeBoosterIds &&
                props.challengeBoosterIds.includes(
                  props.userMb.moodbooster.id
                ) && (
                <ChallengeIcon
                  width={30}
                  height={30}
                  style={{ marginLeft: 7 }}
                />
              )}
            </View>
          </View>
          <Paragraph style={globalStyle.text.description}>
            {props.userMb.moodbooster.category.name}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.buttons}>
          <InviteFriends moodboosterId={props.userMb.id} />
          <ButtonSecondary
            text={"CANCEL"}
            onPress={() => handleToCancel()}
          ></ButtonSecondary>
          <ButtonPrimary
            text={"COMPLETE"}
            onPress={() => handleToComplete()}
          ></ButtonPrimary>
        </Card.Actions>
      </Card>
    </ListItemAnimation>
  )
}
const styles = StyleSheet.create({
  buttons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 5,
    elevation: 3,
    backgroundColor: "white",
    ...globalStyle.boxShadow.defaultShadow
  }
})

export default UserMoodbooster
