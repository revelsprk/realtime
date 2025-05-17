'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'

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
    <div className="max-w-md md:mx-auto mb-8 mx-4">
      <header className="flex justify-center sticky top-0 py-4">
        <Link href="/"><Image src="/logo.svg" alt='Mukakin TV' width={100} height={100} className="w-64 drop-shadow-lg h-fit select-none" /></Link>
      </header>
      <div className="flex justify-center my-4">
        <Link href="/editor"><div className="w-10 aspect-square border rounded-full flex items-center justify-center text-xl text-gray-400"><FaPlus /></div></Link>
      </div>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="border p-4 rounded-md hover:bg-gray-50 duration-200 shadow-sm">
            <Link href={`/articles/${article.id}`}>
              <p className="text-lg font-semibold">{article.title}</p>
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
