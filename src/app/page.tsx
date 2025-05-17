"use client"

import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
      <div className="max-w-md md:mx-auto mx-4">
        <Image src="/logo.svg" alt="MukakinTV" width={100} height={100} className="w-full select-none drop-shadow-lg" />
        <div className="mt-6 gap-2 flex flex-wrap">
          <Link href="/chat"><p className="px-4 py-2 rounded-full border-2 border-white text-white shadow-md hover:shadow-lg duration-200 hover:translate-y-[-6px] font-bold">Realtime Chat</p></Link>
          <Link href="/articles"><p className="px-4 py-2 rounded-full border-2 border-white text-white shadow-md hover:shadow-lg duration-200 hover:translate-y-[-6px] font-bold">Articles</p></Link>
        </div>
      </div>
    </main>
  )
}
