// Product pages at /products/:slug. Names, copy and stats are placeholders; edit them here.
// Images live in /public/media/products; replace a file with the same name to swap it.

export type ProductDetail = {
  slug: string
  name: string
  status: string
  category: string
  tagline: string
  intro: string
  url?: string
  stats: { value: string; label: string }[]
  features: { title: string; desc: string }[]
  audience: string[]
  steps: { title: string; desc: string }[]
  faqs: { q: string; a: string }[]
}

export const productsDetail: ProductDetail[] = [
  {
    slug: 'softunebd',
    name: 'SoftuneBD',
    status: 'Live',
    category: 'Software company',
    tagline: 'Platforms used every day',
    intro:
      'Our first company and the proving ground for how ENUVOR builds. Enterprise software, platforms and services used across Bangladesh and beyond.',
    url: '#',
    stats: [
      { value: '2021', label: 'Launched' },
      { value: '60+', label: 'Business clients' },
      { value: '99.9%', label: 'Platform uptime' },
    ],
    features: [
      { title: 'ERP and operations', desc: 'Inventory, accounts, HR and payroll in one system, set up around how each business works.' },
      { title: 'Custom platforms', desc: 'Portals, dashboards and internal tools built on the same core as our own products.' },
      { title: 'Managed hosting', desc: 'Monitoring, backups and updates handled by the team that wrote the code.' },
      { title: 'Local support', desc: 'A support desk in Dhaka that answers in hours, not days.' },
    ],
    audience: ['Growing SMEs', 'Retail and distribution', 'Education', 'Healthcare providers'],
    steps: [
      { title: 'Talk to us', desc: 'A short call to understand how your team works today.' },
      { title: 'Configure', desc: 'We set up modules, roles and data around your process.' },
      { title: 'Go live', desc: 'Training, migration and a calm switch-over.' },
      { title: 'Grow', desc: 'New modules and improvements as your business grows.' },
    ],
    faqs: [
      { q: 'Is SoftuneBD part of ENUVOR?', a: 'Yes. SoftuneBD is our first company and is owned and run by ENUVOR.' },
      { q: 'Can it work with our existing tools?', a: 'Most of the time, yes. We connect to common accounting, payment and messaging services.' },
      { q: 'How is it priced?', a: 'A setup fee and a monthly plan based on modules and users. You get a written quote first.' },
    ],
  },
  {
    slug: 'product-two',
    name: 'Product Two',
    status: 'In development',
    category: 'Operations SaaS',
    tagline: 'Beyond spreadsheets',
    intro: 'A focused workspace for teams that have outgrown spreadsheets but not their budget.',
    stats: [
      { value: '2026', label: 'Private beta' },
      { value: '12', label: 'Pilot teams' },
      { value: '5 min', label: 'Average setup' },
    ],
    features: [
      { title: 'Tables that think', desc: 'Familiar grids with relations, validation and history built in.' },
      { title: 'Workflows', desc: 'Approvals, reminders and hand-offs without writing a line of code.' },
      { title: 'Live dashboards', desc: 'Numbers that update as the work happens, shareable in one link.' },
      { title: 'AI assistant', desc: 'Ask questions about your data in plain language.' },
    ],
    audience: ['Operations teams', 'Agencies', 'Small finance teams', 'Field services'],
    steps: [
      { title: 'Join the waitlist', desc: 'Leave your email and tell us about your team.' },
      { title: 'Import', desc: 'Bring in your spreadsheets in a few clicks.' },
      { title: 'Automate', desc: 'Turn repeated steps into workflows.' },
      { title: 'Share', desc: 'Give everyone the view they need.' },
    ],
    faqs: [
      { q: 'When does it launch?', a: 'Public launch is planned after the current beta. Waitlist members get access first.' },
      { q: 'Can I join the beta?', a: 'Yes. Email us and we will add your team to the next cohort.' },
    ],
  },
  {
    slug: 'product-three',
    name: 'Product Three',
    status: 'Planned · 2027',
    category: 'Commerce intelligence',
    tagline: 'One view for merchants',
    intro: 'Inventory, pricing and demand signals for independent merchants, in one view.',
    stats: [
      { value: '2027', label: 'Planned launch' },
      { value: '3', label: 'Data sources at launch' },
      { value: 'Daily', label: 'Signal refresh' },
    ],
    features: [
      { title: 'Stock signals', desc: 'Know what will run out before it does.' },
      { title: 'Pricing insight', desc: 'See how your prices compare and where margin is hiding.' },
      { title: 'Demand forecasts', desc: 'Simple forecasts you can act on, not a data science project.' },
      { title: 'Store connectors', desc: 'Works with the commerce platforms merchants already use.' },
    ],
    audience: ['Independent retailers', 'D2C brands', 'Marketplace sellers'],
    steps: [
      { title: 'Connect', desc: 'Link your store and sales channels.' },
      { title: 'Learn', desc: 'We build a picture of your catalogue and demand.' },
      { title: 'Act', desc: 'Get clear, weekly recommendations.' },
      { title: 'Measure', desc: 'Track what each change did to revenue.' },
    ],
    faqs: [{ q: 'Can I get early access?', a: 'Email us. We are talking to merchants now to shape the first version.' }],
  },
]

export const productBySlug = (slug?: string) => productsDetail.find((p) => p.slug === slug)

export const productMedia = (slug: string) => ({
  hero: `/media/products/${slug}-hero.jpg`,
  card: (n: number) => `/media/products/cards/${slug}-${n}.jpg`,
})
