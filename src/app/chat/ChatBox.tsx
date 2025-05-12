'use client'

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { FiUpload } from 'react-icons/fi';
import Image from 'next/image';

type Message = {
  id: string
  username: string
  content: string
  inserted_at: string
  image_url?: string
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [username, setUsername] = useState('')
  const [content, setContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleButtonClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

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
    if (!username || (!content && !file)) return
  
    let imageUrl = null
  
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${username}/${fileName}`
  
      const { error: uploadError } = await supabase.storage
        .from('chat-images') // ← バケット名
        .upload(filePath, file)
  
      if (uploadError) {
        console.error('Upload error:', uploadError.message)
        alert('画像のアップロードに失敗しました')
        return
      }
  
      const { data: imageData } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath)
  
      imageUrl = imageData?.publicUrl || null
    }
  
    const { error } = await supabase.from('messages').insert([
      {
        username,
        content,
        image_url: imageUrl,
      },
    ])
  
    if (error) {
      console.error('送信エラー:', error.message)
      alert('送信に失敗しました')
    } else {
      setContent('')
      setFile(null)
    }
  }
  

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50 md:border-l md:border-r overflow-hidden">
      <header className="bg-blue-600 text-white text-xl font-bold py-4 px-6 shadow-md sticky top-0">
        MukakinTV
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
              className={`max-w-xs break-words px-4 py-2 rounded-lg shadow-sm ${
                msg.username === username
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
            >
              <div className="text-sm font-semibold opacity-50 select-none">
                {msg.username}
              </div>
              <div>{msg.content &&(<p className="mt-1">{msg.content}</p>)}
              {msg.image_url && (
  <Image
    src={msg.image_url}
    alt="uploaded" width={100} height={100}
    className="rounded-md w-64 mt-1 select-none"
  />
)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-white border-t flex flex-col sm:flex-row gap-2">
        <div className="flex flex-row gap-2">
        <input
          type="text"
          placeholder="名前"
          className="w-16 border px-4 py-2 rounded-md w-full outline-none duration-200 focus:ring-2 ring-blue-200 focus:border-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="メッセージを入力"
          className="w-full border px-4 py-2 rounded-md flex-1 outline-none duration-200 focus:ring-2 ring-blue-200 focus:border-blue-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
        />
    <button
      type="button"
      onClick={handleButtonClick}
      className="flex items-center justify-center duration-200 h-11 aspect-square border rounded-md outline-none duration-200 focus:ring-2 ring-blue-200 focus:border-blue-400"
    >
      <FiUpload className="text-gray-600" />
    </button>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />
    </div>
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 duration-200 font-bold whitespace-nowrap outline-none duration-200 focus:bg-blue-700"
        >
          送信
        </button>
      </footer>
    </div>
  )
}
