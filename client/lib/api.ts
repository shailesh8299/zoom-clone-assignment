import { Mtg, Part } from "./types"

const BASE = "http://localhost:8000"

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  getMtgs: () => req<Mtg[]>("/meetings/"),
  getUpcoming: () => req<Mtg[]>("/meetings/upcoming"),
  getRecent: () => req<Mtg[]>("/meetings/recent"),
  getMtg: (rid: string) => req<Mtg>(`/meetings/${rid}`),
  createMtg: (body: Partial<Mtg>) =>
    req<Mtg>("/meetings/", { method: "POST", body: JSON.stringify(body) }),
  joinMtg: (rid: string, name: string) =>
    req<Part>(`/meetings/${rid}/join`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  getParts: (rid: string) => req<Part[]>(`/meetings/${rid}/participants`),
}
