import axios from "axios"
import { protectedResources } from "../../authConfig"

const url = `${protectedResources.apiUser.endpoint}friends`

export async function addFriend(token, id) {
  const res = await fetch(`${url}/add/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })

  return res
}

export async function removeFriend(token, id) {
  var response = await axios.delete(`${url}/remove/${id}`, { headers: { Authorization: `Bearer ${token}` }})
  return response
}

export async function acceptFrRequest(token, friendReqId) {
  const res = await fetch(`${url}/requests/accept/${friendReqId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  return res
}

export async function cancelFrRequest(token, reqId) {
  var response = await axios.delete(`${url}/requests/cancel/${reqId}`, { headers: { Authorization: `Bearer ${token}` }})
  return response
}
