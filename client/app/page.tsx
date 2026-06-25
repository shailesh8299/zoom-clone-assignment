"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Mtg } from "@/lib/types"
import { Nav } from "@/ui/nav"
import { Modal } from "@/ui/modal"
import { MtgCard } from "@/ui/mtg-card"

const actions = [
  { icon: "🎥", label: "New Meeting", color: "bg-orange-500", key: "new" },
  { icon: "➕", label: "Join",        color: "bg-blue-500",   key: "join" },
  { icon: "📅", label: "Schedule",    color: "bg-blue-400",   key: "schedule" },
  { icon: "⬆️", label: "Share Screen", color: "bg-green-500", key: "share" },
]

export default function Dashboard() {
  const router = useRouter()
  const [upcoming, setUpcoming] = useState<Mtg[]>([])
  const [recent, setRecent] = useState<Mtg[]>([])
  const [showNew, setShowNew] = useState(false)
  const [joinId, setJoinId] = useState("")
  const [showJoin, setShowJoin] = useState(false)
  const [tab, setTab] = useState<"upcoming" | "recent">("upcoming")

  useEffect(() => {
    api.getUpcoming().then(setUpcoming)
    api.getRecent().then(setRecent)
  }, [])

  async function startInstant() {
    const m = await api.createMtg({ title: "Instant Meeting", dur_min: 60 })
    router.push(`/meet/${m.id}`)
  }

  function handleAction(key: string) {
    if (key === "new") setShowNew(true)
    if (key === "join") setShowJoin(true)
    if (key === "schedule") router.push("/schedule")
  }

  function doJoin() {
    if (joinId.trim()) router.push(`/join?id=${joinId.trim()}`)
  }

  const list = tab === "upcoming" ? upcoming : recent

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {actions.map(a => (
            <button
              key={a.key}
              onClick={() => handleAction(a.key)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`w-14 h-14 ${a.color} rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform`}>
                {a.icon}
              </div>
              <span className="text-xs text-gray-600 font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {(["upcoming", "recent"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors cursor-pointer
                ${tab === t ? "border-b-2 border-[#0E72ED] text-[#0E72ED]" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t === "upcoming" ? "Upcoming" : "Recent"}
            </button>
          ))}
        </div>

        {/* Meeting list */}
        <div className="space-y-2">
          {list.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No {tab} meetings</p>
          ) : (
            list.map(m => <MtgCard key={m.id} mtg={m} type={tab} />)
          )}
        </div>
      </main>

      {/* New Meeting Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Start Meeting">
        <p className="text-sm text-gray-500 mb-4 font-medium">Start an instant meeting right now.</p>
        <button
          onClick={startInstant}
          className="w-full py-2.5 bg-[#0E72ED] text-white rounded-md font-medium hover:bg-[#0861CC] cursor-pointer"
        >
          Start Meeting
        </button>
      </Modal>

      {/* Join Modal */}
      <Modal open={showJoin} onClose={() => setShowJoin(false)} title="Join a Meeting">
        <input
          value={joinId}
          onChange={e => setJoinId(e.target.value)}
          placeholder="Enter Meeting ID"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4 outline-none focus:border-[#0E72ED] text-black font-medium"
        />
        <button
          onClick={doJoin}
          className="w-full py-2.5 bg-[#0E72ED] text-white rounded-md font-medium hover:bg-[#0861CC] cursor-pointer"
        >
          Join
        </button>
      </Modal>
    </div>
  )
}
