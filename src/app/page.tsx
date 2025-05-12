"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="flex items-center justify-center  flex-col min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
      <h1 className="text-5xl font-bold drop-shadow-sm">MukakinTV</h1>
      <div className="mt-4 flex max-w-md gap-2 flex-wrap w-fit">
      <Link href="/chat"><p className="px-4 py-2 rounded-full bg-white text-blue-600 shadow-md hover:shadow-lg duration-200 hover:translate-y-[-8px] font-bold">チャット</p></Link>
      </div>
    </main>
  )
}
