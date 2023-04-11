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

import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import {
  MoodboosterInviteType,
  MoodboosterType,
  UserMoodboosterType
} from "../types/MoodboosterTypes"
import { AppContext } from "../context/AppContext"
import { useContext, useState } from "react"
import { baseUrl } from "../../authConfig"
import { fetchWithToken } from "../utility/ApiRequestHelpers"

const moodboosterBaseUrl = `${baseUrl}/moodbooster`

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

export function useActivitiesActiveQuery(
  options: Omit<
    UseQueryOptions<
      UserMoodboosterType[],
      unknown,
      UserMoodboosterType[],
      QueryKey
    >,
    "initialData" | "queryFn" | "queryKey"
  > & { initialData?: () => undefined }
) {
  const { accessToken } = useContext(AppContext)
  return useQuery<UserMoodboosterType[]>(
    [ "moodboostersActive" ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/accepted`,
        accessToken
      )

      if (!response.ok) {
        return Promise.reject("useActivitiesActiveQuery failed")
      }

      return response.json()
    },
    options
  )
}

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

export function useAllActivitiesQuery() {
  const { accessToken } = useContext(AppContext)

  const createData = (
    activities: MoodboosterType[],
    activeActivities: UserMoodboosterType[]
  ) => {
    return [
      {
        key: "active",
        title: "Active activities",
        data: activeActivities
      },
      {
        key: "inactive",
        title: "Inactive activities",
        data: activities
      }
    ]
  }

  const activeActivitiesQuery = useActivitiesActiveQuery({
    onSuccess: (activeActivities) => {
      if (activitiesQuery.isSuccess) {
        const inactiveActivities = activitiesQuery.data.filter(
          (act) =>
            !activeActivities.some((act2) => act.id === act2.moodbooster.id)
        )

        setSectionList(createData(inactiveActivities, activeActivities))
      }
    }
  })

  const activitiesQuery = useQuery<MoodboosterType[]>(
    [ "moodboosters" ],
    async () => {
      const response = await fetchWithToken(
        `${moodboosterBaseUrl}/active`,
        accessToken
      )

      if (!response.ok) {
        return Promise.reject("useActivitiesQuery failed")
      }

      return response.json()
    },
    {
      enabled: !!activeActivitiesQuery.data,
      onSuccess: (responseActivities) => {
        const inactiveActivities = responseActivities.filter(
          (act) =>
            !activeActivitiesQuery.data.some(
              (act2) => act.id === act2.moodbooster.id
            )
        )

        setSectionList(
          createData(inactiveActivities, activeActivitiesQuery.data)
        )
      }
    }
  )

  const [ sectionList, setSectionList ] = useState<
    (
      | { key: string; title: string; data: UserMoodboosterType[] }
      | {
          key: string;
          title: string;
          data: MoodboosterType[];
        }
    )[]
      >(
      createData(
        (activitiesQuery.data ? activitiesQuery.data : []).filter(
          (act) =>
            !(activeActivitiesQuery.data ? activeActivitiesQuery.data : []).some(
              (act2) => act.id === act2.moodbooster.id
            )
        ),
        activeActivitiesQuery.data ? activeActivitiesQuery.data : []
      )
      )

  return {
    sectionList,
    activeActivitiesQuery,
    activitiesQuery
  }
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
