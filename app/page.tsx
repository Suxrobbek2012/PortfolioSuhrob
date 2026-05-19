export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/sections/Hero'
import { AboutSection } from '@/components/sections/About'
import { ProjectsSection } from '@/components/sections/Projects'
import { SkillsSection } from '@/components/sections/Skills'
import { TimelineSection } from '@/components/sections/Timeline'
import { ContactSection } from '@/components/sections/Contact'
import { prisma } from '@/lib/db'
import { parseJsonSafe } from '@/lib/utils'

async function getData() {
  const [projects, skills, experience, settings] = await Promise.all([
    prisma.project.findMany({ orderBy: { order: 'asc' } }),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
    prisma.settings.findMany(),
  ])

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  const parsedProjects = projects.map((p) => ({
    ...p,
    tags: parseJsonSafe<string[]>(p.tags, []),
  }))

  return { projects: parsedProjects, skills, experience, settings: settingsMap }
}

export default async function HomePage() {
  const { projects, skills, experience, settings } = await getData()

  return (
    <>
      <HeroSection settings={settings} />
      <AboutSection settings={settings} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <TimelineSection experience={experience} />
      <ContactSection settings={settings} />
    </>
  )
}
