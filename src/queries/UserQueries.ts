import { fetchWithToken } from "../utility/ApiRequestHelpers"
import { baseUrl } from "../../authConfig"
import { useQuery } from "@tanstack/react-query"
import PublicUserType from "../types/PublicUserType"
import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import UserType from "../types/UserType"
import FriendType from "../types/FriendType"
import { UseQueryResult } from "react-query"
import SendedFriendType from "../types/SendedFriendType"

const _ = require("lodash")

const userBaseUrl = `${baseUrl}/user`

function getOtherPeopleIds(
  userData: PublicUserType[],
  friends: UseQueryResult<FriendType[], unknown>,
  invites: UseQueryResult<SendedFriendType[], unknown>,
  user: UserType
) {
  return _.difference(
    userData.map((usr) => usr.id),
    (friends.isSuccess ? friends.data : []).map((friend) => friend.userId),
    (invites.isSuccess ? invites.data : []).map((invite) => invite.friendId),
    [ user.id ]
  )
}

export function useOtherPeopleQuery(friends, invites) {
  const { user, accessToken } = useContext(AppContext)

  const users = useQuery<PublicUserType[]>(
    [ "publicUsers" ],
    async () => {
      const response = await fetchWithToken(
        `${userBaseUrl}/public/all`,
        accessToken
      )

      if (!response.ok) {
        return Promise.reject("useOtherPeopleQuery failed")
      }

      return response.json()
    },
    {
      enabled: !!user?.id && !!friends.data && !!invites.data,
      onSuccess: (users) => {
        const otherPeopleIds = getOtherPeopleIds(users, friends, invites, user)
        setOtherPeople(users.filter((usr) => otherPeopleIds.includes(usr.id)))
      },
      staleTime: 30 * 60 * 1000,
      cacheTime: 3 * 24 * 60 * 60 * 1000
    }
  )

  const [ otherPeople, setOtherPeople ] = useState<PublicUserType[]>(() => {
    const otherPeopleIds = getOtherPeopleIds(
      (users.data ? users.data : []),
      friends,
      invites,
      user
    )
    return (users.data ? users.data : []).filter((usr) =>
      otherPeopleIds.includes(usr.id)
    )
  })

  return {
    users,
    otherPeople,
    setOtherPeople
  }
}
