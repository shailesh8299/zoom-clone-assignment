import { useEffect, useRef } from "react"
import { Part } from "@/lib/types"

interface VideoProps {
  stream: MediaStream | null
  label: string
  muted?: boolean
  off?: boolean
  bg?: string
}

export function VideoTile({ stream, label, muted, off, bg = "bg-[#0E72ED]" }: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="aspect-video bg-gray-800 rounded-xl flex flex-col items-center justify-center border border-gray-700 relative overflow-hidden">
      {!off && stream ? (
        <video ref={ref} autoPlay playsInline muted className="w-full h-full object-cover" />
      ) : (
        <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center text-white text-2xl font-bold`}>
          {label[0]?.toUpperCase()}
        </div>
      )}
      {off && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-gray-500 text-sm font-semibold">
          Camera off
        </div>
      )}
      <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded font-medium">
        {label}
      </span>
      {muted && (
        <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
          🔇
        </span>
      )}
    </div>
  )
}

interface GridProps {
  myName: string
  parts: Part[]
  vid: boolean
  muted: boolean
  stream: MediaStream | null
  screenStream: MediaStream | null
}

export function VideoGrid({ myName, parts, vid, muted, stream, screenStream }: GridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-4xl w-full">
      {/* Local User camera */}
      <VideoTile stream={stream} label={`${myName} (You)`} muted={muted} off={!vid} />

      {/* Local Screen Share if active */}
      {screenStream && (
        <VideoTile stream={screenStream} label="Your Screen" bg="bg-green-600" />
      )}

      {/* Other participants */}
      {parts.slice(0, 3).map(p => (
        <VideoTile key={p.id} stream={null} label={`${p.name}${p.is_host ? " (Host)" : ""}`} bg="bg-green-600" />
      ))}
    </div>
  )
}
