'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Loader2, User, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTranslations } from '@/hooks/useTranslations'

interface Comment {
  id: string
  name: string
  content: string
  createdAt: string
}

interface ProjectCommentsProps {
  projectId: string
}

export function ProjectComments({ projectId }: ProjectCommentsProps) {
  const { t } = useTranslations()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', content: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [projectId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`)
      const data = await res.json()
      setComments(Array.isArray(data) ? data : [])
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('commentsError'))
        return
      }

      setSuccess(true)
      setForm({ name: '', email: '', content: '' })
      setShowForm(false)
      setTimeout(() => setSuccess(false), 4000)
      // Refresh comments
      await fetchComments()
    } catch {
      setError(t('commentsConnectionError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} style={{ color: 'var(--accent)' }} />
          <h3 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
            {t('commentsTitle')}
            {comments.length > 0 && (
              <span
                className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}
              >
                {comments.length}
              </span>
            )}
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: showForm ? 'var(--surface-2)' : 'var(--accent)',
            color: showForm ? 'var(--foreground)' : 'var(--background)',
            border: showForm ? '1px solid var(--border)' : 'none',
          }}
        >
          <MessageCircle size={14} />
          {showForm ? t('commentsCancel') : t('commentsAdd')}
        </motion.button>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {t('commentsSuccess')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-5 rounded-2xl flex flex-col gap-3 overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>
                  {t('commentsName')} *
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>
                  {t('commentsEmail')}
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  maxLength={100}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>
                {t('commentsContent')} *
              </label>
              <textarea
                placeholder="Share your thoughts about this project..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                required
                maxLength={1000}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {form.content.length}/1000
                </span>
              </div>
            </div>

            {error && (
              <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={submitting || !form.name.trim() || !form.content.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium self-end px-6"
              style={{
                background: 'var(--accent)',
                color: 'var(--background)',
                opacity: submitting || !form.name.trim() || !form.content.trim() ? 0.6 : 1,
              }}
            >
              {submitting ? (
                <><Loader2 size={14} className="animate-spin" /> {t('commentsPosting')}</>
              ) : (
                <><Send size={14} /> {t('commentsSubmit')}</>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--muted)' }} />
        </div>
      ) : comments.length === 0 ? (
        <div
          className="text-center py-10 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <MessageCircle size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--muted)' }} />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {t('commentsEmpty')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.1)',
                    color: 'var(--accent)',
                  }}
                >
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                      {comment.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
                      <Clock size={10} />
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
