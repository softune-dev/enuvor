import { productsDetail } from '@/data/products'
// All landing-page copy lives here so it can be edited without touching layout code.

export const company = {
  name: 'ENUVOR',
  email: 'hello@enuvor.com',
  phone: '+880 1XXX-XXXXXX',
  tagline: 'Products we own. Software we build for you.',
}

export type MenuLink = { title: string; desc: string; href: string; meta?: string }
export type MenuGroup = { heading: string; links: MenuLink[] }

export const servicesMenu: MenuGroup[] = [
  {
    heading: 'Build',
    links: [
      { title: 'Custom Software', desc: 'Tools, platforms and ERPs', href: '/services/custom-software' },
      { title: 'Web Applications', desc: 'Dashboards and portals', href: '/services/web-applications' },
      { title: 'Mobile Apps', desc: 'iOS, Android, cross-platform', href: '/services/mobile-apps' },
      { title: 'E-commerce', desc: 'Stores that convert', href: '/services/e-commerce' },
    ],
  },
  {
    heading: 'Automate',
    links: [
      { title: 'AI Automation', desc: 'Workflows on autopilot', href: '/services/ai-automation' },
      { title: 'AI Agents', desc: 'Assistants on your data', href: '/services/ai-agents' },
      { title: 'Integrations', desc: 'APIs, CRMs, pipelines', href: '/services/integrations' },
      { title: 'Data & Analytics', desc: 'Dashboards and reporting', href: '/services/data-analytics' },
    ],
  },
  {
    heading: 'Grow',
    links: [
      { title: 'Motion & 3D Video', desc: '3D animation and video editing', href: '/services/motion-3d-video' },
      { title: 'Brand Identity', desc: 'Naming and design systems', href: '/services/brand-identity' },
      { title: 'Performance Marketing', desc: 'Paid, SEO and lifecycle', href: '/services/performance-marketing' },
      { title: 'Content & Social', desc: 'Posts, reels, campaigns', href: '/services/content-social' },
    ],
  },
]

const statusMeta = (status: string) => (status === 'Live' ? 'Live' : status.startsWith('In') ? 'Building' : status.replace('Planned · ', ''))

export const productsMenu: MenuLink[] = productsDetail.map((p) => ({
  title: p.menuName,
  desc: p.menuDesc,
  href: `/products/${p.slug}`,
  meta: statusMeta(p.status),
}))

export const companyMenu: MenuLink[] = [
  { title: 'Our team', desc: 'Meet the people behind ENUVOR', href: '/about#team' },
  { title: 'Careers', desc: 'Join the studio', href: '#' },
  { title: 'Insights', desc: 'Answers to common questions', href: '#faq' },
]

export const heroTracks = ['SaaS Products', 'Custom Software', 'AI Automation']

export const clients = ['Northwind', 'Halcyon', 'Kestrel', 'Lumen&Co', 'Parallax', 'Orbitra', 'Vantage', 'Monolith', 'Atlas Pay', 'Fieldnote']

export const manifesto =
  'Most agencies ship a project and leave. We run our own SaaS products, so we build every client system the way we build ours, measured, maintained and made to compound long after launch.'

export const products = productsDetail.map((p) => ({
  name: p.name,
  status: p.status,
  category: p.category,
  desc: p.blurb,
  href: `/products/${p.slug}`,
  url: p.url,
  imageKey: p.imageKey,
}))

export const services = [
  {
    title: 'Product Engineering',
    sub: 'Software shaped around how your business actually runs.',
    items: ['Custom software & ERPs', 'SaaS platforms', 'Web applications', 'APIs & cloud infrastructure'],
  },
  {
    title: 'Mobile & Commerce',
    sub: 'Apps and stores people return to.',
    items: ['iOS & Android apps', 'Cross-platform (Flutter, React Native)', 'Shopify & headless e-commerce', 'Payments & checkout'],
  },
  {
    title: 'AI & Automation',
    sub: 'Less manual work, fewer errors, faster decisions.',
    items: ['Workflow automation', 'Custom AI agents & assistants', 'LLM integrations', 'Data pipelines & reporting'],
  },
  {
    title: 'Motion & Marketing',
    sub: 'Make the launch as good as the product.',
    items: ['3D & motion video', 'Brand identity systems', 'Performance marketing', 'Content & social'],
  },
]

