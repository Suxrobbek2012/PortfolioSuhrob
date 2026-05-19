import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.settings.deleteMany()

  // ─── PROJECTS ───────────────────────────────────────────
  await prisma.project.createMany({
    data: [
      {
        title: 'E-Commerce Platform',
        description: 'Full-featured e-commerce platform with real-time inventory, payment processing, and admin dashboard.',
        longDesc: 'Built a scalable e-commerce solution handling 10k+ daily transactions. Features include real-time inventory management, Stripe payment integration, order tracking, and a comprehensive admin panel.',
        image: '/images/projects/ecommerce.jpg',
        tags: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis']),
        liveUrl: 'https://demo.example.com',
        githubUrl: 'https://github.com/suhrobbek/ecommerce',
        featured: true,
        order: 1,
      },
      {
        title: 'AI Chat Application',
        description: 'Intelligent chat app powered by OpenAI GPT-4 with real-time streaming and conversation history.',
        longDesc: 'A production-ready AI chat application with streaming responses, conversation memory, custom system prompts, and usage analytics. Built with Next.js App Router and Prisma.',
        image: '/images/projects/ai-chat.jpg',
        tags: JSON.stringify(['Next.js', 'OpenAI API', 'Prisma', 'TypeScript', 'WebSockets']),
        liveUrl: 'https://chat.example.com',
        githubUrl: 'https://github.com/suhrobbek/ai-chat',
        featured: true,
        order: 2,
      },
      {
        title: 'Task Management App',
        description: 'Collaborative project management tool with drag-and-drop boards, real-time updates, and team features.',
        longDesc: 'Kanban-style task manager with real-time collaboration, file attachments, time tracking, and detailed analytics. Supports teams of up to 50 members.',
        image: '/images/projects/tasks.jpg',
        tags: JSON.stringify(['Vue.js', 'Firebase', 'Vuex', 'Tailwind CSS']),
        liveUrl: 'https://tasks.example.com',
        githubUrl: 'https://github.com/suhrobbek/taskmanager',
        featured: false,
        order: 3,
      },
      {
        title: 'Weather Dashboard',
        description: 'Beautiful weather app with 7-day forecasts, interactive maps, and location-based alerts.',
        longDesc: 'A visually stunning weather dashboard using OpenWeather API with animated weather icons, interactive radar maps, air quality index, and customizable alert thresholds.',
        image: '/images/projects/weather.jpg',
        tags: JSON.stringify(['React', 'TypeScript', 'OpenWeather API', 'Chart.js']),
        liveUrl: 'https://weather.example.com',
        githubUrl: 'https://github.com/suhrobbek/weather',
        featured: false,
        order: 4,
      },
      {
        title: 'Portfolio v1',
        description: 'My first portfolio website — pure HTML, CSS, and Vanilla JS. Where it all started.',
        longDesc: 'The original portfolio that started my journey. Built with pure HTML, CSS animations, and Vanilla JavaScript. No frameworks, no dependencies — just clean fundamentals.',
        image: '/images/projects/portfolio-v1.jpg',
        tags: JSON.stringify(['HTML', 'CSS', 'Vanilla JS', 'GSAP']),
        liveUrl: 'https://v1.example.com',
        githubUrl: 'https://github.com/suhrobbek/portfolio-v1',
        featured: false,
        order: 5,
      },
    ],
  })

  // ─── SKILLS ─────────────────────────────────────────────
  await prisma.skill.createMany({
    data: [
      // Frontend
      { name: 'React', level: 95, category: 'frontend', icon: 'react', order: 1 },
      { name: 'Next.js', level: 90, category: 'frontend', icon: 'nextjs', order: 2 },
      { name: 'TypeScript', level: 85, category: 'frontend', icon: 'typescript', order: 3 },
      { name: 'Tailwind CSS', level: 90, category: 'frontend', icon: 'tailwind', order: 4 },
      { name: 'Three.js', level: 70, category: 'frontend', icon: 'threejs', order: 5 },
      { name: 'Framer Motion', level: 80, category: 'frontend', icon: 'framer', order: 6 },
      // Backend
      { name: 'Node.js', level: 80, category: 'backend', icon: 'nodejs', order: 7 },
      { name: 'Express', level: 75, category: 'backend', icon: 'express', order: 8 },
      { name: 'PostgreSQL', level: 70, category: 'backend', icon: 'postgresql', order: 9 },
      { name: 'Prisma', level: 75, category: 'backend', icon: 'prisma', order: 10 },
      { name: 'GraphQL', level: 65, category: 'backend', icon: 'graphql', order: 11 },
      // Tools
      { name: 'Git', level: 95, category: 'tools', icon: 'git', order: 12 },
      { name: 'Docker', level: 65, category: 'tools', icon: 'docker', order: 13 },
      { name: 'Figma', level: 80, category: 'tools', icon: 'figma', order: 14 },
      { name: 'VS Code', level: 99, category: 'tools', icon: 'vscode', order: 15 },
    ],
  })

  // ─── EXPERIENCE ─────────────────────────────────────────
  await prisma.experience.createMany({
    data: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Tashkent',
        location: 'Tashkent, Uzbekistan',
        startDate: '2022-01',
        endDate: null,
        current: true,
        description: 'Leading frontend development for enterprise SaaS products. Architected micro-frontend system serving 50k+ users. Mentoring junior developers and establishing coding standards.',
        order: 1,
      },
      {
        title: 'Junior Developer',
        company: 'StartupXYZ',
        location: 'Tashkent, Uzbekistan',
        startDate: '2020-06',
        endDate: '2022-01',
        current: false,
        description: 'Built and maintained React applications for fintech startup. Implemented real-time features using WebSockets. Reduced bundle size by 40% through code splitting and lazy loading.',
        order: 2,
      },
      {
        title: 'Freelance Web Developer',
        company: 'Self-employed',
        location: 'Remote',
        startDate: '2019-01',
        endDate: '2020-06',
        current: false,
        description: 'Delivered 20+ web projects for clients across e-commerce, hospitality, and education sectors. Specialized in responsive design and performance optimization.',
        order: 3,
      },
    ],
  })

  // ─── SETTINGS ───────────────────────────────────────────
  const settings = [
    { key: 'name', value: 'Suhrobbek Baxtiyorov' },
    { key: 'title_en', value: 'Full Stack Developer & UI/UX Designer' },
    { key: 'title_uz', value: 'Full Stack dasturchi va UI/UX dizayner' },
    { key: 'title_ru', value: 'Full Stack разработчик и UI/UX дизайнер' },
    { key: 'bio_en', value: 'I build fast, beautiful, and scalable web applications. Passionate about clean code and stunning user interfaces.' },
    { key: 'bio_uz', value: 'Tez, chiroyli va kengaytiriladigan veb-ilovalar yarataman. Toza kod va zoʻr interfeyslarga ishtiyoqliman.' },
    { key: 'bio_ru', value: 'Создаю быстрые, красивые и масштабируемые веб-приложения. Увлечён чистым кодом и сильными интерфейсами.' },
    { key: 'location_en', value: 'Tashkent, Uzbekistan' },
    { key: 'location_uz', value: "Toshkent, O'zbekiston" },
    { key: 'location_ru', value: 'Ташкент, Узбекистан' },
    { key: 'email', value: 'suhrobbek@portfolio.dev' },
    { key: 'github', value: 'https://github.com/suhrobbek' },
    { key: 'linkedin', value: 'https://linkedin.com/in/suhrobbek' },
    { key: 'twitter', value: 'https://twitter.com/suhrobbek' },
    { key: 'telegram', value: 'https://t.me/suhrobbek' },
    { key: 'yearsExperience', value: '5' },
    { key: 'projectsCompleted', value: '50' },
    { key: 'happyClients', value: '30' },
    { key: 'coffeeConsumed', value: '1000' },
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
