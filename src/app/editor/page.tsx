'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import { FiUpload } from 'react-icons/fi'

export default function MarkdownEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
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
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Markdown記事投稿</h1>

      <input
        type="text"
        placeholder="タイトル"
        className="w-full border p-2 mb-4 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <button onClick={handleUploadClick} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded">
          <FiUpload />
          画像アップロード
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <textarea
        className="w-full h-60 border p-2 rounded mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Markdownを入力..."
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        投稿
      </button>

      <h2 className="text-xl font-semibold mt-8">プレビュー</h2>
      <div className="prose max-w-none mt-4 bg-white p-4 border rounded">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
