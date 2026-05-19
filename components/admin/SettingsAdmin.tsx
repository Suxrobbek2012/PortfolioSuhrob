'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Check, AlertCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const FIELDS = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Suhrobbek Baxtiyorov' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { key: 'github', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/username' },
  { key: 'twitter', label: 'Twitter / X URL', type: 'url', placeholder: 'https://twitter.com/username' },
  { key: 'telegram', label: 'Telegram URL', type: 'url', placeholder: 'https://t.me/username' },
  { key: 'yearsExperience', label: 'Years of Experience', type: 'number', placeholder: '5' },
  { key: 'projectsCompleted', label: 'Projects Completed', type: 'number', placeholder: '50' },
  { key: 'happyClients', label: 'Happy Clients', type: 'number', placeholder: '30' },
  { key: 'coffeeConsumed', label: 'Coffee Consumed', type: 'number', placeholder: '1000' },
]

const MULTILANG_FIELDS = [
  { key: 'title', label: 'Job Title', type: 'text' as const },
  { key: 'bio', label: 'Bio / About', type: 'textarea' as const },
  { key: 'location', label: 'Location', type: 'text' as const },
]

const CONTENT_LANGS = [
  { id: 'uz', label: 'Ўзбек (UZ)' },
  { id: 'ru', label: 'Русский (RU)' },
  { id: 'en', label: 'English (EN)' },
]

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

export function SettingsAdmin({ settings: initial }: { settings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initial)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [changed, setChanged] = useState(false)

  const handleChange = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setChanged(true)
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  const handleSave = async () => {
    if (status === 'saving') return
    setStatus('saving')
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: send cookies
        body: JSON.stringify(settings),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      setStatus('success')
      setChanged(false)
      toast.success(`Settings saved! (${data.saved} fields updated)`)

      // Reset to idle after 3s
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setStatus('error')
      setErrorMsg(msg)
      toast.error(`Failed to save: ${msg}`)
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const inputBase = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'var(--foreground)',
    borderRadius: '10px',
    padding: '0.65rem 0.875rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div className="max-w-2xl">
      {/* Unsaved changes banner */}
      {changed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
          style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            color: '#f59e0b',
          }}
        >
          <AlertCircle size={14} />
          You have unsaved changes
        </motion.div>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>Portfolio Settings</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Changes are reflected on the public site immediately after saving
            </p>
          </div>
          <motion.button
            onClick={handleSave}
            disabled={status === 'saving' || !changed}
            whileHover={{ scale: status === 'saving' ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: status === 'success'
                ? '#22c55e'
                : status === 'error'
                ? '#ef4444'
                : 'var(--accent)',
              color: 'var(--background)',
              opacity: status === 'saving' || !changed ? 0.6 : 1,
            }}
          >
            {status === 'saving' && <Loader2 size={14} className="animate-spin" />}
            {status === 'success' && <Check size={14} />}
            {status === 'error' && <AlertCircle size={14} />}
            {status === 'idle' && <Save size={14} />}
            {status === 'saving' ? 'Saving...' : status === 'success' ? 'Saved!' : status === 'error' ? 'Failed' : 'Save Changes'}
          </motion.button>
        </div>

        {/* Fields */}
        <div className="p-6 flex flex-col gap-5">
          {FIELDS.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--muted)' }}
              >
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  style={{ ...inputBase, resize: 'none' } as React.CSSProperties}
                  rows={3}
                  placeholder={placeholder}
                  value={settings[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              ) : (
                <input
                  type={type}
                  style={inputBase as React.CSSProperties}
                  placeholder={placeholder}
                  value={settings[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              )}
            </div>
          ))}

          <div
            className="pt-4 mt-2"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <h3 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              Multilingual content (UZ / RU / EN)
            </h3>
            <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
              These fields change on the public site when visitors switch language.
            </p>

            {MULTILANG_FIELDS.map(({ key, label, type }) => (
              <div key={key} className="mb-6">
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-wider"
                  style={{ color: 'var(--accent)' }}
                >
                  {label}
                </p>
                <div className="flex flex-col gap-3">
                  {CONTENT_LANGS.map(({ id, label: langLabel }) => {
                    const fieldKey = `${key}_${id}`
                    return (
                      <div key={fieldKey}>
                        <label
                          className="block text-xs font-medium mb-1.5"
                          style={{ color: 'var(--muted)' }}
                        >
                          {langLabel}
                        </label>
                        {type === 'textarea' ? (
                          <textarea
                            style={{ ...inputBase, resize: 'none' } as React.CSSProperties}
                            rows={3}
                            placeholder={label}
                            value={settings[fieldKey] || ''}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                          />
                        ) : (
                          <input
                            type="text"
                            style={inputBase as React.CSSProperties}
                            placeholder={label}
                            value={settings[fieldKey] || ''}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer save button */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {errorMsg && (
            <p className="text-xs" style={{ color: '#ef4444' }}>
              Error: {errorMsg}
            </p>
          )}
          <div className="ml-auto">
            <motion.button
              onClick={handleSave}
              disabled={status === 'saving' || !changed}
              whileHover={{ scale: status === 'saving' ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm"
              style={{
                background: status === 'success' ? '#22c55e' : 'var(--accent)',
                color: 'var(--background)',
                opacity: status === 'saving' || !changed ? 0.6 : 1,
              }}
            >
              {status === 'saving' ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : status === 'success' ? (
                <><Check size={14} /> Saved!</>
              ) : (
                <><Save size={14} /> Save All Changes</>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
