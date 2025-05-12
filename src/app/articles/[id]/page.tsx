// app/articles/[id]/page.tsx
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

// ✅ 型注釈：params は Promise で渡される
type Props = {
  params: Promise<{ id: string }>
}

// ✅ generateStaticParams（問題なし、修正不要）
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { data, error } = await supabase.from('articles').select('id')

  if (error || !data) return []

  return data.map((article) => ({
    id: article.id.toString(),
  }))
}

// ✅ ページ本体（params を await で受け取る）
export default async function ArticleDetail({ params }: Props) {
  const { id } = await params // ← ここがキモ

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return <div className="p-6 text-red-500">記事が見つかりませんでした。</div>
  }

  return (
    <div className="max-w-md md:mx-auto mb-8 mx-4">
      <header className="flex justify-center bg-white sticky top-0 py-4">
        <Link href="/">
          <Image src="/logo.svg" alt="Mukakin TV" width={100} height={100} className="w-48 h-fit select-none" />
        </Link>
      </header>
      <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
      <p className="text-sm text-gray-400 mb-6">
        Created at: {new Date(data.created_at).toLocaleString()}
      </p>
      <div className="prose max-w-none">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </div>
    </div>
  )
}
