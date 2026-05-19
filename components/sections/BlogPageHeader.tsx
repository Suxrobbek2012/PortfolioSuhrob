'use client'

import { useTranslations } from '@/hooks/useTranslations'

export function BlogPageHeader() {
  const { t } = useTranslations()
  const accent = t('blogTitleAccent')

  return (
    <div className="mb-12">
      <span
        className="text-sm font-semibold tracking-widest uppercase"
        style={{ color: 'var(--accent)' }}
      >
        {t('blogKicker')}
      </span>
      <h1 className="text-4xl md:text-5xl font-black mt-2" style={{ color: 'var(--foreground)' }}>
        {t('blogTitleLead')}{' '}
        {accent ? <span style={{ color: 'var(--accent)' }}>{accent}</span> : null}
      </h1>
      <p className="mt-4" style={{ color: 'var(--muted)' }}>
        {t('blogSubtitle')}
      </p>
    </div>
  )
}
