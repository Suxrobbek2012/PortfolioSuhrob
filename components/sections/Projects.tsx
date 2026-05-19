'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useInView, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ExternalLink, GitBranch, Star, X, Eye } from 'lucide-react'
import Link from 'next/link'
import { ProjectComments } from '@/components/ui/ProjectComments'
import { useTranslations } from '@/hooks/useTranslations'
import { projectExternalHref } from '@/lib/utils'
import { localizeProject } from '@/lib/locale-content'

interface Project {
  id: string
  title: string
  description: string
  longDesc: string | null
  image: string | null
  tags: string[]
  liveUrl: string | null
  githubUrl: string | null
  featured: boolean
  order: number
  views?: number
}

const TECH_TAGS = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Vue.js']
const ALL_FILTER = '__all__'

// View counter hook — increments only on real visit
function useProjectView(projectId: string, isOpen: boolean) {
  const [views, setViews] = useState<number | null>(null)
  const counted = useRef(false)

  useEffect(() => {
    if (isOpen && !counted.current) {
      counted.current = true
      fetch(`/api/projects/${projectId}/view`, { method: 'POST' })
        .then((r) => r.json())
        .then((d) => setViews(d.views))
        .catch(() => {})
    }
  }, [isOpen, projectId])

  // Fetch initial count
  useEffect(() => {
    fetch(`/api/projects/${projectId}/view`)
      .then((r) => r.json())
      .then((d) => setViews(d.views))
      .catch(() => {})
  }, [projectId])

  return views
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, lang } = useTranslations()
  const localized = useMemo(() => localizeProject(project, lang), [project, lang])
  const views = useProjectView(project.id, true)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden mb-8"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Project Image */}
          <div
            className="relative h-52 w-full flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--surface-2), var(--background))' }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={localized.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 opacity-30">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>{t('noImage')}</span>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-xl transition-all"
              style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}
            >
              <X size={16} />
            </button>

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-3 left-3">
                <span
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(var(--accent-rgb), 0.9)', color: 'var(--background)' }}
                >
                  <Star size={10} fill="currentColor" /> {t('featured')}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                {localized.title}
              </h3>
              {/* View count */}
              {views !== null && (
                <div
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.08)',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Eye size={12} style={{ color: 'var(--accent)' }} />
                  <span>{views.toLocaleString()} {t('views')}</span>
                </div>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              {localized.longDesc || localized.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.1)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(var(--accent-rgb), 0.2)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-3 mb-6">
              {project.liveUrl?.trim() && (
                <Link href={projectExternalHref(project.liveUrl)} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--accent)', color: 'var(--background)' }}
                  >
                    <ExternalLink size={14} /> {t('liveDemo')}
                  </motion.button>
                </Link>
              )}
              {project.githubUrl?.trim() && (
                <Link href={projectExternalHref(project.githubUrl)} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                      background: 'var(--surface-2)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <GitBranch size={14} /> {t('sourceCode')}
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--border)', marginBottom: '1.5rem' }} />

            {/* Comments */}
            <ProjectComments projectId={project.id} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t, lang } = useTranslations()
  const localized = useMemo(() => localizeProject(project, lang), [project, lang])
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)
  const views = useProjectView(project.id, false)

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -6 }}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: hovered ? 'var(--accent-glow)' : 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setSelected(true)}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={localized.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-500"
              style={{
                background: 'linear-gradient(135deg, var(--surface-2), var(--background))',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                style={{ color: 'var(--muted)', opacity: 0.4 }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
              opacity: hovered ? 1 : 0,
            }}
          >
            <p
              className="text-white text-xs font-medium transition-transform duration-300"
              style={{ transform: hovered ? 'translateY(0)' : 'translateY(8px)' }}
            >
              {t('clickToView')}
            </p>
          </div>

          {/* Featured */}
          {project.featured && (
            <div className="absolute top-2.5 right-2.5">
              <span
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(var(--accent-rgb), 0.9)', color: 'var(--background)' }}
              >
                <Star size={9} fill="currentColor" /> {t('featured')}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
              {localized.title}
            </h3>
            {/* View count */}
            {views !== null && views > 0 && (
              <div
                className="flex items-center gap-1 text-xs flex-shrink-0 ml-2"
                style={{ color: 'var(--muted)' }}
              >
                <Eye size={11} />
                {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
              </div>
            )}
          </div>

          <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--muted)' }}>
            {localized.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-md" style={{ color: 'var(--muted)' }}>
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {project.liveUrl?.trim() && (
              <Link
                href={projectExternalHref(project.liveUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                <ExternalLink size={11} /> {t('live')}
              </Link>
            )}
            {project.githubUrl?.trim() && (
              <Link
                href={projectExternalHref(project.githubUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
              >
                <GitBranch size={11} /> {t('code')}
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {selected && <ProjectModal project={project} onClose={() => setSelected(false)} />}
    </>
  )
}

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t } = useTranslations()
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const filtered =
    activeFilter === ALL_FILTER
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter))

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            {t('projectsKicker')}
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2" style={{ color: 'var(--foreground)' }}>
            {t('projectsTitleLead')}{' '}
            <span style={{ color: 'var(--accent)' }}>{t('projectsTitleAccent')}</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            {t('projectsSubtitle')}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[ALL_FILTER, ...TECH_TAGS].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: activeFilter === filter ? 'var(--accent)' : 'var(--surface)',
                color: activeFilter === filter ? 'var(--background)' : 'var(--muted)',
                border: `1px solid ${activeFilter === filter ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {filter === ALL_FILTER ? t('filterAll') : filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  )
}
