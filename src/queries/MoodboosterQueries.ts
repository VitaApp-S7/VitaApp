// export async function getAllActivities(token) {
//   // console.log(token)
//   var response = await axios.get(`${url}active`, { headers: { Authorization: `Bearer ${token}` }})
//   return response.data
// }
//
// export async function getAllCompletedActivities(token) {
//   var response = await axios.get(`${url}completed`, { headers: { Authorization: `Bearer ${token}` }})
//   return response.data
// }
//
// export async function getAllActiveActivities(token) {
//   var response = await axios.get(`${url}accepted`, { headers: { Authorization: `Bearer ${token}` }})
//   return response.data
// }
//
// export async function getAllMoodboosterRequests(token) {
//   var response = await axios.get(`${url}invites`, { headers: { Authorization: `Bearer ${token}` }})
//   return response.data
// }

import { useQuery } from "@tanstack/react-query"
import {
  MoodboosterInviteType,
  MoodboosterType,
  UserMoodboosterType
} from "../types/MoodboosterTypes"
import { AppContext } from "../context/AppContext"
import { useContext } from "react"
import { baseUrl } from "../../authConfig"
import { fetchWithToken } from "../utility/ApiRequestHelpers"

const moodboosterBaseUrl = `${baseUrl}/moodbooster`

export function useActivitiesQuery() {
  const { accessToken } = useContext(AppContext)
  return useQuery<MoodboosterType[]>([ "moodboosters" ], async () => {
    const response = await fetchWithToken(
      `${moodboosterBaseUrl}/active`,
      accessToken
    )

    if (!response.ok) {
      return Promise.reject("useActivitiesQuery failed")
    }

    return response.json()
  })
}

export function useActivitiesCompletedQuery() {
  const { accessToken } = useContext(AppContext)
  return useQuery<UserMoodboosterType[]>(
    [ "moodboostersCompleted" ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/completed`,
        accessToken
      )

      if (!response.ok) {
        return Promise.reject("useActivitiesCompletedQuery failed")
      }

      return response.json()
    }
  )
}

export function useActivitiesActiveQuery() {
  const { accessToken } = useContext(AppContext)
  return useQuery<UserMoodboosterType[]>([ "moodboostersActive" ], async () => {
    const response = await fetchWithToken(
      `${moodboosterBaseUrl}/accepted`,
      accessToken
    )

    if (!response.ok) {
      return Promise.reject("useActivitiesActiveQuery failed")
    }

    return response.json()
  })
}

export function useMoodboosterRequestsQuery() {
  const { accessToken } = useContext(AppContext)
  return useQuery<MoodboosterInviteType[]>(
    [ "moodboosterRequests" ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/invites`,
        accessToken
      )

      if (!response.ok) {
        return Promise.reject("useMoodboosterRequestsQuery failed")
      }

      return response.json()
    }
  )
}

// const moodboosters = useQuery<MoodboosterType[]>(
//   [ "moodboosters" ],
//   () => getAllActivities(accessToken),
//   {
//     onError: (error) => {
//       console.log("moodboosters get req error", error)
//     }
//   }
// )
// const userMoodboosters = useQuery<UserMoodboosterType[]>(
//   [ "userMoodboosters" ],
//   () => getAllActiveActivities(accessToken),
//   {
//     onError: (error) => {
//       console.log("user moodboosters get req error", error)
//     }
//   }
// )
// const requestsQuery = useQuery<MoodboosterInviteType[]>(
//   [ "moodBoosterRequests" ],
//   async () => await getAllMoodboosterRequests(accessToken),
//   { onError: (err) => console.log(err) }
// )
