import { useContext } from "react"
import { baseUrl } from "../../authConfig"
import { AppContext } from "../context/AppContext"
import { UserMoodboosterType } from "../types/MoodboosterTypes"
import { useMutation } from "@tanstack/react-query"
import { fetchWithToken } from "../utility/ApiRequestHelpers"

const moodboosterBaseUrl = `${baseUrl}/moodbooster`

export const useMoodboosterStartMutation = (moodboosterId: string) => {
  const { accessToken, login } = useContext(AppContext)

  return useMutation<UserMoodboosterType>(
    [ "startMoodbooster", moodboosterId ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/${moodboosterId}`,
        accessToken,
        { method: "PUT" }
      )

      if (!response.ok) {
        if (response.status === 401) await login()

        return Promise.reject("useMoodboosterStartMutation failed")
      }

      return response.json()
    }
  )
}

export const useMoodboosterCancelMutation = (moodboosterId: string) => {
  const { accessToken, login } = useContext(AppContext)

  return useMutation<UserMoodboosterType>(
    [ "cancelMoodbooster", moodboosterId ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/cancel/${moodboosterId}`,
        accessToken,
        { method: "PUT" }
      )

      if (!response.ok) {
        if (response.status === 401) await login()

        return Promise.reject("useMoodboosterCancelMutation failed")
      }

      return response.json()
    }
  )
}

export const useMoodboosterCompleteMutation = (moodboosterId: string) => {
  const { accessToken, login } = useContext(AppContext)

  return useMutation<UserMoodboosterType>(
    [ "completeMoodbooster", moodboosterId ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/complete/${moodboosterId}`,
        accessToken,
        { method: "PUT" }
      )

      if (!response.ok) {
        if (response.status === 401) await login()
        const errorResponse = await response.json()
        const errorMessage = errorResponse.error || "Unknown error"
        return Promise.reject(
          `useMoodboosterCompleteMutation failed: ${errorMessage}`
        )
      }

      return response.json()
    }
  )
}

export const useMoodboosterCompleteChallengeMutation = (
  moodbooster: UserMoodboosterType,
  teamId: string
) => {
  const { accessToken, login } = useContext(AppContext)

  return useMutation<void>(
    [ "completeMoodboosterChallenge", teamId ],
    async () => {
      const response = await fetchWithToken(
        `${baseUrl}/challenge/team/addpoints`,
        accessToken,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            teamId: teamId,
            userIds: moodbooster.userIds,
            points:
              moodbooster.userIds.length > 1
                ? moodbooster.moodbooster.points * 2
                : moodbooster.moodbooster.points
          })
        }
      )

      if (!response.ok) {
        console.log("Failed request")
        if (response.status === 401) await login()
        const errorResponse = await response.json()
        const errorMessage = errorResponse.error || "Unknown error"
        return Promise.reject(
          `useMoodboosterCompleteChallengeMutation failed: ${errorMessage}`
        )
      }

      console.log("Didn't fail request")
      await Promise.resolve()
    }
  )
}
