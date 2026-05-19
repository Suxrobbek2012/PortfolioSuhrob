'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { safeHref } from '@/lib/utils'

export function LocalizedBackLink({ href = '/blog' }: { href?: string }) {
  const { t } = useTranslations()
  return (
    <Link
      href={safeHref(href, '/blog')}
      className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[var(--accent)]"
      style={{ color: 'var(--muted)' }}
    >
      <ArrowLeft size={16} />
      {t('blogBack')}
    </Link>
  )
}
