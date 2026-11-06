import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useSearchParams } from 'react-router'
import CountUp from '@/components/bits/CountUp'
import PageShell from '@/components/PageShell'
import ServiceIcon from '@/components/ServiceIcon'
import { AnimatedText, Reveal, Tag, cx } from '@/components/ui'
import { projectImage, projects, type Project } from '@/data/projects'
import { servicesDetail } from '@/data/services'

const EASE = [0.16, 1, 0.3, 1] as const
const serviceTitle = Object.fromEntries(servicesDetail.map((s) => [s.slug, s.title]))
const serviceIcon = Object.fromEntries(servicesDetail.map((s) => [s.slug, s.icon]))

export default function WorkPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('service')
  const active = requested && serviceTitle[requested] ? requested : 'all'

  const setActive = (slug: string) =>
    setParams(slug === 'all' ? {} : { service: slug }, { replace: true, preventScrollReset: true })

  const [featured, ...rest] = projects
  const shown = useMemo(
    () => (active === 'all' ? rest : projects.filter((p) => p.services.includes(active))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active],
  )

  // Only offer filters that have work behind them
  const filters = useMemo(
    () =>
      servicesDetail
        .map((s) => ({ slug: s.slug, title: s.title, count: projects.filter((p) => p.services.includes(s.slug)).length }))
        .filter((f) => f.count > 0),
    [],
  )

  return (
    <PageShell>
      <WorkHero />
      <Featured p={featured} />

      {/* Filters */}
      <div className="sticky top-16 z-30 mt-16 border-y border-line bg-ink/85 backdrop-blur-xl">
        <FilterRail active={active} filters={filters} setActive={setActive} />
      </div>

      {/* Grid */}
      <section className="container-x pb-24 pt-10 md:pb-32">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-[480]"
            >
              {active === 'all' ? 'All projects' : serviceTitle[active]}
            </motion.h2>
          </AnimatePresence>
          <span className="label text-mute">
            {shown.length} {shown.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <ProjectCard key={p.slug} p={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </PageShell>
  )
}

function FilterRail({
  active,
  filters,
  setActive,
}: {
  active: string
  filters: { slug: string; title: string; count: number }[]
  setActive: (slug: string) => void
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const syncArrows = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    setCanScrollLeft(rail.scrollLeft > 2)
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2)
  }, [])

  useEffect(() => {
    syncArrows()
    const rail = railRef.current
    if (!rail) return
    const observer = new ResizeObserver(syncArrows)
    observer.observe(rail)
    window.addEventListener('resize', syncArrows)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncArrows)
    }
  }, [syncArrows])

  useEffect(() => {
    const rail = railRef.current
    const selected = rail?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!rail || !selected) return
    const target = selected.offsetLeft - (rail.clientWidth - selected.offsetWidth) / 2
    rail.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
    const timer = window.setTimeout(syncArrows, 350)
    return () => window.clearTimeout(timer)
  }, [active, syncArrows])

  const slide = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * Math.max(240, railRef.current.clientWidth * 0.7), behavior: 'smooth' })
  }

  return (
    <div className="container-x py-3">
      <div className="mx-auto flex max-w-[1040px] items-center gap-2">
        <FilterArrow direction="left" onClick={() => slide(-1)} disabled={!canScrollLeft} />
        <div
          ref={railRef}
          data-lenis-prevent
          onScroll={syncArrows}
          className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter work by service"
        >
          <LayoutGroup id="work-filter-tabs">
            <div className="flex w-max gap-1.5 px-0.5">
              <FilterChip active={active === 'all'} onClick={() => setActive('all')} label="All work" count={projects.length} />
              {filters.map((f) => (
                <FilterChip
                  key={f.slug}
                  active={active === f.slug}
                  onClick={() => setActive(f.slug)}
                  label={f.title}
                  count={f.count}
                  icon={serviceIcon[f.slug]}
                />
              ))}
            </div>
          </LayoutGroup>
        </div>
        <FilterArrow direction="right" onClick={() => slide(1)} disabled={!canScrollRight} />
      </div>
    </div>
  )
}

