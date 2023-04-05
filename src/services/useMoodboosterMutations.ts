import axios from "axios"
import { useContext } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { protectedResources } from "../../authConfig"
import { AppContext } from "../context/AppContext"
import {
  MoodboosterType,
  UserMoodboosterType
} from "../types/MoodboosterTypes"

const useMoodboosterMutations = () => {
  const url = protectedResources.apiActivity.endpoint
  const queryClient = useQueryClient()
  const { accessToken } = useContext(AppContext)

  const startMoodboosterMutation = async (
    moodboosterId: string
  ): Promise<UserMoodboosterType> => {
    const response = await axios.put(
      url + moodboosterId,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` }}
    )
    return response.data
  }

  const cancelMoodboosterMutation = async (moodboosterId: string) => {
    const response = await axios.put(
      `${url}cancel/${moodboosterId}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` }}
    )
    return response.data
  }

  const completeMoodboosterMutation = async (moodboosterId: string) => {
    const response = await axios.put(
      `${url}complete/${moodboosterId}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` }}
    )
    return response.data
  }

  const updateMoodboostersQuery = (newMoodbooster: MoodboosterType) => {
    queryClient.setQueryData(
      [ "moodboosters" ],
      (prevData: MoodboosterType[]) =>
        [ ...prevData, newMoodbooster ].filter(
          (mb, i, a) => a.findIndex((mb2) => mb.id === mb2.id) === i
        ) // removes duplicates
    )
  }

  const updateUserMoodboostersQuery = (newItem: UserMoodboosterType) => {
    queryClient.setQueryData(
      [ "moodboostersActive" ],
      (prevData: UserMoodboosterType[]) =>
        [ ...prevData, newItem ].filter(
          (mb, i, a) => a.findIndex((mb2) => mb.id === mb2.id) === i
        ) // removes duplicates
    )
  }

  const removeMoodboosterFromAllMoodboosters = (MoodboosterId: string) => {
    queryClient.setQueryData([ "moodboosters" ], (prevData: MoodboosterType[]) =>
      prevData.filter((item) => item.id !== MoodboosterId)
    )
  }

  const removeMoodboosterFromUserMoodboosterQuery = (MoodboosterId: string) => {
    queryClient.setQueryData(
      [ "moodboostersActive" ],
      (prevData: UserMoodboosterType[]) =>
        prevData.filter((item) => item.id !== MoodboosterId)
    )
  }

  return {
    moodbooster: {
      startMoodboosterMutation,
      cancelMoodboosterMutation,
      completeMoodboosterMutation,
      updateMoodboostersQuery,
      updateUserMoodboostersQuery,
      removeMoodboosterFromAllMoodboosters,
      removeMoodboosterFromUserMoodboosterQuery
    }
  }
}

export default useMoodboosterMutations
