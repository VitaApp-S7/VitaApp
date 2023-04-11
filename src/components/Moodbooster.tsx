import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { Card, Paragraph } from "react-native-paper"
import {
  Poppins_400Regular as Poppins400Regular,
  Poppins_500Medium as Poppins500Medium,
  Poppins_600SemiBold as Poppins600SemiBold,
  useFonts
} from "@expo-google-fonts/poppins"
import ButtonPrimary from "./ButtonPrimary"
import { MoodboosterType } from "../types/MoodboosterTypes"
import { useNavigation } from "@react-navigation/native"
import { useMoodboosterStartMutation } from "../mutations/MoodboosterMutations"
import { BetterListItemAnimation } from "../animations/BetterListItemAnimation"
import { useQueryClient } from "@tanstack/react-query"

interface Moodbooster {
  mb: MoodboosterType;
}

const Moodbooster = (props: Moodbooster) => {
  const navigation = useNavigation()

  const startMutation = useMoodboosterStartMutation(props.mb.id)

  const [ isExiting, setIsExiting ] = useState(false)

  const queryClient = useQueryClient()

  useFonts({
    Poppins600SemiBold,
    Poppins400Regular,
    Poppins500Medium
  })

  const handleToStart = async () => {
    if (startMutation.isIdle && !isExiting) {
      if(!startMutation.isIdle || isExiting) return

      await startMutation.mutateAsync()
      setIsExiting(true)
      await queryClient.invalidateQueries([ "moodboostersActive" ])
      await queryClient.invalidateQueries([ "moodboosters" ])
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
    <BetterListItemAnimation elementHeight={152} isExiting={isExiting}>
      <Card
        style={styles.surface}
        mode="outlined"
        theme={{ colors: { outline: "rgba(0, 0, 0, 0.2)" }}}
        key={props.mb.id}
        onPress={() => handleOnPress()}
      >
        <Card.Content>
          <Paragraph style={styles.title}>{props.mb.title}</Paragraph>
          <Paragraph style={styles.catagory}>
            {props.mb.category.name}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.buttons}>
          <ButtonPrimary
            text={"START"}
            onPress={() => handleToStart()}
          ></ButtonPrimary>
        </Card.Actions>
      </Card>
    </BetterListItemAnimation>
  )
}
const styles = StyleSheet.create({
  buttons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10
  },
  catagory: {
    fontFamily: "Poppins500Medium",
    fontSize: 16,
    color: "#031D29"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    lineHeight: 24,
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
