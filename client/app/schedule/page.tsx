"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Nav } from "@/ui/nav"

export default function SchedulePage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: "", desc: "", date: "", time: "", dur_min: 60 })
  const [done, setDone] = useState(false)
  const [link, setLink] = useState("")
  const [err, setErr] = useState("")

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    setErr("")
    if (!form.title.trim() || !form.date || !form.time) {
      setErr("Topic, date, and time are required.")
      return
    }
    try {
      const sched_at = new Date(`${form.date}T${form.time}`).toISOString()
      const m = await api.createMtg({
        title: form.title,
        desc: form.desc,
        sched_at,
        dur_min: form.dur_min,
      })
      setLink(m.link)
      setDone(true)
    } catch {
      setErr("Failed to schedule meeting. Try again.")
    }
  }

  if (done) return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Nav />
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Meeting Scheduled!</h2>
        <p className="text-sm text-gray-500 mb-4 select-all break-all">{link}</p>
        <button onClick={() => navigator.clipboard.writeText(link)} className="px-4 py-2 border border-[#0E72ED] text-[#0E72ED] rounded-md text-sm hover:bg-blue-50 cursor-pointer">Copy Invite Link</button>
        <button onClick={() => router.push("/")} className="mt-4 text-sm text-gray-400 hover:text-gray-600 cursor-pointer">Back to Dashboard</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Nav />
      <div className="max-w-md mx-auto w-full px-6 py-10 flex-grow">
        <h1 className="text-2xl font-bold mb-1">Schedule a Meeting</h1>
        <p className="text-sm text-gray-400 mb-6">Set up your meeting details</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Topic</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="My Meeting" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0E72ED]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Description (optional)</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0E72ED] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0E72ED]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => set("time", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0E72ED]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Duration</label>
            <select value={form.dur_min} onChange={e => set("dur_min", parseInt(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0E72ED]">
              {[30, 45, 60, 90, 120].map(d => (
                <option key={d} value={d}>{d < 60 ? `${d} min` : `${d/60} hr`}</option>
              ))}
            </select>
          </div>
          {err && <p className="text-xs text-red-500 font-semibold">{err}</p>}
          <button onClick={submit} className="w-full py-2.5 bg-[#0E72ED] text-white rounded-md font-semibold text-sm hover:bg-[#0861CC] cursor-pointer">Schedule Meeting</button>
        </div>
      </div>
    </div>
  )
}
