'use client'

import { Clock } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export function BlogReadTime({ minutes }: { minutes: number }) {
  const { t } = useTranslations()
  return (
    <span className="flex items-center gap-1.5">
      <Clock size={14} />
      {minutes} {t('blogMinRead')}
    </span>
  )
}
