import { supabase } from '@/lib/supabase'
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        投稿日: {new Date(data.created_at).toLocaleString()}
      </p>
      <div className="prose max-w-none">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </div>
    </div>
  )
}
