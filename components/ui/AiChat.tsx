'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Bot, User, Minimize2, Maximize2, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/components/layout/LanguageProvider'

type Lang = 'uz' | 'ru' | 'en'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
  lang?: Lang
}

const LANG_LABELS: Record<Lang, string> = { uz: "UZ", ru: "RU", en: "EN" }

const SUGGESTED: Record<Lang, string[]> = {
  uz: ["Ko'nikmalar haqida", "Loyihalar", "Narxlar", "Bog'lanish"],
  ru: ["О навыках", "Проекты", "Цены", "Контакты"],
  en: ["About skills", "Projects", "Pricing", "Contact info"],
}

const PLACEHOLDERS: Record<Lang, string> = {
  uz: "Savol yozing...",
  ru: "Напишите вопрос...",
  en: "Ask me anything...",
}

const GREETINGS: Record<Lang, string> = {
  uz: "Salom! Men Suhrobbek Baxtiyorovning AI yordamchisiman 👋\n\nLoyihalar, ko'nikmalar yoki hamkorlik haqida savollaringizga javob berishga tayyorman!",
  ru: "Привет! Я AI-ассистент портфолио Сухроббека 👋\n\nГотов ответить на вопросы о проектах, навыках или сотрудничестве!",
  en: "Hi! I'm Suhrobbek's AI assistant 👋\n\nAsk me about his skills, projects, or how to work together!",
}

export function AiChat() {
  const { lang: siteLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [lang, setLang] = useState<Lang>(siteLang)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `s_${Date.now()}_${Math.random().toString(36).slice(2)}`)
  const [unread, setUnread] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync with global site language switcher
  useEffect(() => {
    setLang(siteLang)
  }, [siteLang])

  // Init greeting based on lang
  useEffect(() => {
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content: GREETINGS[lang],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lang,
      },
    ])
  }, [lang])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, minimized])

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    setInput('')
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId }),
      })

      const data = await res.json()

      // Update lang based on detected language
      if (data.lang && ['uz', 'ru', 'en'].includes(data.lang)) {
        setLang(data.lang as Lang)
      }

      const aiMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.reply || GREETINGS[lang],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lang: data.lang,
      }
      setMessages((prev) => [...prev, aiMsg])
      if (!open) setUnread((n) => n + 1)
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: lang === 'uz'
            ? "Ulanishda xatolik. Qayta urinib ko'ring."
            : lang === 'ru'
            ? "Ошибка соединения. Попробуйте снова."
            : "Connection error. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, sessionId, lang, open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: 'greeting_reset',
        role: 'assistant',
        content: GREETINGS[lang],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lang,
      },
    ])
  }

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-[9998] w-[360px] rounded-2xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(var(--accent-rgb),0.1)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary, var(--accent)))',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">AI Assistant</p>
                  <p className="text-white/70 text-xs">Suhrobbek's portfolio bot</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Lang switcher */}
                <div className="flex rounded-lg overflow-hidden mr-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  {(['uz', 'ru', 'en'] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="px-2 py-1 text-xs font-bold transition-colors"
                      style={{
                        background: lang === l ? 'rgba(255,255,255,0.3)' : 'transparent',
                        color: 'white',
                      }}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
                <button
                  onClick={resetChat}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                  title="Reset chat"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  onClick={() => setMinimized(!minimized)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                >
                  {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!minimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Messages */}
                  <div
                    className="h-72 overflow-y-auto p-4 flex flex-col gap-3"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div
                          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{
                            background: msg.role === 'assistant'
                              ? 'linear-gradient(135deg, var(--accent), var(--accent-secondary, var(--accent)))'
                              : 'var(--surface-2)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {msg.role === 'assistant'
                            ? <Bot size={13} className="text-white" style={{ color: 'var(--background)' }} />
                            : <User size={13} style={{ color: 'var(--muted)' }} />
                          }
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div
                            className="px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line"
                            style={{
                              background: msg.role === 'user'
                                ? 'var(--accent)'
                                : 'var(--surface-2)',
                              color: msg.role === 'user'
                                ? 'var(--background)'
                                : 'var(--foreground)',
                              borderRadius: msg.role === 'user'
                                ? '18px 4px 18px 18px'
                                : '4px 18px 18px 18px',
                              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                            }}
                          >
                            {msg.content}
                          </div>
                          <span className="text-xs px-1" style={{ color: 'var(--muted)' }}>
                            {msg.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <div
                          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary, var(--accent)))',
                          }}
                        >
                          <Bot size={13} style={{ color: 'var(--background)' }} />
                        </div>
                        <div
                          className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                          style={{
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px 18px 18px 18px',
                          }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: 'var(--accent)' }}
                              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick suggestions */}
                  {messages.length <= 1 && (
                    <div
                      className="px-4 pb-3 flex flex-wrap gap-1.5"
                      style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}
                    >
                      {SUGGESTED[lang].map((s) => (
                        <motion.button
                          key={s}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => sendMessage(s)}
                          className="text-xs px-3 py-1.5 rounded-full transition-all"
                          style={{
                            background: 'rgba(var(--accent-rgb), 0.08)',
                            color: 'var(--accent)',
                            border: '1px solid rgba(var(--accent-rgb), 0.2)',
                          }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div
                    className="p-3 flex gap-2 items-center"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={PLACEHOLDERS[lang]}
                      maxLength={500}
                      className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                    <motion.button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--background)',
                        opacity: !input.trim() || loading ? 0.45 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {loading
                        ? <Loader2 size={15} className="animate-spin" />
                        : <Send size={15} />
                      }
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{
          background: open
            ? 'var(--surface)'
            : 'linear-gradient(135deg, var(--accent), var(--accent-secondary, var(--accent)))',
          color: open ? 'var(--foreground)' : 'var(--background)',
          border: open ? '1px solid var(--border)' : 'none',
          boxShadow: open ? 'none' : '0 8px 32px rgba(var(--accent-rgb), 0.4)',
        }}
        aria-label="AI Chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Bot size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: '#ef4444', color: 'white' }}
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-2xl"
            style={{ border: '2px solid var(--accent)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </>
  )
}
