import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { formatDate } from '@/lib/utils'
import { Calendar, Tag } from 'lucide-react'
import { ReadingProgress } from '@/components/ui/ReadingProgress'
import { LocalizedBackLink } from '@/components/ui/LocalizedBackLink'
import { BlogReadTime } from '@/components/ui/BlogReadTime'

interface Props {
  params: { slug?: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts
    .map((p) => p.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params?.slug?.trim()
  if (!slug) return {}
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const slug = params?.slug?.trim()
  if (!slug) notFound()

  const post = getPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Suhrobbek Baxtiyorov',
    },
  }

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <LocalizedBackLink />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.1)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(var(--accent-rgb), 0.2)',
                  }}
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="text-4xl md:text-5xl font-black leading-tight mb-6"
              style={{ color: 'var(--foreground)' }}
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--muted)' }}>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <BlogReadTime minutes={post.readTime} />
            </div>

            <div
              className="mt-6 pt-6"
              style={{ borderTop: '1px solid var(--border)' }}
            />
          </header>

          {/* Content */}
          <div className="prose max-w-none">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>
    </>
  )
}
