'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import { FiHelpCircle, FiHome, FiUpload } from 'react-icons/fi'
import Link from 'next/link'

export default function MarkdownEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit') // ← タブ状態を管理
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const ext = selectedFile.name.split('.').pop()
    const filePath = `${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(filePath, selectedFile)

    if (uploadError) {
      alert('画像アップロード失敗')
      return
    }

    const { data } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath)

    if (data?.publicUrl) {
      setContent(prev => `${prev}\n![画像](${data.publicUrl})\n`)
    }
  }

  async function handleSubmit() {
    if (!title || !content) return

    const { error } = await supabase.from('articles').insert([
      { title, content }
    ])

    if (error) {
      alert('保存失敗')
    } else {
      alert('記事を投稿しました')
      setTitle('')
      setContent('')
      setTab('edit')
    }
  }

  return (
    <div className="max-w-md md:mx-auto my-8 mx-4">
      <header className="flex items-center bg-white mb-4">
        <Link href="/articles" className="rounded-full outline-none ring-blue-200 focus:ring-2 ring-offset-2 duration-200">
          <div className="w-8 aspect-square border rounded-full flex items-center justify-center"><FiHome /></div>
        </Link>
        <Link href="/helps#articles" className="ml-auto rounded-full outline-none ring-blue-200 focus:ring-2 ring-offset-2 duration-200">
          <div className="w-8 aspect-square border rounded-full flex items-center justify-center"><FiHelpCircle /></div>
        </Link>
      </header>

      <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>

      <input
        type="text"
        placeholder="タイトル"
        className="mb-2 w-full border px-4 py-2 rounded-md outline-none duration-200 focus:ring-2 ring-blue-200 focus:border-blue-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex mb-4">
        <button onClick={handleUploadClick} className="flex items-center gap-2 px-4 py-2 border rounded-md shadow-sm w-full justify-center outline-none duration-200 focus:ring-2 ring-offset-2 whitespace-nowrap">
          <FiUpload />
          Upload Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex">
        <button
          onClick={() => setTab('edit')}
          className={`flex-1 px-4 py-2 rounded-md font-semibold rounded-b-none outline-none focus:ring-2 ring-offset-2 focus:z-10 duration-200 ${tab === 'edit' ? 'bg-primary text-white' : 'bg-white'}`}
        >
          Edit
        </button>
        <button
          onClick={() => setTab('preview')}
          className={`flex-1 px-4 py-2 rounded-md font-semibold rounded-b-none outline-none focus:ring-2 ring-offset-2 focus:z-10 duration-200 ${tab === 'preview' ? 'bg-primary text-white' : 'bg-white'}`}
        >
          Preview
        </button>
      </div>

      {tab === 'edit' ? (
        <textarea
          className="w-full h-96 border p-4 rounded-md rounded-tl-none mb-4 outline-none duration-200 focus:ring-2 ring-blue-200 focus:border-blue-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Markdownを入力..."
        />
      ) : (
        <div className="prose max-w-none mb-4 bg-white rounded-tr-none p-4 border rounded-md h-96 overflow-y-auto">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-gray-950 text-white px-4 py-2 rounded-md duration-200 font-bold whitespace-nowrap outline-none duration-200 focus:ring-2 ring-offset-2 w-full"
      >
        Publish
      </button>
    </div>
  )
}
