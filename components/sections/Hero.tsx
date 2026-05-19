'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Mail, GitBranch, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { TechIcons } from '@/components/ui/TechIcons'
import { useTranslations } from '@/hooks/useTranslations'
import { useLocalizedSettings } from '@/hooks/useLocalizedSettings'
import { safeHref } from '@/lib/utils'

const Hero3D = dynamic(() => import('@/components/three/Hero3D').then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
})

const FLOATING_TECH = [
  { key: 'react', Icon: TechIcons.react, top: '18%', left: '8%', delay: 0, duration: 5 },
  { key: 'nextjs', Icon: TechIcons.nextjs, top: '25%', left: '88%', delay: 0.5, duration: 6 },
  { key: 'typescript', Icon: TechIcons.typescript, top: '65%', left: '6%', delay: 1, duration: 4.5 },
  { key: 'tailwind', Icon: TechIcons.tailwind, top: '70%', left: '90%', delay: 1.5, duration: 5.5 },
  { key: 'nodejs', Icon: TechIcons.nodejs, top: '45%', left: '4%', delay: 0.8, duration: 6.5 },
  { key: 'git', Icon: TechIcons.git, top: '40%', left: '92%', delay: 1.2, duration: 4 },
]

function TypingText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor((v) => !v), 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const current = texts[currentIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setCurrentIndex((i) => (i + 1) % texts.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, currentIndex, texts])

  return (
    <span>
      <span style={{ color: 'var(--accent)' }}>{displayed}</span>
      <span
        className="inline-block w-0.5 h-6 ml-1 align-middle"
        style={{
          background: 'var(--accent)',
          opacity: showCursor ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      />
    </span>
  )
}

interface HeroSectionProps {
  settings: Record<string, string>
}

export function HeroSection({ settings }: HeroSectionProps) {
  const { t } = useTranslations()
  const localized = useLocalizedSettings(settings)
  const roles = useMemo(
    () => [t('heroRole1'), t('heroRole2'), t('heroRole3'), t('heroRole4')],
    [t]
  )

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Hero3D accentColor="var(--accent)" />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, var(--background) 80%)',
        }}
      />

      {/* Floating Tech Icons */}
      {FLOATING_TECH.map(({ key, Icon, top, left, delay, duration }) => (
        <motion.div
          key={key}
          className="absolute z-[2] pointer-events-none"
          style={{ top, left }}
          animate={{ y: [0, -18, 0] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="p-2.5 rounded-xl"
            style={{
              background: 'rgba(var(--accent-rgb), 0.06)',
              border: '1px solid rgba(var(--accent-rgb), 0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Icon size={22} className="opacity-60" />
          </div>
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Available badge */}
          <motion.div variants={itemVariants}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(var(--accent-rgb), 0.1)',
                border: '1px solid rgba(var(--accent-rgb), 0.3)',
                color: 'var(--accent)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'var(--accent)' }}
              />
              {t('heroAvailable')}
            </span>
          </motion.div>

          {/* Name with Glitch */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
            style={{
              color: 'var(--foreground)',
              animation: 'glitch 4s ease-in-out infinite',
            }}
          >
            {localized.name}
          </motion.h1>

          {/* Typing Role */}
          <motion.div variants={itemVariants} className="text-xl md:text-2xl font-medium h-8">
            <TypingText key={roles.join('|')} texts={roles} />
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base md:text-lg leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {localized.bio}
          </motion.p>

          {/* Location */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {localized.location}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 mt-2"
          >
            <Link href="#projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--background)',
                  boxShadow: 'var(--accent-glow)',
                }}
              >
                {t('heroViewWork')}
              </motion.button>
            </Link>

            <Link href="/cv.pdf" target="_blank">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 group"
                style={{
                  background: 'transparent',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--foreground)'
                }}
              >
                <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                {t('heroDownloadCv')}
              </motion.button>
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            {[
              { href: safeHref(localized.github, '#'), icon: GitBranch, label: 'GitHub' },
              { href: safeHref(localized.linkedin, '#'), icon: ExternalLink, label: 'LinkedIn' },
              {
                href: safeHref(
                  localized.email?.trim()
                    ? `mailto:${localized.email.trim()}`
                    : 'mailto:suhrobbek@portfolio.dev',
                  '#'
                ),
                icon: Mail,
                label: 'Email',
              },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={label} href={href} target="_blank" aria-label={label}>
                <motion.div
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="p-2.5 rounded-xl transition-colors"
                  style={{ color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  }}
                >
                  <Icon size={18} />
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ color: 'var(--muted)' }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">{t('heroScroll')}</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={18} style={{ color: 'var(--accent)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
