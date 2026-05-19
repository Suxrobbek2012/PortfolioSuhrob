'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { formatDate, safeHref } from '@/lib/utils'
import type { BlogPost } from '@/lib/mdx'
import { useTranslations } from '@/hooks/useTranslations'

export function BlogList({ posts }: { posts: import('@/lib/mdx').BlogPost[] }) {
  const { t } = useTranslations()

  if (posts.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
        <p className="text-lg">{t('blogNoPosts')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.filter((p) => p.slug?.trim()).map((post, i) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Link href={safeHref(`/blog/${post.slug}`, '/blog')} className="block group">
            <div
              className="p-6 rounded-2xl transition-all duration-300 hover:border-[var(--accent)]"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--accent-glow)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(var(--accent-rgb), 0.1)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              <h2
                className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                {post.title}
              </h2>

              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                {post.excerpt}
              </p>

              <div
                className="flex items-center justify-between text-xs"
                style={{ color: 'var(--muted)' }}
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime} {t('blogMinRead')}
                  </span>
                </div>
                <span
                  className="flex items-center gap-1 font-medium transition-colors group-hover:text-[var(--accent)]"
                  style={{ color: 'var(--muted)' }}
                >
                  {t('blogReadMore')} <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}
