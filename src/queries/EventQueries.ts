import { useQuery } from "@tanstack/react-query"
import EventType from "../types/EventType"
import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import { fetchWithToken } from "../utility/ApiRequestHelpers"
import { baseUrl } from "../../authConfig"

const eventBaseUrl = `${baseUrl}/event`

export function useEventsQuery() {
  const { accessToken, user } = useContext(AppContext)

  const sortData = (data) =>
    data.sort((evt, other) => -evt.date.localeCompare(other.date))

  const createData = (joined, notJoined) => {
    return [
      {
        key: "joined",
        title: "Signed Up",
        data: sortData(joined),
        emptyText: "Haven't signed up for any events"
      },
      {
        key: "not-joined",
        title: "Available",
        data: sortData(notJoined),
        emptyText: "No events available anymore"
      }
    ]
  }

  const setSortedListData = (data) => {
    setListData(
      createData(
        data.filter((evt) => evt.userIds.includes(user.id)),
        data.filter((evt) => !evt.userIds.includes(user.id))
      )
    )
  }

  const events = useQuery<EventType[]>(
    [ "events" ],
    async () => {
      const response = await fetchWithToken(`${eventBaseUrl}/all`, accessToken)

      if (!response.ok) {
        return Promise.reject("useEventsQuery failed")
      }

      return response.json()
    },
    { onSuccess: setSortedListData }
  )

  const [ listData, setListData ] = useState(
    createData(
      (events.data ? events.data : []).filter((evt) =>
        evt.userIds.includes(user.id)
      ),
      (events.data ? events.data : []).filter(
        (evt) => !evt.userIds.includes(user.id)
      )
    )
  )

  return {
    events,
    listData
  }
}
