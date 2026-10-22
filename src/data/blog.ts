// Posts for /blog and /blog/:slug. These are placeholders; replace them with real articles.
// Cover images live in /public/media/blog/<slug>.jpg; replace a file with the same name to swap it.

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  author: { name: string; role: string }
  body: { heading?: string; text: string }[]
}

const author = { name: 'Team Member', role: 'ENUVOR Studio' }

export const posts: Post[] = [
  {
    slug: 'building-products-we-own',
    title: 'Why we build products we own',
    excerpt: 'Running our own SaaS changed how we build for clients. Here is what we learned.',
    category: 'Company',
    date: '2026-10-08',
    readTime: '6 min',
    author,
    body: [
      { text: 'Most studios hand over a project and move on. We stay, because our own products taught us that launch is where the real work begins.' },
      { heading: 'Launch is the start', text: 'Every product we run gets weekly releases, real metrics and a support queue. That habit now shapes every client engagement.' },
      { heading: 'Owning the outcome', text: 'When you pay the hosting bill and answer the support tickets, you make different decisions. Simpler architecture, fewer dependencies, better monitoring.' },
      { heading: 'What it means for clients', text: 'You get a team that already knows what breaks at scale, and that plans for the second year, not just the first demo.' },
    ],
  },
  {
    slug: 'ai-agents-in-operations',
    title: 'AI agents that actually help operations teams',
    excerpt: 'Where automation earns its keep, and where a simple form is still the better answer.',
    category: 'AI',
    date: '2026-09-22',
    readTime: '8 min',
    author,
    body: [
      { text: 'Agents are useful when the task is repetitive, the inputs are messy and a person can check the result. Outside that, they often add cost without value.' },
      { heading: 'Start with the queue', text: 'Look at the tickets, emails or forms your team handles every day. The repeated ones are your first candidates.' },
      { heading: 'Keep a human in the loop', text: 'Every agent we ship has a review step until the numbers say it can run alone.' },
    ],
  },
  {
    slug: 'weekly-releases',
    title: 'The case for shipping every week',
    excerpt: 'Small, visible releases beat long silences. How we keep the rhythm on every project.',
    category: 'Engineering',
    date: '2026-09-02',
    readTime: '5 min',
    author,
    body: [
      { text: 'A weekly release forces small scope, constant testing and honest progress. It also makes clients calmer.' },
      { heading: 'Preview links for everything', text: 'Every change gets a link you can click. Feedback arrives in days instead of months.' },
      { heading: 'Feature flags', text: 'Unfinished work ships hidden, so the main branch is always ready to go live.' },
    ],
  },
  {
    slug: 'design-systems-small-teams',
    title: 'Design systems for small teams',
    excerpt: 'You do not need a hundred components. You need ten good ones and clear rules.',
    category: 'Design',
    date: '2026-08-14',
    readTime: '7 min',
    author,
    body: [
      { text: 'Small teams copy big company design systems and drown in maintenance. Start smaller.' },
      { heading: 'Tokens first', text: 'Colour, type and spacing tokens give you most of the consistency for a fraction of the effort.' },
      { heading: 'Grow from real screens', text: 'Only promote a pattern to a component after it appears three times.' },
    ],
  },
  {
    slug: 'launch-films',
    title: 'What makes a launch film work',
    excerpt: 'Motion that explains the product in thirty seconds, without a voice-over.',
    category: 'Motion',
    date: '2026-07-29',
    readTime: '4 min',
    author,
    body: [
      { text: 'A good launch film shows one idea clearly. Everything else is decoration.' },
      { heading: 'Script the screen', text: 'We write the sequence of UI states before any 3D or motion work begins.' },
    ],
  },
  {
    slug: 'growth-after-launch',
    title: 'Growth after launch, without a big budget',
    excerpt: 'The channels and habits that moved the numbers for our own products.',
    category: 'Growth',
    date: '2026-07-10',
    readTime: '6 min',
    author,
    body: [
      { text: 'Paid ads can wait. The first growth usually comes from onboarding, email and the people already using the product.' },
      { heading: 'Fix the first week', text: 'Most churn happens in the first seven days. That is where we look first.' },
    ],
  },
]

export const blogCategories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))]

export const postBySlug = (slug?: string) => posts.find((p) => p.slug === slug)

export const postCover = (slug: string) => `/media/blog/${slug}.jpg`

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
