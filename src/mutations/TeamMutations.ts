import { useContext } from "react"
import { baseUrl } from "../../authConfig"
import { AppContext } from "../context/AppContext"
import { UserMoodboosterType } from "../types/MoodboosterTypes"
import { useMutation } from "@tanstack/react-query"
import { fetchWithToken } from "../utility/ApiRequestHelpers"

const teamBaseUrl = `${baseUrl}/challenge/team`

export const useTeamJoinMutation = (teamId: string) => {
  const { accessToken, login } = useContext(AppContext)

  return useMutation<UserMoodboosterType>(
    [ "joinTeam", teamId ],
    async () => {
      const response = await fetchWithToken(
        `${teamBaseUrl}/${teamId}/join`,
        accessToken,
        { method: "POST" }
      )

      if (!response.ok) {
        if (response.status === 401) await login()

        return Promise.reject("useTeamJoinMutation failed")
      }
    }
  )
}
