import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ComponentType } from 'react'
import CountUp from '@/components/bits/CountUp'
import PageShell from '@/components/PageShell'
import { Globe, Quote } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { AnimatedText, Button, Reveal, SectionHead, Tag } from '@/components/ui'
import { aboutIntro, aboutMedia, aboutStats, ceoQuote, milestones, story, studio, team, values, type TeamMember } from '@/data/about'
import { company } from '@/data/site'
import { socials } from '@/sections/Footer'

const EASE = [0.16, 1, 0.3, 1] as const
const iconFor: Record<string, ComponentType<{ className?: string }>> = {
  ...Object.fromEntries(socials.map((s) => [s.label, s.Icon])),
  GitHub: FaGithub,
  Website: Globe,
}

export default function AboutPage() {
  return (
    <PageShell>
      <AboutHero />
      <Story />
      <Numbers />
      <Values />
      <Team />
      <StudioAndCareers />
    </PageShell>
  )
}

function AboutHero() {
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
        <span className="text-fg-2">About</span>
      </motion.nav>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <Tag>About ENUVOR</Tag>
          <h1 className="font-display text-[clamp(2.8rem,6.6vw,5.6rem)] leading-[0.95] font-[470]">
            <AnimatedText as="span" className="block" speed={1.6} delay={0.4}>
              We build products,
            </AnimatedText>
            <AnimatedText as="span" className="block text-fg-2" speed={1.6} delay={0.6}>
              and the teams behind them.
            </AnimatedText>
          </h1>
          <AnimatedText preset="fade" speed={4} delay={0.7} className="max-w-[46ch] text-[17px] leading-relaxed text-mute">
            {aboutIntro}
          </AnimatedText>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="flex flex-wrap gap-3"
          >
            <Button variant="light" href="#team">
              Meet the team
            </Button>
            <Button href="#careers">Careers</Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8% round 22px)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          className="corner-hit [--shine:220px] relative mx-auto w-full max-w-[420px] rounded-[22px] border border-line bg-surface p-2 lg:mx-0 lg:ml-auto"
        >
          <div className="aspect-[3/4] overflow-hidden rounded-[16px]">
            <img src={aboutMedia.hero} alt="The ENUVOR team" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-ink/70 px-3 py-2 backdrop-blur">
            <span className="size-1.5 rounded-full bg-amber" />
            <span className="label text-fg-2">{studio.city}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Story() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const line = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead tag="Our story" title="From a three-person team to a product company." />
        </div>

        <div>
          <div className="flex flex-col gap-5">
            {story.map((p, i) => (
              <AnimatedText key={i} preset="fade" speed={4} className="max-w-[60ch] text-[17px] leading-relaxed text-fg-2">
                {p}
              </AnimatedText>
            ))}
          </div>

          <div className="relative mt-14">
            <div className="absolute bottom-0 left-0 top-0 w-px bg-line" />
            <motion.div style={{ scaleY: line }} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-amber" />
            <ol ref={ref} className="flex flex-col">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.05}>
                  <li className="relative grid grid-cols-[72px_1fr] gap-4 py-6 pl-8 sm:grid-cols-[96px_1fr] sm:pl-10">
                    <span className="absolute left-0 top-[34px] size-[9px] -translate-x-1/2 rounded-full bg-amber" />
                    <span className="font-display text-[28px] leading-none font-[460] text-fg-2 sm:text-[34px]">{m.year}</span>
                    <div className="pt-1">
                      <h3 className="font-display text-[20px] leading-tight font-[500]">{m.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-mute">{m.desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function Numbers() {
  return (
    <section className="container-x py-10 md:py-16">
      <div className="corner-hit [--shine:160px] grid grid-cols-2 rounded-[22px] border border-line lg:grid-cols-4">
        {aboutStats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.06}
            className="flex flex-col justify-between gap-10 border-line p-6 md:p-8 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 [&:not(:last-child)]:border-r max-lg:[&:nth-child(2)]:border-r-0"
          >
            <div>
              <p className="font-display flex items-baseline text-[clamp(2.4rem,4.6vw,3.6rem)] leading-none font-[460] tabular-nums">
                <CountUp to={s.to} duration={2} mode="roll" />
                <span className="text-amber">{s.suffix}</span>
              </p>
              <p className="label mt-3 text-mute">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Values() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHead
        align="center"
        tag="What we believe"
        title="Four things we won't compromise on."
        className="mb-14 md:mb-16"
      />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.06}>
            <article className="corner-hit [--shine:100px] flex h-full flex-col justify-between gap-12 rounded-[20px] border border-line bg-surface p-6 md:p-7">
              <span className="label text-amber">/ 0{i + 1}</span>
              <div>
                <h3 className="font-display text-[24px] leading-tight font-[500]">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mute">{v.desc}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function SocialLink({ label, href }: { label: string; href: string }) {
  const Icon = iconFor[label]
  if (!Icon) return null
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="grid size-8 place-items-center rounded-[6px] border border-line-2 bg-surface-2 text-fg-2 transition-colors hover:border-amber/50 hover:text-fg"
    >
      <Icon className="size-[14px]" aria-hidden />
    </a>
  )
}

