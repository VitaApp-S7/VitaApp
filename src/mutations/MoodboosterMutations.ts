import { useContext } from "react"
import { baseUrl } from "../../authConfig"
import { AppContext } from "../context/AppContext"
import { UserMoodboosterType } from "../types/MoodboosterTypes"
import { useMutation } from "@tanstack/react-query"
import { fetchWithToken } from "../utility/ApiRequestHelpers"

const moodboosterBaseUrl = `${baseUrl}/moodbooster`

export const useMoodboosterStartMutation = (moodboosterId: string) => {
  const { accessToken } = useContext(AppContext)

  return useMutation<UserMoodboosterType>(
    [ "startMoodbooster", moodboosterId ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/${moodboosterId}`,
        accessToken,
        { method: "PUT" }
      )

      if (!response.ok) {
        return Promise.reject("useMoodboosterStartMutation failed")
      }

      return response.json()
    }
  )
}

export const useMoodboosterCancelMutation = (moodboosterId: string) => {
  const { accessToken } = useContext(AppContext)

  return useMutation<UserMoodboosterType>(
    [ "cancelMoodbooster", moodboosterId ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/cancel/${moodboosterId}`,
        accessToken,
        { method: "PUT" }
      )

      if (!response.ok) {
        return Promise.reject("useMoodboosterCancelMutation failed")
      }

      return response.json()
    }
  )
}

export const useMoodboosterCompleteMutation = (moodboosterId: string) => {
  const { accessToken } = useContext(AppContext)

  return useMutation<UserMoodboosterType>(
    [ "completeMoodbooster", moodboosterId ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/complete/${moodboosterId}`,
        accessToken,
        { method: "PUT" }
      )

      if (!response.ok) {
        return Promise.reject("useMoodboosterCompleteMutation failed")
      }

      return response.json()
    }
  )
}
