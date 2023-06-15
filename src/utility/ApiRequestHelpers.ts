export async function fetchWithToken(
  input: string | URL,
  token: string,
  init: RequestInit = {}
) {
  const headers = new Headers(init.headers ? init.headers : {})

  headers.set("Authorization", `Bearer ${token}`)
  init.headers = headers

  if (init.method === "POST" || init.method === "PUT") {
    init.mode
  }

  return await fetch(input, init)
}