/** Shows at most two social icons per member, in this order of preference. */
const socialsFor = (m: TeamMember) =>
  [
    { label: 'LinkedIn', href: m.linkedin },
    { label: 'X', href: m.x },
    { label: 'GitHub', href: m.github },
    { label: 'Instagram', href: m.instagram },
    { label: 'Website', href: m.website },
  ]
    .filter((s): s is { label: string; href: string } => Boolean(s.href))
    .slice(0, 2)

function MemberCard({ m, n }: { m: TeamMember; n: number }) {
  return (
    <article className="corner-hit [--shine:110px] group relative aspect-[3/4] rounded-[18px]">
      <div className="absolute inset-0 overflow-hidden rounded-[18px] bg-surface-2">
        <img
          src={aboutMedia.member(n)}
          alt={m.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 rounded-b-[18px] bg-gradient-to-t from-ink/90 to-transparent p-4 pt-14 md:p-5 md:pt-16">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-[480] leading-snug text-fg md:text-[17px]">{m.name}</p>
          <p className="label mt-1 truncate text-[10px]! text-mute">{m.role}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {socialsFor(m).map((s) => (
            <SocialLink key={s.label} label={s.label} href={s.href} />
          ))}
        </div>
      </div>
    </article>
  )
}

function Team() {
  return (
    <section id="team" className="container-x py-24 md:py-32">
      <Reveal>
        <figure className="mb-24 grid items-center gap-8 md:mb-32 lg:grid-cols-[minmax(0,540px)_280px] lg:justify-center lg:gap-16">
          <div className="flex flex-col gap-6">
            <Quote className="size-9 fill-dim text-dim" strokeWidth={1.5} aria-hidden />
            <blockquote>
              <AnimatedText as="p" className="font-display text-[clamp(1.4rem,2.3vw,1.95rem)] leading-[1.2] font-[460] text-balance">
                {ceoQuote.text}
              </AnimatedText>
            </blockquote>
            <figcaption>
              <p className="text-[15px] text-fg">{ceoQuote.name}</p>
              <p className="label mt-2 text-mute">{ceoQuote.role}</p>
            </figcaption>
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-[14px]">
            <img src={aboutMedia.member(1)} alt={ceoQuote.name} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </figure>
      </Reveal>
      <div className="mb-14 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <SectionHead
          tag="Team"
          title="The people behind the work."
          desc="Engineers, designers, strategists and storytellers, working as one team on every project."
        />
        <Reveal delay={0.1}>
          <p className="label max-w-[30ch] text-mute md:text-right">{team.length} leads · 40+ across the studio</p>
        </Reveal>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {team.map((m, i) => (
          <Reveal key={`${m.role}-${i}`} delay={(i % 4) * 0.06}>
            <MemberCard m={m} n={i + 1} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function StudioAndCareers() {
  return (
    <section className="container-x pb-10 md:pb-16">
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <article className="corner-hit [--shine:240px] relative h-full rounded-[22px] border border-line bg-surface p-2">
            <div className="aspect-[16/10] h-full overflow-hidden rounded-[16px] lg:aspect-auto lg:min-h-[420px]">
              <img src={aboutMedia.studio} alt="The ENUVOR studio" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-2 rounded-[16px] bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute inset-x-2 bottom-2 p-5 md:p-8">
              <Tag>The studio</Tag>
              <h3 className="font-display mt-4 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] font-[480]">{studio.city}</h3>
              <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-fg-2">{studio.note}</p>
              <p className="label mt-3 text-mute">{studio.hours}</p>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.08}>
          <article
            id="careers"
            className="corner-hit [--shine:150px] flex h-full flex-col justify-between gap-10 rounded-[22px] border border-line bg-surface p-6 md:p-8"
          >
            <div className="flex flex-col items-start gap-4">
              <Tag>Careers</Tag>
              <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.05] font-[480]">Do the best work of your career.</h3>
              <p className="text-[15px] leading-relaxed text-mute">
                We hire people who care about craft and outcomes. Remote-friendly, with a studio in Dhaka for those who like a desk.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="light" href={`mailto:${company.email}?subject=Careers`} className="justify-between">
                See open roles
              </Button>
              <p className="label text-center text-dim">{company.email}</p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
