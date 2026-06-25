import { useState, useEffect } from "react"
import { Part } from "@/lib/types"

interface ChatMsg {
  sender: string
  text: string
  time: string
}

interface SidebarProps {
  tab: "parts" | "chat"
  onClose: () => void
  parts: Part[]
  myName: string
}

export function MeetSidebar({ tab, onClose, parts, myName }: SidebarProps) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { sender: "Sarah Lee", text: "Hi everyone! Glad to join.", time: "10:02 AM" },
  ])
  const [inp, setInp] = useState("")

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inp.trim()) return
    const newMsg = {
      sender: myName,
      text: inp.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
    setMsgs(prev => [...prev, newMsg])
    setInp("")

    // Auto simulated response
    setTimeout(() => {
      const respName = parts.length > 0 ? parts[Math.floor(Math.random() * parts.length)].name : "Alex Kim"
      const replies = [
        "Thanks for sharing!",
        "Yes, I agree with that.",
        "Could you explain that more?",
        "Sounds good to me!",
      ]
      setMsgs(prev => [...prev, {
        sender: respName,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }])
    }, 1500)
  }

  return (
    <div className="absolute right-0 top-14 bottom-16 w-80 bg-[#2D2D2D] border-l border-gray-700 p-4 flex flex-col z-40">
      <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-4">
        <h3 className="text-white font-medium text-sm capitalize">{tab} ({tab === "parts" ? parts.length + 1 : msgs.length})</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl font-medium cursor-pointer">×</button>
      </div>

      {tab === "parts" ? (
        <div className="flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
            <div className="w-8 h-8 rounded-full bg-[#0E72ED] flex items-center justify-center text-white text-xs">
              {myName[0]?.toUpperCase()}
            </div>
            {myName} (You)
          </div>
          {parts.map(p => (
            <div key={p.id} className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
                {p.name[0]?.toUpperCase()}
              </div>
              {p.name} {p.is_host && <span className="text-xs text-gray-500 font-normal">(Host)</span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {msgs.map((m, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-semibold ${m.sender === myName ? "text-[#0E72ED]" : "text-green-400"}`}>
                    {m.sender}
                  </span>
                  <span className="text-[10px] text-gray-500">{m.time}</span>
                </div>
                <p className="text-gray-300 break-words font-medium bg-white/5 p-2 rounded-lg">{m.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-3 flex gap-2">
            <input
              value={inp}
              onChange={e => setInp(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-xs text-white outline-none focus:border-[#0E72ED]"
            />
            <button type="submit" className="bg-[#0E72ED] text-white px-3 py-1 rounded text-xs hover:bg-[#0861CC] font-semibold cursor-pointer">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
