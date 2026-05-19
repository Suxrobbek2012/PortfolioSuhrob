import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { BlogList } from '@/components/sections/BlogList'
import { BlogPageHeader } from '@/components/sections/BlogPageHeader'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on web development, design, and technology.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <BlogPageHeader />

        <BlogList posts={posts} />
      </div>
    </div>
  )
}
