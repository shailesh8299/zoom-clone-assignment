"use client"
import { useEffect, useState, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { Mtg, Part } from "@/lib/types"
import { VideoGrid } from "@/ui/meet-video-grid"
import { MeetSidebar } from "@/ui/meet-sidebar"
import { Modal } from "@/ui/modal"

function MeetRoom() {
  const { rid } = useParams<{ rid: string }>()
  const sp = useSearchParams()
  const myName = sp.get("name") || "You"
  const [mtg, setMtg] = useState<Mtg | null>(null)
  const [parts, setParts] = useState<Part[]>([])
  const [muted, setMuted] = useState(false)
  const [vid, setVid] = useState(true)
  const [side, setSide] = useState<"parts" | "chat" | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [secOpen, setSecOpen] = useState(false)
  const [sec, setSec] = useState({ lock: false, wait: true })

  useEffect(() => {
    api.getMtg(rid).then(setMtg).catch(() => {})
    api.getParts(rid).then(setParts).catch(() => {})
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(setStream)
      .catch(err => console.warn("No media: ", err))
    return () => {
      stream?.getTracks().forEach(t => t.stop())
      screenStream?.getTracks().forEach(t => t.stop())
    }
  }, [rid])

  const toggleMute = () => {
    setMuted(m => {
      const next = !m
      stream?.getAudioTracks().forEach(t => t.enabled = !next)
      return next
    })
  }

  const toggleVid = () => {
    setVid(v => {
      const next = !v
      stream?.getVideoTracks().forEach(t => t.enabled = next)
      return next
    })
  }

  const toggleShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop())
      setScreenStream(null)
    } else {
      try {
        const s = await navigator.mediaDevices.getDisplayMedia({ video: true })
        s.getVideoTracks()[0].onended = () => setScreenStream(null)
        setScreenStream(s)
      } catch (e) {
        console.warn(e)
      }
    }
  }

  if (!mtg) return <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center text-white font-semibold">Joining meeting...</div>

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1C1C1C] border-b border-gray-700">
        <div>
          <p className="text-white text-sm font-medium">{mtg.title} {sec.lock && "🔒 (Locked)"}</p>
          <p className="text-gray-400 text-xs">Meeting ID: {mtg.id}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigator.clipboard.writeText(mtg.link)} className="px-3 py-1.5 text-xs border border-gray-600 text-gray-300 rounded hover:bg-gray-700 cursor-pointer">Copy Link</button>
          <button onClick={() => setSide(s => s === "parts" ? null : "parts")} className="px-3 py-1.5 text-xs border border-gray-600 text-gray-300 rounded hover:bg-gray-700 cursor-pointer">👥 {parts.length + 1}</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <VideoGrid myName={myName} parts={parts} vid={vid} muted={muted} stream={stream} screenStream={screenStream} />
        {side && <MeetSidebar tab={side} onClose={() => setSide(null)} parts={parts} myName={myName} />}
      </div>

      <div className="flex items-center justify-center gap-4 py-4 bg-[#242424] border-t border-gray-700 select-none">
        <button onClick={toggleMute} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${muted ? "bg-red-600 text-white" : "hover:bg-gray-700 text-gray-200"}`}>
          <span className="text-xl">{muted ? "🔇" : "🎤"}</span>
          <span className="text-xs">{muted ? "Unmute" : "Mute"}</span>
        </button>
        <button onClick={toggleVid} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${!vid ? "bg-red-600 text-white" : "hover:bg-gray-700 text-gray-200"}`}>
          <span className="text-xl">{vid ? "🎥" : "📷"}</span>
          <span className="text-xs">{vid ? "Stop Video" : "Start Video"}</span>
        </button>
        <button onClick={() => setSecOpen(true)} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-200 cursor-pointer ${sec.lock ? "text-[#0E72ED]" : ""}`}>
          <span className="text-xl">🔒</span>
          <span className="text-xs">Security</span>
        </button>
        <button onClick={() => setSide(s => s === "parts" ? null : "parts")} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${side === "parts" ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-200"}`}>
          <span className="text-xl">👥</span>
          <span className="text-xs">Participants</span>
        </button>
        <button onClick={() => setSide(s => s === "chat" ? null : "chat")} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${side === "chat" ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-200"}`}>
          <span className="text-xl">💬</span>
          <span className="text-xs">Chat</span>
        </button>
        <button onClick={toggleShare} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${screenStream ? "bg-green-600 text-white animate-pulse" : "hover:bg-gray-700 text-gray-200"}`}>
          <span className="text-xl">↑</span>
          <span className="text-xs">Share Screen</span>
        </button>
        <button onClick={() => window.location.href = "/"} className="ml-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg cursor-pointer">Leave</button>
      </div>

      <Modal open={secOpen} onClose={() => setSecOpen(false)} title="Security options">
        <div className="space-y-4 py-2 text-black font-semibold text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={sec.lock} onChange={e => setSec(s => ({ ...s, lock: e.target.checked }))} />
            <span>Lock Meeting</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={sec.wait} onChange={e => setSec(s => ({ ...s, wait: e.target.checked }))} />
            <span>Enable Waiting Room</span>
          </label>
        </div>
      </Modal>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center text-white font-semibold">Loading meeting room...</div>}>
      <MeetRoom />
    </Suspense>
  )
}
