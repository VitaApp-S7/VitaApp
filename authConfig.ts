// export const protectedResources = {
//     graphMe: {
//         endpoint: "https://graph.microsoft.com/v1.0/me",
//         scopes: ["User.Read"],
//     },
//     apiActivity: {
//         endpoint: "http://10.0.2.2:5000/moodbooster/",
//         scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"], // e.g. api://xxxxxx/access_as_user
//     },
//     apiUser: {
//         endpoint: "http://10.0.2.2:5000/user/",
//         scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
//     },
//     apiBadge: {
//         endpoint: "http://10.0.2.2:5000/badge/",
//         scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
//     },
//     apiChallenge: {
//         endpoint: "http://10.0.2.2:5000/challenge/",
//         scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
//     },
//     apiNews: {
//         endpoint: "http://10.0.2.2:5000/feed/",
//         scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
//     },
//     apiFriends: {
//         endpoint: "http://10.0.2.2:5000/user/friends/",
//         scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
//     },
//     apiEvent: {
//         endpoint:"http://10.0.2.2:5000/event/",
//         scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
//     }
// }

// CLOUD
export const protectedResources = {
    graphMe: {
        endpoint: "https://graph.microsoft.com/v1.0/me",
        scopes: ["User.Read"],
    },
    apiActivity: {
        endpoint: "http://vitaappgw.northeurope.cloudapp.azure.com/moodbooster/" ,
        scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"], // e.g. api://xxxxxx/access_as_user
    },
    apiUser: {
        endpoint: "http://vitaappgw.northeurope.cloudapp.azure.com/user/" ,
        scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
    },
    apiBadge: {
        endpoint: "http://vitaappgw.northeurope.cloudapp.azure.com/badge/",
        scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
    },
    apiChallenge: {
        endpoint:"http://vitaappgw.northeurope.cloudapp.azure.com/challenge/",
        scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
    },
    apiNews: {
        endpoint:"http://vitaappgw.northeurope.cloudapp.azure.com/feed/",
        scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
    },
    apiEvent: {
        endpoint:"http://vitaappgw.northeurope.cloudapp.azure.com/event/",
        scopes: ["api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All"]
    }
}
