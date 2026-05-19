import type { Language } from '@/lib/i18n'

type LocalizedMap = Partial<Record<Language, string>>

/** Parse {"uz":"...","ru":"...","en":"..."} stored in a settings/DB text field */
export function tryParseLocalizedJson(value: string | null | undefined): LocalizedMap | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (!trimmed.startsWith('{')) return null
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>
    const out: LocalizedMap = {}
    for (const lang of ['uz', 'ru', 'en'] as const) {
      if (typeof parsed[lang] === 'string' && parsed[lang].trim()) {
        out[lang] = parsed[lang]
      }
    }
    return Object.keys(out).length > 0 ? out : null
  } catch {
    return null
  }
}

export function pickLocalizedField(
  raw: string | null | undefined,
  lang: Language,
  preset?: string
): string {
  const json = tryParseLocalizedJson(raw ?? '')
  if (json?.[lang]?.trim()) return json[lang]!.trim()

  const legacy = raw?.trim()
  if (legacy && !json) {
    if (lang === 'en') return legacy
    if (preset?.trim()) return preset.trim()
    return legacy
  }

  if (preset?.trim()) return preset.trim()
  if (json?.en?.trim()) return json.en.trim()
  return legacy ?? ''
}

/** Settings: bio_uz / bio_ru / bio_en keys, JSON in bio, or built-in defaults */
export function getSettingLocalized(
  settings: Record<string, string>,
  key: string,
  lang: Language,
  fallback = ''
): string {
  const suffixed = settings[`${key}_${lang}`]?.trim()
  if (suffixed) return suffixed

  const fromJson = tryParseLocalizedJson(settings[key])
  if (fromJson?.[lang]?.trim()) return fromJson[lang]!.trim()

  const legacy = settings[key]?.trim()
  if (legacy && !fromJson && lang === 'en') return legacy

  const preset = SETTINGS_DEFAULTS[key as keyof typeof SETTINGS_DEFAULTS]?.[lang]
  if (preset?.trim()) return preset.trim()

  return fallback
}

export const SETTINGS_DEFAULTS = {
  bio: {
    uz: 'Tez, chiroyli va kengaytiriladigan veb-ilovalar yarataman. Toza kod va zoʻr interfeyslarga ishtiyoqliman.',
    ru: 'Создаю быстрые, красивые и масштабируемые веб-приложения. Увлечён чистым кодом и сильными интерфейсами.',
    en: 'I build fast, beautiful, and scalable web applications. Passionate about clean code and stunning user interfaces.',
  },
  title: {
    uz: 'Full Stack dasturchi va UI/UX dizayner',
    ru: 'Full Stack разработчик и UI/UX дизайнер',
    en: 'Full Stack Developer & UI/UX Designer',
  },
  location: {
    uz: "Toshkent, O'zbekiston",
    ru: 'Ташкент, Узбекистан',
    en: 'Tashkent, Uzbekistan',
  },
} as const

type ProjectPreset = { title: string; description: string; longDesc?: string }
type ExperiencePreset = {
  title: string
  company: string
  location?: string
  description: string
}

