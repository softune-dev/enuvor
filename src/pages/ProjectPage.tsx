import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import PageShell from '@/components/PageShell'
import NotFound from '@/pages/NotFound'
import { AnimatedText, Button, Chevron, Reveal, SectionHead, Tag } from '@/components/ui'
import { projectBySlug, projectImage, projects, type Project } from '@/data/projects'
import { servicesDetail } from '@/data/services'

const EASE = [0.16, 1, 0.3, 1] as const
const serviceTitle = Object.fromEntries(servicesDetail.map((s) => [s.slug, s.title]))

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '')

export default function ProjectPage() {
  const { slug } = useParams()
  const project = projectBySlug(slug)
  if (!project) return <NotFound />

  return (
    <PageShell>
      <Hero p={project} />
      <Overview p={project} />
      <Story p={project} />
      <Highlights p={project} />
      {project.gallery && <Gallery p={project} />}
      <Stack p={project} />
      <Related p={project} />
    </PageShell>
  )
}

function Hero({ p }: { p: Project }) {
  return (
    <section className="container-x pb-12 pt-24 md:pt-28">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        aria-label="Breadcrumb"
        className="label flex flex-wrap items-center gap-2 text-dim"
      >
        <a href="/" className="transition-colors hover:text-fg">Home</a>
        <span>/</span>
        <a href="/work" className="transition-colors hover:text-fg">Work</a>
        <span>/</span>
        <span className="text-fg-2">{p.name}</span>
      </motion.nav>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-3">
            <Tag>{p.sector}</Tag>
            <span className="label text-fg-2">{p.year}</span>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.95] font-[470]">
            <AnimatedText as="span" className="block" speed={1.6} delay={0.45}>
              {p.name}
            </AnimatedText>
          </h1>
          <p className="font-display max-w-[24ch] text-[clamp(1.3rem,2.4vw,1.9rem)] leading-[1.15] font-[460] text-fg-2">{p.title}</p>
          <AnimatedText preset="fade" speed={4} delay={0.7} className="max-w-[46ch] text-[17px] leading-relaxed text-mute">
            {p.summary}
          </AnimatedText>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="flex flex-wrap gap-3"
          >
            {p.url && (
              <Button variant="light" href={p.url}>
                Visit {host(p.url)}
              </Button>
            )}
            <Button href="/contact">Start a project</Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8% round 22px)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          className="corner-hit [--shine:220px] relative rounded-[22px] border border-line bg-surface p-2"
        >
          <div className="aspect-square overflow-hidden rounded-[16px]">
            <img src={projectImage(p.slug)} alt={p.name} className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink/60 px-3 py-1.5 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-amber" />
            <span className="text-[13px] text-fg">{p.kind}</span>
          </div>
        </motion.div>
      </div>

      <div className="corner-hit [--shine:150px] mt-16 grid grid-cols-1 rounded-[22px] border border-line sm:grid-cols-3">
        {p.facts.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.06} className="border-line p-6 md:p-8 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r">
            <p className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none font-[460]">{f.value}</p>
            <p className="label mt-3 text-mute">{f.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Overview({ p }: { p: Project }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Industry', value: p.sector },
    { label: 'Type', value: p.kind },
    { label: 'Year', value: p.year },
    {
      label: 'Services',
      value: (
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {p.services.map((s) => (
            <a key={s} href={`/services/${s}`} className="underline decoration-line-2 underline-offset-4 transition-colors hover:text-fg hover:decoration-amber">
              {serviceTitle[s]}
            </a>
          ))}
        </span>
      ),
    },
  ]
  if (p.url) {
    rows.push({
      label: 'Live site',
      value: (
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line-2 underline-offset-4 transition-colors hover:text-fg hover:decoration-amber">
          {host(p.url)}
        </a>
      ),
    })
  }

  return (
    <section className="container-x py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHead tag="About the project" title={`What ${p.name} is.`} />
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            {p.overview.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-[clamp(1.05rem,1.5vw,1.25rem)] leading-relaxed text-fg-2">{t}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <dl className="corner-hit [--shine:120px] rounded-[18px] border border-line bg-surface">
              {rows.map((r, i) => (
                <div key={r.label} className={`grid gap-1 p-5 sm:grid-cols-[120px_1fr] sm:gap-6 md:px-7 ${i > 0 ? 'border-t border-line' : ''}`}>
                  <dt className="label text-mute">{r.label}</dt>
                  <dd className="text-[15px] leading-relaxed text-fg-2">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Story({ p }: { p: Project }) {
  const items = [
    { tag: 'The challenge', text: p.problem },
    { tag: 'What we built', text: p.solution },
  ]
  return (
    <section className="border-y border-line py-20 md:py-28">
      <div className="container-x grid gap-3 md:grid-cols-2">
        {items.map((it, i) => (
          <Reveal key={it.tag} delay={i * 0.08}>
            <article className="corner-hit [--shine:100px] flex h-full flex-col gap-5 rounded-[18px] border border-line bg-surface p-6 md:p-9">
              <span className="label text-amber">{it.tag}</span>
              <p className="font-display text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.25] font-[460] text-fg">{it.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Highlights({ p }: { p: Project }) {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <SectionHead tag="Key features" title="What it does, plainly." />
        <Reveal delay={0.1}>
          <p className="label max-w-[30ch] text-mute md:text-right">{p.highlights.length} highlights</p>
        </Reveal>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {p.highlights.map((h, i) => (
          <Reveal key={h.title} delay={(i % 3) * 0.08}>
            <article className="corner-hit [--shine:80px] flex h-full flex-col gap-4 rounded-[18px] border border-line bg-surface p-6 transition-colors duration-300 hover:border-line-2">
              <span className="font-['Playfair_Display',serif] block text-[24px] italic leading-none text-amber">0{i + 1}</span>
              <h3 className="font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.1] font-[500]">{h.title}</h3>
              <p className="text-[15px] leading-relaxed text-mute">{h.desc}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Gallery({ p }: { p: Project }) {
  return (
    <section className="container-x pb-20 md:pb-28">
      <SectionHead tag="More views" title="A closer look." className="mb-12" />
      <div className="grid gap-3 md:grid-cols-2">
        {[projectImage(p.slug), ...(p.gallery ?? [])].map((src, i) => (
          <Reveal key={src} delay={i * 0.08}>
            <div className="corner-hit [--shine:120px] rounded-[18px] border border-line bg-surface p-2">
              <div className="aspect-square overflow-hidden rounded-[12px]">
                <img src={src} alt={`${p.name} view ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Stack({ p }: { p: Project }) {
  return (
    <section className="border-y border-line py-16 md:py-20">
      <div className="container-x flex flex-col items-center gap-8 text-center">
        <Tag>Built with</Tag>
        <div className="flex flex-wrap justify-center gap-2">
          {p.stack.map((s, i) => (
            <Reveal key={s} delay={i * 0.05}>
              <span className="label inline-block rounded-[10px] border border-line-2 bg-surface-2 px-4 py-2.5 text-[12px]! text-fg-2">{s}</span>
            </Reveal>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {p.url && <Button variant="light" href={p.url}>Visit {host(p.url)}</Button>}
          <Button href="/contact">Start a project</Button>
        </div>
      </div>
    </section>
  )
}

function Related({ p }: { p: Project }) {
  const others = projects.filter((x) => x.slug !== p.slug)
  const related = [...others.filter((x) => x.services.some((s) => p.services.includes(s))), ...others.filter((x) => !x.services.some((s) => p.services.includes(s)))].slice(0, 3)
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHead tag="More work" title="Keep exploring" className="mb-12" />
      <div className="grid gap-3 md:grid-cols-3">
        {related.map((o, i) => (
          <Reveal key={o.slug} delay={i * 0.06}>
            <a
              href={`/work/${o.slug}`}
              className="corner-hit [--shine:80px] group flex h-full flex-col rounded-[18px] border border-line bg-surface p-2 transition-colors duration-300 hover:border-line-2"
            >
              <div className="aspect-square overflow-hidden rounded-[12px]">
                <img src={projectImage(o.slug)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-[15px] text-fg">{o.name}</p>
                  <p className="text-[13px] text-mute">{o.sector}</p>
                </div>
                <Chevron className="text-dim transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-fg" />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
