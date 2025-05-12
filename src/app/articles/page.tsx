'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Article = {
  id: string
  title: string
  created_at: string
}

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setArticles(data)
      }
    }

    fetchArticles()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="border p-4 rounded hover:bg-gray-50 transition">
            <Link href={`/articles/${article.id}`}>
              <p className="text-lg font-semibold">{article.title}</p>
              <p className="text-sm text-gray-500">
                投稿日: {new Date(article.created_at).toLocaleString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
