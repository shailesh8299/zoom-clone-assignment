"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { Nav } from "@/ui/nav"

function JoinForm() {
  const router = useRouter()
  const sp = useSearchParams()
  const [rid, setRid] = useState(sp.get("id") || "")
  const [name, setName] = useState("")
  const [err, setErr] = useState("")

  async function submit() {
    if (!rid.trim() || !name.trim()) {
      setErr("Please fill in both fields")
      return
    }
    try {
      await api.getMtg(rid.trim())
      await api.joinMtg(rid.trim(), name.trim())
      router.push(`/meet/${rid.trim()}?name=${encodeURIComponent(name)}`)
    } catch {
      setErr("Meeting not found. Check the ID and try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Join Meeting</h1>
          <p className="text-sm text-gray-400 mb-6">Enter the meeting ID and your name</p>

          <div className="space-y-3">
            <input
              value={rid}
              onChange={e => setRid(e.target.value)}
              placeholder="Meeting ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#0E72ED] focus:ring-1 focus:ring-[#0E72ED] text-black font-medium"
            />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#0E72ED] focus:ring-1 focus:ring-[#0E72ED] text-black font-medium"
            />
            {err && <p className="text-xs text-red-500 font-medium">{err}</p>}
            <button
              onClick={submit}
              className="w-full py-2.5 bg-[#0E72ED] text-white rounded-md font-medium text-sm hover:bg-[#0861CC] cursor-pointer"
            >
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-500 text-sm font-medium">Loading...</div>}>
      <JoinForm />
    </Suspense>
  )
}
