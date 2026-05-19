'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Download, MapPin, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { useLocalizedSettings } from '@/hooks/useLocalizedSettings'

function CounterStat({ value, label, suffix = '+' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-black" style={{ color: 'var(--accent)' }}>
        {count}{suffix}
      </div>
      <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
        {label}
      </div>
    </div>
  )
}

interface AboutSectionProps {
  settings: Record<string, string>
}

export function AboutSection({ settings }: AboutSectionProps) {
  const { t, tf } = useTranslations()
  const localized = useLocalizedSettings(settings)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Image */}
          <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Rotating border */}
              <div
                className="absolute -inset-2 rounded-2xl opacity-70"
                style={{
                  background: `conic-gradient(from 0deg, var(--accent), transparent, var(--accent))`,
                  animation: 'borderRotate 8s linear infinite',
                  borderRadius: '1rem',
                }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  border: '3px solid var(--surface)',
                  background: 'linear-gradient(135deg, var(--surface), var(--surface-2))',
                }}
              >
                {/* Initials fallback — always shown */}
                <div
                  className="text-6xl font-black select-none"
                  style={{ color: 'var(--accent)' }}
                >
                  SB
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="flex flex-col gap-6">
            <motion.div variants={itemVariants}>
              <span
                className="text-sm font-semibold tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}
              >
                {t('aboutKicker')}
              </span>
              <h2
                className="text-4xl md:text-5xl font-black mt-2"
                style={{ color: 'var(--foreground)' }}
              >
                {t('aboutTitleLead')}{' '}
                <span style={{ color: 'var(--accent)' }}>{t('aboutTitleAccent')}</span>
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              {localized.bio}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              {tf('aboutSecondParagraph', { years: localized.yearsExperience })}
            </motion.p>

            {/* Info Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: MapPin, label: t('location'), value: localized.location },
                { icon: Mail, label: t('email'), value: localized.email },
                { icon: Calendar, label: t('expLabel'), value: `${localized.yearsExperience}+` },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <Icon size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CV Button */}
            <motion.div variants={itemVariants}>
              <Link href="/cv.pdf" target="_blank">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm group"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--background)',
                  }}
                >
                  <Download
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                  {t('heroDownloadCv')}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <CounterStat value={parseInt(localized.yearsExperience)} label={t('aboutStatYears')} suffix="+" />
            <CounterStat value={parseInt(localized.projectsCompleted)} label={t('aboutStatProjects')} suffix="+" />
            <CounterStat value={parseInt(localized.happyClients)} label={t('aboutStatClients')} suffix="+" />
            <CounterStat value={parseInt(localized.coffeeConsumed)} label={t('aboutStatCoffee')} suffix="+" />
          </motion.div>
      </div>
    </section>
  )
}
