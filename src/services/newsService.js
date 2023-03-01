import axios from "axios"
import { protectedResources } from "../../authConfig"

const url = protectedResources.apiNews.endpoint

export async function getNews(token) {
  var response = await axios.get(`${url  }all`, { headers: { Authorization: `Bearer ${token}` }})
  return response
}