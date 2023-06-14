import { useQuery } from "@tanstack/react-query"
import { AppContext } from "../context/AppContext"
import { useContext, useState } from "react"
import { baseUrl } from "../../authConfig"
import { fetchWithToken } from "../utility/ApiRequestHelpers"
import { ChallengeType } from "../types/ChallengeType"

const challengesBaseUrl = `${baseUrl}/challenge/challenge`

export function useChallengesQuery() {
  const { accessToken, login } = useContext(AppContext)

  const createData = (challenges: ChallengeType[]) => {
    const now = new Date()
    return [
      {
        key: "active",
        title: "Active",
        data: challenges.filter(
          (challenge) =>
            new Date(challenge.startDate) < now &&
            new Date(challenge.endDate) > now
        )
      },
      {
        key: "upcoming",
        title: "Upcoming",
        data: challenges.filter(
          (challenge) => new Date(challenge.startDate) > now
        )
      },
      {
        key: "inactive",
        title: "Previous",
        data: challenges.filter(
          (challenge) =>
            new Date(challenge.startDate) < now &&
            new Date(challenge.endDate) < now
        )
      }
    ]
  }

  const challengeQuery = useQuery<ChallengeType[]>(
    [ "challenges" ],
    async () => {
      const response = await fetchWithToken(
        `${challengesBaseUrl}/all`,
        accessToken
      )

      if (!response.ok) {
        if (response.status === 401) await login()
        return Promise.reject("useChallengesQuery failed")
      }

      return response.json()
    },
    {
      onSuccess: (responseActivities) => {
        responseActivities && setSectionList(createData(responseActivities))
      }
    }
  )

  const [ sectionList, setSectionList ] = useState<
    { key: string; title: string; data: ChallengeType[] }[]
  >(createData(challengeQuery.data ? challengeQuery.data : []))

  return {
    sectionList,
    challengeQuery
  }
}

export function useActiveChallengeQuery() {
  const { accessToken, login } = useContext(AppContext)

  return useQuery<ChallengeType>([ "challengeActive" ], async () => {
    const response = await fetchWithToken(
      `${challengesBaseUrl}/active`,
      accessToken
    )

    if (!response.ok) {
      if (response.status === 401) await login()
      return Promise.reject("useChallengesQuery failed")
    }
    return response.json()
  })
}
