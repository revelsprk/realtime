import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

type Props = {
  params: {
    id: string
  }
}

export default async function ArticleDetail({ params }: Props) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return <div className="p-6 text-red-500">記事が見つかりませんでした。</div>
  }

  return (
    <div className="max-w-md md:mx-auto mb-8 mx-4">
      <header className="flex justify-center bg-white sticky top-0 py-4">
        <Link href="/"><Image src="/logo.svg" alt='Mukakin TV' width={100} height={100} className="w-48 h-fit select-none" /></Link>
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