function FilterArrow({ direction, onClick, disabled }: { direction: 'left' | 'right'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll filters ${direction}`}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-line-2 bg-surface-2 text-fg-2 transition-colors hover:border-white/20 hover:text-fg disabled:cursor-default disabled:opacity-30"
    >
      <span className={direction === 'left' ? 'rotate-180' : ''}>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 fill-none stroke-current" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 3 5 5-5 5" />
        </svg>
      </span>
    </button>
  )
}

function WorkHero() {
  const sectors = new Set(projects.map((p) => p.sector)).size
  const services = new Set(projects.flatMap((p) => p.services)).size
  const stats = [
    { to: projects.length, label: 'Projects' },
    { to: sectors, label: 'Industries' },
    { to: services, label: 'Services involved' },
  ]
  return (
    <section className="container-x pt-24 md:pt-28">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        aria-label="Breadcrumb"
        className="label flex items-center gap-2 text-dim"
      >
        <a href="/" className="transition-colors hover:text-fg">Home</a>
        <span>/</span>
        <span className="text-fg-2">Work</span>
      </motion.nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="flex flex-col items-start gap-6">
          <Tag>Selected work</Tag>
          <h1 className="font-display text-[clamp(2.8rem,7.2vw,6rem)] leading-[0.95] font-[470]">
            <AnimatedText as="span" className="block" speed={1.6} delay={0.4}>
              Work that ships,
            </AnimatedText>
            <AnimatedText as="span" className="block text-fg-2" speed={1.6} delay={0.6}>
              and keeps working.
            </AnimatedText>
          </h1>
          <AnimatedText preset="fade" speed={4} delay={0.7} className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
            Products, platforms and websites we have built and shipped. Open any project to see what it does, then visit it live.
          </AnimatedText>
        </div>

        <div className="corner-hit [--shine:120px] grid grid-cols-3 rounded-[22px] border border-line">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.5 + i * 0.08} className={cx('p-5 md:p-6', i > 0 && 'border-l border-line')}>
              <p className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none font-[460] tabular-nums">
                <CountUp to={s.to} duration={2} mode="roll" />
              </p>
              <p className="label mt-2 text-mute">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Featured({ p }: { p: Project }) {
  return (
    <section className="container-x mt-14">
      <motion.a
        href={`/work/${p.slug}`}
        initial={{ opacity: 0, clipPath: 'inset(6% 4% 6% 4% round 22px)' }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
        transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
        className={cx('corner-hit [--shine:280px] group grid gap-2 rounded-[22px] border border-line bg-surface p-2 transition-colors duration-500 hover:border-line-2', p.wide ? 'lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]' : 'lg:grid-cols-[1fr_minmax(0,540px)]')}
      >
        <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
          <p className="label flex items-center gap-2 text-fg-2">
            <span className="size-1.5 rounded-full bg-amber" /> Featured · {p.year} · {p.sector}
          </p>
          <div className="max-w-[46ch]">
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1] font-[480]">{p.name}</h2>
            <p className="font-display mt-4 text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.15] text-fg-2">{p.title}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-mute">{p.summary}</p>
          </div>
          <span className="flex w-fit items-center gap-3 rounded-full border border-line-2 bg-surface-2 py-1.5 pr-1.5 pl-5 text-[14px] text-fg-2 transition-colors duration-300 group-hover:border-amber/50 group-hover:text-fg">
            View project
            <span className="grid size-8 place-items-center rounded-full bg-fg text-ink transition-colors duration-300 group-hover:bg-amber">
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </span>
          </span>
        </div>
        <div className={cx('overflow-hidden rounded-[16px]', p.wide ? 'aspect-[16/10]' : 'aspect-square')}>
          <img src={p.wide ?? projectImage(p.slug)} alt={p.name} className="h-full w-full object-cover" />
        </div>
      </motion.a>
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
  icon?: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cx(
        'relative flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13px] transition-colors duration-300',
        active ? 'text-ink' : 'text-fg-2 hover:text-fg',
      )}
    >
      {active && (
        <motion.span
          layoutId="active-pill"
          initial={false}
          className="absolute inset-0 rounded-full bg-fg"
          transition={{ type: 'spring', bounce: 0.12, duration: 0.5 }}
        />
      )}
      {!active && <span className="absolute inset-0 rounded-full border border-line-2" />}
      {icon && <ServiceIcon src={icon} className="relative size-[15px]" />}
      <span className="relative whitespace-nowrap">{label}</span>
      <span className={cx('label relative text-[10px]!', active ? 'text-ink/60' : 'text-dim')}>{count}</span>
    </button>
  )
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <motion.a
      layout
      href={`/work/${p.slug}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: Math.min(index, 8) * 0.04, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ layout: { duration: 0.55, ease: EASE } }}
      className="corner-hit [--shine:130px] group flex flex-col rounded-[20px] border border-line bg-surface p-2 transition-colors duration-500 hover:border-line-2"
    >
      <div className="aspect-square overflow-hidden rounded-[14px] bg-surface-2">
        <img src={projectImage(p.slug)} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <h3 className="font-display text-[20px] leading-none font-[500]">{p.name}</h3>
          <p className="mt-2 truncate text-[13.5px] text-mute">{p.title}</p>
        </div>
        <span className="label shrink-0 text-dim">{p.year}</span>
      </div>
    </motion.a>
  )
}
