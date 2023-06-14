import FriendType from "../types/FriendType"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ButtonTertiary from "./ButtonTertiary"
import React, { useContext, useState } from "react"
import { ListItemAnimation } from "../animations/ListItemAnimation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeFriend } from "../services/friendsService"
import { AppContext } from "../context/AppContext"
import { sleep } from "../utility/Sleep"
import { globalStyle } from "../globalStyle"
import Ionicons from "@expo/vector-icons/Ionicons"

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
    sleep(500)
  }

  return (
    <ListItemAnimation elementHeight={100} isExiting={isExiting}>
      <View style={styles.card}>
        <View style={styles.wrapperTop}>
          <View style={styles.joined}>
            <Image
              style={styles.pfp}
              source={require("../../assets/hairyFriendAvatar.png")}
            />
            <Text style={[ globalStyle.text.cardTitle, styles.title ]}>
              {friend.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => deleteFriend(friend)}>
            <Ionicons name="remove-circle-outline" size={35} color="#052D40" />
          </TouchableOpacity>
        </View>
      </View>
    </ListItemAnimation>
  )
}

const styles = StyleSheet.create({
  pfp: {
    height: 56,
    width: 56,
    marginBottom: -6,
    borderRadius: 999,
    backgroundColor: "white"
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 6,
    paddingHorizontal: 12,
    ...globalStyle.boxShadow.defaultShadow,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 3
  },
  joined: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
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
