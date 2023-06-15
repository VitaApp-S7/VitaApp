import { useQuery } from "@tanstack/react-query"
import FriendType from "../types/FriendType"
import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import { fetchWithToken } from "../utility/ApiRequestHelpers"
import { baseUrl } from "../../authConfig"
import SendedFriendType from "../types/SendedFriendType"

const friendsBaseUrl = `${baseUrl}/user/friends`

export function useFriendsQuery() {
  const { accessToken, login } = useContext(AppContext)

  return useQuery<FriendType[]>([ "friends" ], async () => {
    const response = await fetchWithToken(friendsBaseUrl, accessToken)

    if (!response.ok) {
      if (response.status === 401) await login()
      return Promise.reject("useFriendsQuery failed")
    }

    return response.json()
  })
}

export function useFriendRequestsQuery() {
  const { accessToken, login } = useContext(AppContext)

  return useQuery<FriendType[]>([ "friendRequests" ], async () => {
    const response = await fetchWithToken(
      `${friendsBaseUrl}/requests`,
      accessToken
    )

    if (!response.ok) {
      if (response.status === 401) await login()
      return Promise.reject("useFriendRequestsQuery failed")
    }

    return response.json()
  })
}

export function useFriendInvitesQuery() {
  const { accessToken, login } = useContext(AppContext)

  return useQuery<SendedFriendType[]>([ "invites" ], async () => {
    const response = await fetchWithToken(
      `${friendsBaseUrl}/sendedrequests`,
      accessToken
    )

    if (!response.ok) {
      if (response.status === 401) await login()
      return Promise.reject("useFriendInvitesQuery failed")
    }

    return response.json()
  })
}