export const process = [
  { step: '01', title: 'Discover', desc: 'Workshops, audits and a written plan with scope, timeline and cost before any code.' },
  { step: '02', title: 'Design & build', desc: 'Weekly releases you can click through. You see progress, not status reports.' },
  { step: '03', title: 'Launch & grow', desc: 'We ship, measure and keep improving, the same way we run our own products.' },
]

export const stats = [
  { to: 120, suffix: '+', label: 'Projects shipped' },
  { to: 3, suffix: '', label: 'SaaS products' },
  { to: 9, suffix: '', label: 'Countries served' },
  { to: 96, suffix: '%', label: 'Clients who return' },
]

export const comparison = {
  columns: ['ENUVOR', 'Typical agency', 'Freelancers'],
  rows: [
    { label: 'Approach', values: ['Product thinking first', 'Brief-to-spec', 'Task by task'], ok: [true, false, false] },
    { label: 'Range', values: ['Software, AI, motion, growth', 'One discipline', 'One person'], ok: [true, false, false] },
    { label: 'Speed', values: ['Weekly releases', 'Monthly milestones', 'Varies'], ok: [true, false, false] },
    { label: 'After launch', values: ['We stay and improve', 'Handover and exit', 'Availability risk'], ok: [true, false, false] },
    { label: 'Pricing', values: ['Fixed scope, clear cost', 'Change requests', 'Hourly'], ok: [true, false, false] },
  ],
}

export const testimonials = [
  {
    quote: 'ENUVOR treated our platform like it was their own product. The release cadence alone changed how our team works.',
    name: 'Client Name',
    role: 'Founder, Atlas Pay',
  },
  {
    quote: 'One team handled the store, the 3D renders and the launch campaign. Nothing got lost between vendors because there were no vendors.',
    name: 'Client Name',
    role: 'CMO, Lumen&Co',
  },
  {
    quote: 'Their automation work paid for itself in the first quarter. They still check in every month to tune it.',
    name: 'Client Name',
    role: 'COO, Kestrel',
  },
]

export const faqs = [
  {
    q: 'Who owns the SaaS products you list?',
    a: 'We do. Every product in the portfolio is built, owned and operated by ENUVOR, and new ones launch here as they are ready.',
  },
  {
    q: 'What kinds of projects do you take on?',
    a: 'Custom software, web and mobile apps, e-commerce, AI automation, motion and 3D video, and marketing. Many clients use us for several of these at once.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Focused builds ship in 4–8 weeks. Larger platforms run in phases, with something usable released every week.',
  },
  {
    q: 'Do you work with early-stage startups?',
    a: 'Yes. We help founders scope an MVP that can be launched quickly and extended later without a rewrite.',
  },
  {
    q: 'Can you support and grow the product after launch?',
    a: 'That is where we are strongest. Ongoing retainers cover maintenance, new features, automation and marketing.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a call. Within a week you get a written proposal with scope, timeline and a fixed price.',
  },
]

export const pricing = {
  yearlyDiscount: 0.2,
  plans: [
    {
      name: 'Starter',
      desc: 'For early products and small teams',
      monthly: 499,
      popular: false,
      features: [
        '1 product or workstream',
        'Design and build sprints',
        'Weekly progress releases',
        'Basic analytics setup',
        '2 weeks post-launch support',
      ],
    },
    {
      name: 'Growth',
      desc: 'For scaling teams shipping continuously',
      monthly: 999,
      popular: true,
      features: [
        'Up to 3 workstreams',
        'Web, mobile and backend',
        'AI automation and integrations',
        'Video edits and brand assets',
        '30 days optimization support',
      ],
    },
    {
      name: 'Enterprise',
      desc: 'For organizations with long-term roadmaps',
      monthly: 1999,
      popular: false,
      features: [
        'Dedicated cross-functional team',
        'Architecture and security review',
        'Custom AI agents and automation',
        'Full documentation and handover',
        'Ongoing optimization roadmap',
      ],
    },
  ],
}
