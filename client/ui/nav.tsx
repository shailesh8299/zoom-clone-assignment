"use client"
import Link from "next/link"

export function Nav() {
  return (
    <nav className="h-14 border-b border-gray-200 flex items-center px-6 justify-between bg-white sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#0E72ED] rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">Z</span>
        </div>
        <span className="font-semibold text-gray-800 text-sm">Zoom</span>
      </Link>
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-gray-200">
          ⚙️
        </button>
        <div className="w-8 h-8 rounded-full bg-[#0E72ED] flex items-center justify-center text-white text-xs font-semibold">
          U
        </div>
      </div>
    </nav>
  )
}
