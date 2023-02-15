import axios from "axios";
import { protectedResources } from "../../authConfig";

const url = protectedResources.apiEvent.endpoint;

export async function getEvents(token) {
    var response = await axios.get(url + "all", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response;
}

export async function joinEvent(token, id) {
    const res = await fetch(url + "join/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return res;
}

export async function leaveEvent(token, id) {
    const res = await fetch(url + "leave/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return res;
}

// export async function acceptFrRequest(token, friendReqId) {
//     const res = await fetch(url + "/requests/accept/" + friendReqId, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return res;
// }