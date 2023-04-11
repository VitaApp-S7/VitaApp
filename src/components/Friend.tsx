import FriendType from "../types/FriendType"
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native"
import ButtonTertiary from "./ButtonTertiary"
import React, { useContext, useState } from "react"
import { BetterListItemAnimation } from "../animations/BetterListItemAnimation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeFriend } from "../services/friendsService"
import { AppContext } from "../context/AppContext"

const pfp: ImageSourcePropType = require("../../assets/pfp.png")

const Friend = ({ friend }: { friend: FriendType }) => {
  const { accessToken } = useContext(AppContext)
  const [ isExiting, setIsExiting ] = useState(false)

  const mutationDeleteFriend = useMutation((id) =>
    removeFriend(accessToken, id)
  )

  const queryClient = useQueryClient()

  const deleteFriend = async (friend) => {
    setIsExiting(true)
    await mutationDeleteFriend.mutateAsync(friend.id, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([ "friends" ]),
          queryClient.invalidateQueries([ "publicUsers" ])
        ])
      }
    })
  }

  return (
    <BetterListItemAnimation
      elementHeight={100}
      isExiting={isExiting}
    >
      <View style={styles.card}>
        <View style={styles.wrapperTop}>
          <View style={styles.joined}>
            <Image style={styles.pfp} source={pfp} />
            <Text style={styles.title}>{friend.name}</Text>
          </View>

          <ButtonTertiary
            text={"REMOVE"}
            onPress={() => deleteFriend(friend)}
          ></ButtonTertiary>
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


export default Friend
