"use client"
import dynamic from 'next/dynamic'

const ChatBox = dynamic(() => import('./ChatBox'), { ssr: false })

export default function Home() {
  return (
    <main>
      <ChatBox />
    </main>
  )
}
