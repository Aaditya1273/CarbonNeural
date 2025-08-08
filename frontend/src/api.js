const BASE = 'http://localhost:8080'

async function _req(path, method = 'GET', body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return await res.json()
}

export const api = {
  get: (p) => _req(p, 'GET'),
  post: (p, b) => _req(p, 'POST', b)
}
