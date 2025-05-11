'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Message = {
  id: string
  username: string
  content: string
  inserted_at: string
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [username, setUsername] = useState('')
  const [content, setContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('inserted_at', { ascending: true })
    if (data) setMessages(data as Message[])
  }

  async function sendMessage() {
    if (!content || !username) return

    const { error } = await supabase.from('messages').insert([
      { username, content }
    ])

    if (error) {
      console.error('送信エラー:', error.message)
      alert('送信に失敗しました')
    } else {
      setContent('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white text-xl font-bold py-4 px-6 shadow">
        リアルタイムチャット
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.username === username ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs break-words px-4 py-2 rounded-lg shadow ${
                msg.username === username
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="text-xs font-semibold opacity-70 mb-1">
                {msg.username}
              </div>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-white border-t flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="名前"
          className="border px-3 py-2 rounded w-full sm:w-1/4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="メッセージを入力"
          className="border px-3 py-2 rounded flex-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          送信
        </button>
      </footer>
    </div>
  )
}