/** Seed project order → translations (when DB stores English-only text) */
export const PROJECT_PRESETS: Record<number, Partial<Record<Language, ProjectPreset>>> = {
  1: {
    uz: {
      title: 'E-commerce platformasi',
      description:
        'Real vaqt inventarizatsiyasi, to‘lov va admin paneli bilan to‘liq onlayn do‘kon.',
      longDesc:
        'Kuniga 10 ming+ tranzaksiyani qayta ishlaydigan e-commerce yechim. Real vaqt inventar, Stripe integratsiyasi, buyurtma kuzatuvi va keng qamrovli admin panel.',
    },
    ru: {
      title: 'E-commerce платформа',
      description:
        'Полнофункциональный интернет-магазин с инвентарём в реальном времени, оплатой и админ-панелью.',
      longDesc:
        'Масштабируемое e-commerce решение на 10k+ транзакций в день: инвентарь в реальном времени, Stripe, отслеживание заказов и админ-панель.',
    },
    en: {
      title: 'E-Commerce Platform',
      description:
        'Full-featured e-commerce platform with real-time inventory, payment processing, and admin dashboard.',
      longDesc:
        'Built a scalable e-commerce solution handling 10k+ daily transactions. Features include real-time inventory management, Stripe payment integration, order tracking, and a comprehensive admin panel.',
    },
  },
  2: {
    uz: {
      title: 'AI chat ilovasi',
      description: 'OpenAI GPT-4 asosida real vaqt oqimli suhbat va tarix bilan aqlli chat.',
      longDesc:
        'Production-ready AI chat: oqimli javoblar, suhbat xotirasi, maxsus system promptlar va foydalanish analitikasi. Next.js App Router va Prisma.',
    },
    ru: {
      title: 'AI чат-приложение',
      description: 'Умный чат на OpenAI GPT-4 со стримингом и историей диалогов.',
      longDesc:
        'Production-ready AI chat со стримингом, памятью диалогов, кастомными system prompts и аналитикой. Next.js App Router и Prisma.',
    },
    en: {
      title: 'AI Chat Application',
      description:
        'Intelligent chat app powered by OpenAI GPT-4 with real-time streaming and conversation history.',
      longDesc:
        'A production-ready AI chat application with streaming responses, conversation memory, custom system prompts, and usage analytics. Built with Next.js App Router and Prisma.',
    },
  },
  3: {
    uz: {
      title: 'Vazifalar boshqaruvi',
      description: 'Drag-and-drop doskalar, real vaqt yangilanish va jamoa funksiyalari.',
      longDesc:
        'Kanban uslubidagi task manager: real vaqt hamkorlik, fayl biriktirish, vaqt hisobi va analitika. 50 tagacha a’zoli jamoalar.',
    },
    ru: {
      title: 'Приложение для задач',
      description: 'Совместный менеджер проектов с drag-and-drop досками и обновлениями в реальном времени.',
      longDesc:
        'Kanban task manager с real-time коллаборацией, вложениями, учётом времени и аналитикой. До 50 участников в команде.',
    },
    en: {
      title: 'Task Management App',
      description:
        'Collaborative project management tool with drag-and-drop boards, real-time updates, and team features.',
      longDesc:
        'Kanban-style task manager with real-time collaboration, file attachments, time tracking, and detailed analytics. Supports teams of up to 50 members.',
    },
  },
  4: {
    uz: {
      title: 'Ob-havo paneli',
      description: '7 kunlik prognoz, interaktiv xaritalar va joylashuv bo‘yicha ogohlantirishlar.',
      longDesc:
        'OpenWeather API bilan vizual ob-havo paneli: animatsiyali ikonlar, radar xaritalari, havo sifati indeksi va sozlanadigan ogohlantirishlar.',
    },
    ru: {
      title: 'Погодная панель',
      description: 'Красивое приложение погоды с прогнозом на 7 дней, картами и оповещениями.',
      longDesc:
        'Визуально сильная погодная панель на OpenWeather API: анимированные иконки, радар, индекс качества воздуха и настраиваемые алерты.',
    },
    en: {
      title: 'Weather Dashboard',
      description: 'Beautiful weather app with 7-day forecasts, interactive maps, and location-based alerts.',
      longDesc:
        'A visually stunning weather dashboard using OpenWeather API with animated weather icons, interactive radar maps, air quality index, and customizable alert thresholds.',
    },
  },
  5: {
    uz: {
      title: 'Portfolio v1',
      description: 'Birinchi portfolio saytim — faqat HTML, CSS va Vanilla JS.',
      longDesc:
        'Sayohatim boshlangan asl portfolio. Toza HTML, CSS animatsiyalar va Vanilla JavaScript — frameworklarsiz.',
    },
    ru: {
      title: 'Portfolio v1',
      description: 'Мой первый сайт-портфолио — чистый HTML, CSS и Vanilla JS.',
      longDesc:
        'Оригинальное портфолио, с которого всё началось. HTML, CSS-анимации и Vanilla JavaScript без фреймворков.',
    },
    en: {
      title: 'Portfolio v1',
      description: 'My first portfolio website — pure HTML, CSS, and Vanilla JS. Where it all started.',
      longDesc:
        'The original portfolio that started my journey. Built with pure HTML, CSS animations, and Vanilla JavaScript. No frameworks, no dependencies — just clean fundamentals.',
    },
  },
}

