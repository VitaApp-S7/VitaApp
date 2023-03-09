//const baseUrl = "http://145.93.160.237:5000";

//CLOUD
const baseUrl = "http://vitaappgw.northeurope.cloudapp.azure.com"

export const protectedResources = {
  graphMe: {
    endpoint: "https://graph.microsoft.com/v1.0/me",
    scopes: [ "User.Read" ]
  },
  apiActivity: {
    endpoint: `${baseUrl}/moodbooster/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ] // e.g. api://xxxxxx/access_as_user
  },
  apiUser: {
    endpoint: `${baseUrl}/user/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiBadge: {
    endpoint: `${baseUrl}/badge/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiChallenge: {
    endpoint: `${baseUrl}/challenge/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiNews: {
    endpoint: `${baseUrl}/feed/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiFriends: {
    endpoint: `${baseUrl}/user/friends/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiEvent: {
    endpoint: `${baseUrl}/event/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  }
}
