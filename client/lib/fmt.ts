export function fmtDate(dt: string | null): string {
  if (!dt) return "—"
  return new Date(dt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

export function fmtTime(dt: string | null): string {
  if (!dt) return ""
  return new Date(dt).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  })
}

export function fmtDur(min: number): string {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
