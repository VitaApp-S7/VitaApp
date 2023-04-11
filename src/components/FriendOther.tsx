import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View
} from "react-native"
import React, { useContext, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addFriend } from "../services/friendsService"
import { AppContext } from "../context/AppContext"
import PublicUserType from "../types/PublicUserType"
import ButtonPrimary from "./ButtonPrimary"
import { BetterListItemAnimation } from "../animations/BetterListItemAnimation"

const pfp: ImageSourcePropType = require("../../assets/pfp.png")

const FriendOther = ({ other }: { other: PublicUserType }) => {
  const { accessToken } = useContext(AppContext)
  const [ isExiting, setIsExiting ] = useState(false)

  const mutationAddFriend = useMutation((id) => addFriend(accessToken, id))

  const queryClient = useQueryClient()
  const sendInvite = async (id) => {
    setIsExiting(true)
    await mutationAddFriend.mutateAsync(id, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([ "invites" ]),
          queryClient.invalidateQueries([ "publicUsers" ])
        ])
      }
    })
  }

  return (
    <BetterListItemAnimation elementHeight={100} isExiting={isExiting}>
      <View style={styles.card}>
        <View style={styles.wrapperTop}>
          <View style={styles.joined}>
            <Image style={styles.pfp} source={pfp}></Image>
            <Text style={styles.title}>{other.name}</Text>
          </View>

          <ButtonPrimary
            text={"INVITE"}
            onPress={() => {
              sendInvite(other.id)
            }}
          ></ButtonPrimary>
        </View>
      </View>
    </BetterListItemAnimation>
  )
}

const styles = StyleSheet.create({
  pfp: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 999,
    backgroundColor: "white"
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    backgroundColor: "white"
  },
  joined: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 16,
    color: "#052D40",
    paddingLeft: 12,
    paddingTop: 6,
    width: "70%"
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    margin: 8
  }
})

export default FriendOther
