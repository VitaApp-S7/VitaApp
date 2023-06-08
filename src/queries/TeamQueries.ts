import { useQuery } from "@tanstack/react-query"
import { AppContext } from "../context/AppContext"
import { useContext } from "react"
import { baseUrl } from "../../authConfig"
import { fetchWithToken } from "../utility/ApiRequestHelpers"
import { TeamType } from "../types/ChallengeType"

const challengesBaseUrl = `${baseUrl}/challenge/team`

export function useTeamsQuery(challengeId: string) {
  const { accessToken, login } = useContext(AppContext)

  const teamQuery = useQuery<TeamType[]>([ "teams", challengeId ], async () => {
    const response = await fetchWithToken(
      `${challengesBaseUrl}/challenge/${challengeId}`,
      accessToken
    )

    if (!response.ok) {
      if (response.status === 401) await login()
      return Promise.reject("useTeamsQuery failed")
    }

    return response.json()
  })

  return { teamQuery }
}
