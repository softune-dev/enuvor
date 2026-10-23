// Portfolio shown on /work. `services` uses the slugs from src/data/services.ts.
// Images live at /public/media/work/<slug>.webp — replace a file with the same name to swap it.

export type Project = {
  slug: string
  client: string
  title: string
  summary: string
  year: string
  sector: string
  services: string[]
  result: { value: string; label: string }
  /** Grid footprint: lg spans two columns and two rows, md two columns, sm one. */
  size: 'lg' | 'md' | 'sm'
}

export const projects: Project[] = [
  {
    slug: 'atlas-pay',
    client: 'Atlas Pay',
    title: 'A merchant dashboard that replaced four tools',
    summary: 'Onboarding, payouts and reporting rebuilt into one web app, with reconciliation automated end to end.',
    year: '2026',
    sector: 'Fintech',
    services: ['web-applications', 'custom-software', 'integrations'],
    result: { value: '62%', label: 'Faster onboarding' },
    size: 'lg',
  },
  {
    slug: 'lumen-co',
    client: 'Lumen&Co',
    title: 'Headless storefront with launch videos to match',
    summary: 'New store, product renders and a 40-second video shipped as one coordinated release.',
    year: '2026',
    sector: 'E-commerce',
    services: ['e-commerce', 'motion-3d-video'],
    result: { value: '2.3x', label: 'Conversion rate' },
    size: 'sm',
  },
  {
    slug: 'kestrel',
    client: 'Kestrel',
    title: 'An AI agent that answers dispatch questions',
    summary: 'Trained on routes, SLAs and history, it resolves most driver and customer queries on its own.',
    year: '2025',
    sector: 'Logistics',
    services: ['ai-agents', 'ai-automation'],
    result: { value: '71%', label: 'Queries auto-resolved' },
    size: 'sm',
  },
  {
    slug: 'halcyon',
    client: 'Halcyon',
    title: 'A patient app people actually keep',
    summary: 'Appointments, reminders and records in one calm mobile experience for iOS and Android.',
    year: '2025',
    sector: 'Healthcare',
    services: ['mobile-apps'],
    result: { value: '4.8★', label: 'Store rating' },
    size: 'md',
  },
  {
    slug: 'northwind',
    client: 'Northwind',
    title: 'Inventory ERP for twelve warehouses',
    summary: 'Stock, purchasing and transfers moved off spreadsheets into one system with live dashboards.',
    year: '2025',
    sector: 'Retail',
    services: ['custom-software', 'data-analytics'],
    result: { value: '4.2h', label: 'Saved per day' },
    size: 'sm',
  },
  {
    slug: 'meridian',
    client: 'Meridian',
    title: 'Compliance reviews in minutes, not hours',
    summary: 'An AI agent reads filings, flags risks and drafts the summary for an analyst to approve.',
    year: '2026',
    sector: 'Fintech',
    services: ['ai-agents', 'data-analytics'],
    result: { value: '9h→20m', label: 'Per review' },
    size: 'lg',
  },
  {
    slug: 'parallax',
    client: 'Parallax',
    title: 'A brand built for a new media company',
    summary: 'Name, identity and a content system that runs across five channels every week.',
    year: '2024',
    sector: 'Media',
    services: ['brand-identity', 'content-social'],
    result: { value: '+180%', label: 'Engagement' },
    size: 'md',
  },
  {
    slug: 'orbitra',
    client: 'Orbitra',
    title: 'Self-serve analytics for a SaaS platform',
    summary: 'Customer-facing dashboards and exports built into the product, backed by a new warehouse.',
    year: '2026',
    sector: 'SaaS',
    services: ['web-applications', 'data-analytics'],
    result: { value: '3x', label: 'Faster reporting' },
    size: 'sm',
  },
  {
    slug: 'vantage',
    client: 'Vantage',
    title: 'Lead routing that never sleeps',
    summary: 'Ads, forms and CRM connected so every lead is qualified and assigned within seconds.',
    year: '2025',
    sector: 'Real estate',
    services: ['ai-automation', 'integrations', 'performance-marketing'],
    result: { value: '−38%', label: 'Cost per lead' },
    size: 'sm',
  },
  {
    slug: 'monolith',
    client: 'Monolith',
    title: 'A 3D launch for industrial hardware',
    summary: 'Photoreal renders and a launch video built from CAD files, cut for every channel.',
    year: '2024',
    sector: 'Manufacturing',
    services: ['motion-3d-video'],
    result: { value: '1.2M', label: 'Views in month one' },
    size: 'md',
  },
  {
    slug: 'fieldnote',
    client: 'Fieldnote',
    title: 'A learning app for 40,000 students',
    summary: 'Lessons, quizzes and offline mode across mobile and web, sharing one backend.',
    year: '2025',
    sector: 'Education',
    services: ['mobile-apps', 'web-applications'],
    result: { value: '40k', label: 'Monthly learners' },
    size: 'sm',
  },
  {
    slug: 'solace',
    client: 'Solace Hotels',
    title: 'Direct bookings up, commissions down',
    summary: 'A faster booking site, local SEO and lifecycle email that moved guests off third-party platforms.',
    year: '2024',
    sector: 'Hospitality',
    services: ['e-commerce', 'performance-marketing'],
    result: { value: '+64%', label: 'Direct bookings' },
    size: 'md',
  },
]

export const projectImage = (slug: string) => `/media/work/${slug}.webp`
