import axios from "axios"
import { protectedResources } from "../../authConfig"
const url = protectedResources.apiActivity.endpoint

export async function getAllActivities(token) {
  // console.log(token)
  var response = await axios.get(`${url}active`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function increaseMood(id, token) {
  var response = await axios.put(
    `${url}complete/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` }}
  )
  return response.data
}

export async function getAllCompletedActivities(token) {
  var response = await axios.get(`${url}completed`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function getAllActiveActivities(token) {
  var response = await axios.get(`${url}accepted`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function getAllMoodboosterRequests(token) {
  var response = await axios.get(`${url}invites`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function inviteMoodbooster(
  token,
  userMoodboosterId,
  invitedUserId
) {
  const response = await fetch(
    `${url}invite/${userMoodboosterId}/${invitedUserId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response
}

export async function declineMoodboosterRequest(inviteId, token) {
  var response = await axios.delete(`${url}invite/decline/${inviteId}`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function acceptMoodboosterRequest(inviteId, token) {
  const response = await fetch(`${url}invite/` + `accept/${inviteId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
