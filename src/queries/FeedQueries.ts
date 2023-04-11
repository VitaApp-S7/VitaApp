import { baseUrl } from "../../authConfig"
import NewsType from "../types/NewsType"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import { fetchWithToken } from "../utility/ApiRequestHelpers"

const feedBaseUrl = `${baseUrl}/feed`

export function useNewsQuery() {
  const { accessToken } = useContext(AppContext)

  return useQuery<NewsType[]>([ "news" ], async () => {
    const response = await fetchWithToken(`${feedBaseUrl}/all`, accessToken)
    const data = await response.json()
    return data.sort((news, other) => -news.date.localeCompare(other.date))
  })
}