export const EXPERIENCE_PRESETS: Record<number, Partial<Record<Language, ExperiencePreset>>> = {
  1: {
    uz: {
      title: 'Katta Frontend dasturchi',
      company: 'TechCorp Tashkent',
      location: "Toshkent, O'zbekiston",
      description:
        'Korporativ SaaS mahsulotlar uchun frontend rivojlantirishni boshqaraman. 50 ming+ foydalanuvchiga xizmat qiluvchi micro-frontend arxitekturasi. Junior dasturchilarni mentorlik qilaman.',
    },
    ru: {
      title: 'Senior Frontend разработчик',
      company: 'TechCorp Tashkent',
      location: 'Ташкент, Узбекистан',
      description:
        'Руковожу frontend для enterprise SaaS. Спроектировал micro-frontend для 50k+ пользователей. Менторю junior-разработчиков и задаю стандарты кода.',
    },
    en: {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Tashkent',
      location: 'Tashkent, Uzbekistan',
      description:
        'Leading frontend development for enterprise SaaS products. Architected micro-frontend system serving 50k+ users. Mentoring junior developers and establishing coding standards.',
    },
  },
  2: {
    uz: {
      title: 'Junior dasturchi',
      company: 'StartupXYZ',
      location: "Toshkent, O'zbekiston",
      description:
        'Fintech startap uchun React ilovalarini yaratdim va qo‘llab-quvvatladim. WebSocket bilan real vaqt funksiyalar. Code splitting orqali bundle 40% kichraytirildi.',
    },
    ru: {
      title: 'Junior разработчик',
      company: 'StartupXYZ',
      location: 'Ташкент, Узбекистан',
      description:
        'Разрабатывал и поддерживал React-приложения для fintech-стартапа. Real-time на WebSockets. Уменьшил bundle на 40% через code splitting.',
    },
    en: {
      title: 'Junior Developer',
      company: 'StartupXYZ',
      location: 'Tashkent, Uzbekistan',
      description:
        'Built and maintained React applications for fintech startup. Implemented real-time features using WebSockets. Reduced bundle size by 40% through code splitting and lazy loading.',
    },
  },
  3: {
    uz: {
      title: 'Frilans veb-dasturchi',
      company: 'Mustaqil',
      location: 'Masofaviy',
      description:
        'E-commerce, mehmonxona va ta’lim sohalarida 20+ veb-loyiha. Responsive dizayn va performance optimizatsiyasiga ixtisoslashgan.',
    },
    ru: {
      title: 'Freelance веб-разработчик',
      company: 'Самозанятый',
      location: 'Удалённо',
      description:
        'Более 20 веб-проектов для клиентов в e-commerce, hospitality и education. Специализация — responsive и производительность.',
    },
    en: {
      title: 'Freelance Web Developer',
      company: 'Self-employed',
      location: 'Remote',
      description:
        'Delivered 20+ web projects for clients across e-commerce, hospitality, and education sectors. Specialized in responsive design and performance optimization.',
    },
  },
}

export function localizeProject<T extends { order: number; title: string; description: string; longDesc?: string | null }>(
  project: T,
  lang: Language
): T {
  const preset = PROJECT_PRESETS[project.order]?.[lang] ?? PROJECT_PRESETS[project.order]?.en
  return {
    ...project,
    title: pickLocalizedField(project.title, lang, preset?.title),
    description: pickLocalizedField(project.description, lang, preset?.description),
    longDesc: pickLocalizedField(project.longDesc ?? '', lang, preset?.longDesc) || null,
  }
}

export function localizeExperience<
  T extends {
    order: number
    title: string
    company: string
    location?: string | null
    description: string
  },
>(experience: T, lang: Language): T {
  const preset = EXPERIENCE_PRESETS[experience.order]?.[lang] ?? EXPERIENCE_PRESETS[experience.order]?.en
  return {
    ...experience,
    title: pickLocalizedField(experience.title, lang, preset?.title),
    company: pickLocalizedField(experience.company, lang, preset?.company),
    location: pickLocalizedField(experience.location ?? '', lang, preset?.location) || null,
    description: pickLocalizedField(experience.description, lang, preset?.description),
  }
}
