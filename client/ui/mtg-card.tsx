import { Mtg } from "@/lib/types"
import { fmtDate, fmtTime, fmtDur } from "@/lib/fmt"
import Link from "next/link"

interface Props {
  mtg: Mtg
  type: "upcoming" | "recent"
}

export function MtgCard({ mtg, type }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 border border-gray-100 group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#0E72ED]/10 flex items-center justify-center text-[#0E72ED] text-lg">
          🎥
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{mtg.title}</p>
          <p className="text-xs text-gray-400">
            {type === "upcoming"
              ? `${fmtDate(mtg.sched_at)} · ${fmtTime(mtg.sched_at)} · ${fmtDur(mtg.dur_min)}`
              : `Started ${fmtDate(mtg.created)} · ${fmtDur(mtg.dur_min)}`}
          </p>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/meet/${mtg.id}`}>
          <button className="text-xs px-3 py-1.5 bg-[#0E72ED] text-white rounded-md hover:bg-[#0861CC]">
            Start
          </button>
        </Link>
        <button
          onClick={() => navigator.clipboard.writeText(mtg.link)}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-100"
        >
          Copy Link
        </button>
      </div>
    </div>
  )
}
