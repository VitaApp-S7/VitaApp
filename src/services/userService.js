import axios from "axios"
import { protectedResources } from "../../authConfig"
import "react-native-url-polyfill/auto"

const url = protectedResources.apiUser.endpoint

export async function getUser(token) {
  var response = await axios.get(`${url}me`, { headers: { Authorization: `Bearer ${token}` }})

  if (response.status !== 200) {
    throw new Error("")
  }

  return response.data
}

export async function checkUser(token) {
  var response = await axios.get(`${url}login/check`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function GetDate(token) {
  var response = await axios.get(`${url}date`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function SetDate(token, date) {
  const res = await fetch(`${url}date/${date}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function SetExpo(token, expoToken) {
  const res = await fetch(`${url}setexpo/${expoToken}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  console.log(`${expoToken} written to database`)
  return await res.data
}

export async function updateUserMood(token, points) {
  const res = await fetch(`${url}setmood/${points}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}
