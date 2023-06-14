import React, { useState } from "react"
import { Platform, StyleSheet, View } from "react-native"
import { Card, Paragraph } from "react-native-paper"
import ButtonPrimary from "./ButtonPrimary"
import { MoodboosterType } from "../types/MoodboosterTypes"
import { useNavigation } from "@react-navigation/native"
import { useMoodboosterStartMutation } from "../mutations/MoodboosterMutations"
import { ListItemAnimation } from "../animations/ListItemAnimation"
import { useQueryClient } from "@tanstack/react-query"
import { sleep } from "../utility/Sleep"
import { globalStyle } from "../globalStyle"
import ChallengeIcon from "../../assets/challengeIcon.svg"

interface Moodbooster {
  mb: MoodboosterType
  challengeBoosterIds?: string[]
}

const Moodbooster = (props: Moodbooster) => {
  const navigation = useNavigation()

  const startMutation = useMoodboosterStartMutation(props.mb.id)

  const [ isExiting, setIsExiting ] = useState(false)

  const queryClient = useQueryClient()

  const handleToStart = async () => {
    if (startMutation.isIdle && !isExiting) {
      if (!startMutation.isIdle || isExiting) return

      await startMutation.mutateAsync()
      setIsExiting(true)
      await queryClient.invalidateQueries([ "moodboostersActive" ])
      await queryClient.invalidateQueries([ "moodboosters" ])
      sleep(500)
    }
  }

  const handleOnPress = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigation.navigate("Moodbooster Details", {
      mb: props.mb,
      userMb: null
    })
  }

  return (
    <ListItemAnimation elementHeight={152} isExiting={isExiting}>
      <Card
        style={styles.surface}
        key={props.mb.id}
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
              {props.mb.title}
            </Paragraph>
            {props.challengeBoosterIds &&
              props.challengeBoosterIds.includes(props.mb.id) && (
              <View
                style={{
                  marginLeft: "auto",
                  marginTop: -5
                }}
              >
                <ChallengeIcon width={30} height={30} />
              </View>
            )}
          </View>
          <Paragraph style={globalStyle.text.description}>
            {props.mb.category?.name}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.buttons}>
          <ButtonPrimary
            text={"START"}
            onPress={() => handleToStart()}
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

export default Moodbooster
