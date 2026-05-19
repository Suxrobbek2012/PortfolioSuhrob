'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Briefcase, MapPin, Calendar } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { localizeExperience } from '@/lib/locale-content'

interface Experience {
  id: string
  title: string
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  order: number
}

function TimelineEntry({
  exp,
  index,
}: {
  exp: Experience
  index: number
}) {
  const { t, lang } = useTranslations()
  const localized = useMemo(() => localizeExperience(exp, lang), [exp, lang])
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-12`}
    >
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 max-w-md"
        style={{ textAlign: isLeft ? 'right' : 'left' }}
      >
        <div
          className="p-6 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {/* Header */}
          <div className={`flex items-start gap-3 mb-3 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className="p-2 rounded-lg flex-shrink-0"
              style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}
            >
              <Briefcase size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <div className={isLeft ? 'text-right' : 'text-left'}>
              <h3 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
                {localized.title}
              </h3>
              <p className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
                {localized.company}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div
            className={`flex flex-wrap gap-3 mb-3 text-xs ${isLeft ? 'justify-end' : 'justify-start'}`}
            style={{ color: 'var(--muted)' }}
          >
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {exp.startDate} — {exp.current ? t('present') : exp.endDate}
            </span>
            {localized.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {localized.location}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {localized.description}
          </p>

          {exp.current && (
            <div className="mt-3">
              <span
                className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(var(--accent-rgb), 0.1)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(var(--accent-rgb), 0.2)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--accent)' }}
                />
                {t('currentPosition')}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Center Dot */}
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative w-5 h-5 rounded-full z-10"
          style={{ background: 'var(--accent)', boxShadow: 'var(--accent-glow)' }}
        >
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(var(--accent-rgb), 0.3)' }}
          />
        </motion.div>
      </div>

      {/* Spacer for opposite side */}
      <div className="flex-1 max-w-md" />
    </div>
  )
}

interface TimelineSectionProps {
  experience: Experience[]
}

export function TimelineSection({ experience }: TimelineSectionProps) {
  const { t } = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="experience" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: 'var(--accent)' }}
          >
            {t('timelineKicker')}
          </span>
          <h2
            className="text-4xl md:text-5xl font-black mt-2"
            style={{ color: 'var(--foreground)' }}
          >
            {t('timelineTitleLead')}{' '}
            <span style={{ color: 'var(--accent)' }}>{t('timelineTitleAccent')}</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'var(--border)' }}
          >
            <motion.div
              className="w-full origin-top"
              style={{
                height: lineHeight,
                background: 'linear-gradient(to bottom, var(--accent), var(--accent-secondary, var(--accent)))',
              }}
            />
          </div>

          {/* Entries */}
          <div className="relative">
            {experience.map((exp, i) => (
              <TimelineEntry key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
