'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Mail, MapPin, GitBranch, ExternalLink, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslations } from '@/hooks/useTranslations'
import { useLocalizedSettings } from '@/hooks/useLocalizedSettings'
import { safeHref } from '@/lib/utils'

type FormState = 'idle' | 'loading' | 'success' | 'error'

function FloatingInput({
  label,
  name,
  type = 'text',
  required,
  value,
  onChange,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  value: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0

  return (
    <div className="floating-label-group">
      <input
        type={type}
        name={name}
        id={name}
        placeholder=" "
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label
        htmlFor={name}
        style={{
          top: focused || hasValue ? '0.35rem' : '1rem',
          fontSize: focused || hasValue ? '0.75rem' : '1rem',
          color: focused ? 'var(--accent)' : 'var(--muted)',
        }}
      >
        {label}
      </label>
    </div>
  )
}

function FloatingTextarea({
  label,
  name,
  required,
  value,
  onChange,
}: {
  label: string
  name: string
  required?: boolean
  value: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0

  return (
    <div className="floating-label-group">
      <textarea
        name={name}
        id={name}
        placeholder=" "
        required={required}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ resize: 'none' }}
      />
      <label
        htmlFor={name}
        style={{
          top: focused || hasValue ? '0.35rem' : '1rem',
          fontSize: focused || hasValue ? '0.75rem' : '1rem',
          color: focused ? 'var(--accent)' : 'var(--muted)',
        }}
      >
        {label}
      </label>
    </div>
  )
}

export function ContactSection({ settings = {} }: { settings?: Record<string, string> }) {
  const { t } = useTranslations()
  const localized = useLocalizedSettings(settings)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const formRef = useRef<HTMLFormElement>(null)

  const [formState, setFormState] = useState<FormState>('idle')
  const [shake, setShake] = useState(false)
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (!res.ok) throw new Error('Failed')

      setFormState('success')
      toast.success(t('toastSuccess'))
      setFields({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => setFormState('idle'), 3000)
    } catch {
      setFormState('error')
      setShake(true)
      toast.error(t('toastError'))
      setTimeout(() => { setShake(false); setFormState('idle') }, 1000)
    }
  }

  return (
    <section id="contact" className="py-24 px-6" ref={ref}>
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
            {t('contactKicker')}
          </span>
          <h2
            className="text-4xl md:text-5xl font-black mt-2"
            style={{ color: 'var(--foreground)' }}
          >
            {t('contactTitleLead')}{' '}
            <span style={{ color: 'var(--accent)' }}>{t('contactTitleAccent')}</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            {t('contactSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {t('contactInfoTitle')}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {t('contactInfoSubtitle')}
              </p>
            </div>

            {[
              { icon: Mail, label: t('email'), value: localized.email },
              { icon: MapPin, label: t('location'), value: localized.location },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}
                >
                  <Icon size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
                  <div className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="flex gap-3 mt-4">
              {[
                { href: safeHref(localized.github, '#'), icon: GitBranch },
                { href: safeHref(localized.linkedin, '#'), icon: ExternalLink },
              ].map(({ href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-8 rounded-2xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                animation: shake ? 'shake 0.5s ease-in-out' : 'none',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label={t('yourName')}
                  name="name"
                  required
                  value={fields.name}
                  onChange={(v) => setFields((f) => ({ ...f, name: v }))}
                />
                <FloatingInput
                  label={t('emailAddress')}
                  name="email"
                  type="email"
                  required
                  value={fields.email}
                  onChange={(v) => setFields((f) => ({ ...f, email: v }))}
                />
              </div>

              <FloatingInput
                label={t('subject')}
                name="subject"
                value={fields.subject}
                onChange={(v) => setFields((f) => ({ ...f, subject: v }))}
              />

              <FloatingTextarea
                label={t('yourMessage')}
                name="message"
                required
                value={fields.message}
                onChange={(v) => setFields((f) => ({ ...f, message: v }))}
              />

              <motion.button
                type="submit"
                disabled={formState === 'loading' || formState === 'success'}
                whileHover={{ scale: formState === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 mt-2"
                style={{
                  background: formState === 'success' ? '#22c55e' : 'var(--accent)',
                  color: 'var(--background)',
                  opacity: formState === 'loading' ? 0.8 : 1,
                }}
              >
                <AnimatePresence mode="wait">
                  {formState === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 size={16} className="animate-spin" />
                    </motion.div>
                  )}
                  {formState === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Check size={16} />
                    </motion.div>
                  )}
                  {(formState === 'idle' || formState === 'error') && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send size={16} />
                      {t('sendMessage')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
