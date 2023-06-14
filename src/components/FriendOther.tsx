import { Image, StyleSheet, Text, View } from "react-native"
import React, { useContext, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addFriend } from "../services/friendsService"
import { AppContext } from "../context/AppContext"
import PublicUserType from "../types/PublicUserType"
import ButtonPrimary from "./ButtonPrimary"
import { ListItemAnimation } from "../animations/ListItemAnimation"
import { sleep } from "../utility/Sleep"
import { globalStyle } from "../globalStyle"

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
            ></Image>
            <Text style={[ globalStyle.text.cardTitle, styles.title ]}>
              {other.name}
            </Text>
          </View>

          <ButtonPrimary
            text={"INVITE"}
            onPress={() => {
              sendInvite(other.id)
            }}
          ></ButtonPrimary>
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
