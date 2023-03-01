import axios from "axios"
import { protectedResources } from "../../authConfig"



const url = protectedResources.apiUser.endpoint

export async function setUserExpoPushToken(token) {
  var response = await axios.get(`${url  }/setexpo/${  { token }}`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data

}
