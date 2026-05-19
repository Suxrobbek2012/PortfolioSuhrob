'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { getSettingLocalized, SETTINGS_DEFAULTS } from '@/lib/locale-content'

export function useLocalizedSettings(settings: Record<string, string>) {
  const { lang } = useLanguage()

  return useMemo(
    () => ({
      lang,
      name: settings.name?.trim() || 'Suhrobbek Baxtiyorov',
      title: getSettingLocalized(settings, 'title', lang) || SETTINGS_DEFAULTS.title[lang],
      bio: getSettingLocalized(settings, 'bio', lang) || SETTINGS_DEFAULTS.bio[lang],
      location: getSettingLocalized(settings, 'location', lang) || SETTINGS_DEFAULTS.location[lang],
      email: settings.email?.trim() || 'suhrobbek@portfolio.dev',
      github: settings.github?.trim() || '',
      linkedin: settings.linkedin?.trim() || '',
      yearsExperience: settings.yearsExperience?.trim() || '5',
      projectsCompleted: settings.projectsCompleted?.trim() || '50',
      happyClients: settings.happyClients?.trim() || '30',
      coffeeConsumed: settings.coffeeConsumed?.trim() || '1000',
    }),
    [settings, lang]
  )
}
