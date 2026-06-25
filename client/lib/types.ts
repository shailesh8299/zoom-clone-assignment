export interface Mtg {
  id: string
  title: string
  desc: string
  sched_at: string | null
  dur_min: number
  link: string
  active: boolean
  created: string
}

export interface Part {
  id: number
  name: string
  joined: string
  is_host: boolean
}
