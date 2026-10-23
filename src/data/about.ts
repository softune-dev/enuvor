// Content for /about. Team names, roles and bios are placeholders — replace them with your real team.
// Photos live in /public/media/about/team/member-N.webp; replace a file with the same name to swap it.

export const aboutIntro =
  'ENUVOR is a product company that also builds for others. We run our own SaaS, and we bring the same care to every client platform, app, automation and launch.'

export const story = [
  'We started as a small engineering team building software for local businesses. The work that lasted was always the work we kept looking after after launch, so we started building our own products to prove the approach.',
  'Today ENUVOR is home to SoftuneBD and a growing portfolio of SaaS, and a studio that designs, builds and grows products for teams around the world. One team covers engineering, AI, design, motion and marketing, so nothing gets lost between vendors.',
]

export const milestones = [
  { year: '2019', title: 'First line of code', desc: 'A three-person team building custom software in Dhaka.' },
  { year: '2021', title: 'SoftuneBD launches', desc: 'Our first company and product suite goes live.' },
  { year: '2023', title: 'Studio opens', desc: 'Design, motion and growth join engineering under one roof.' },
  { year: '2025', title: 'AI practice', desc: 'Agents and automation become a core service line.' },
  { year: '2026', title: 'ENUVOR', desc: 'One parent company for our products and our studio.' },
]

export const aboutStats = [
  { to: 7, suffix: '+', label: 'Years building' },
  { to: 40, suffix: '+', label: 'People on the team' },
  { to: 120, suffix: '+', label: 'Projects shipped' },
  { to: 9, suffix: '', label: 'Countries served' },
]

export const values = [
  { title: 'Own the outcome', desc: 'We measure success by what the product does after launch, not by hours billed.' },
  { title: 'Ship every week', desc: 'Small, visible releases beat long silences. You always see real progress.' },
  { title: 'Craft is a feature', desc: 'Performance, accessibility and detail are part of the scope, never extras.' },
  { title: 'Say it plainly', desc: 'Clear scope, honest estimates and no surprises on the invoice.' },
]

// CEO quote shown above the team grid. Replace the text, name and role with your own.
export const ceoQuote = {
  text: 'Our goal is simple: build thoughtful systems that help businesses run more clearly and scale with confidence.',
  name: 'Team Member',
  role: 'CEO & Co-founder of ENUVOR',
}

export type TeamMember = {
  name: string
  role: string
  bio: string
  linkedin?: string
  x?: string
  github?: string
  instagram?: string
  website?: string
}

export const team: TeamMember[] = [
  {
    name: 'Team Member',
    role: 'Founder & CEO',
    bio: 'Product direction & vision.',
    linkedin: '#',
    x: '#',
    github: '#',
  },
  {
    name: 'Team Member',
    role: 'Co-founder & CTO',
    bio: 'Engineering & AI systems.',
    linkedin: '#',
    x: '#',
    github: '#',
  },
  {
    name: 'Team Member',
    role: 'Head of Design',
    bio: 'Product & brand systems.',
    linkedin: '#',
    x: '#',
    instagram: '#',
  },
  {
    name: 'Team Member',
    role: 'Head of Growth',
    bio: 'Growth & lifecycle.',
    linkedin: '#',
    x: '#',
    website: '#',
  },
  {
    name: 'Team Member',
    role: 'Engineering Lead',
    bio: 'Platforms & cloud infra.',
    linkedin: '#',
    x: '#',
    github: '#',
  },
  {
    name: 'Team Member',
    role: 'Mobile Lead',
    bio: 'iOS & Android apps.',
    linkedin: '#',
    x: '#',
    github: '#',
  },
  {
    name: 'Team Member',
    role: 'AI Lead',
    bio: 'Agents & data pipelines.',
    linkedin: '#',
    x: '#',
    github: '#',
  },
  {
    name: 'Team Member',
    role: 'Motion & 3D Lead',
    bio: '3D & motion design.',
    linkedin: '#',
    x: '#',
    instagram: '#',
  },
]

export const studio = {
  city: 'Dhaka, Bangladesh',
  note: 'Our studio is in Dhaka, and we work with clients across Asia, Europe and North America.',
  hours: 'Sunday to Thursday, 10:00 to 19:00 (GMT+6)',
}

export const aboutMedia = {
  hero: '/media/about/hero.webp',
  studio: '/media/about/studio.webp',
  member: (n: number) => `/media/about/team/member-${n}.webp`,
}
