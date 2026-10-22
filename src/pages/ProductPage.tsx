import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { useParams } from 'react-router'
import NotFound from '@/pages/NotFound'
import CountUp from '@/components/bits/CountUp'
import PageShell from '@/components/PageShell'
import { AnimatedText, Button, Chevron, Reveal, SectionHead, Tag } from '@/components/ui'
import { productBySlug, productMedia, productsDetail, type ProductDetail } from '@/data/products'
import Faq from '@/sections/Faq'

const EASE = [0.16, 1, 0.3, 1] as const

export default function ProductPage() {
  const { slug } = useParams()
  const product = productBySlug(slug)
  if (!product) return <NotFound />

  return (
    <PageShell>
      <ProductHero p={product} />
      <Features p={product} />
      <Steps p={product} />
      <Audience p={product} />
      <Faq items={product.faqs} title={`${product.name},`} titleMuted="explained." />
      <Others p={product} />
    </PageShell>
  )
}

/** Counts up the first number in a stat like "99.9%" or "60+"; pure words ("Daily") render as-is. */
function StatValue({ value }: { value: string }) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return <>{value}</>
  const [, prefix, num, suffix] = m
  const decimals = num.includes('.') ? num.split('.')[1].length : 0
  return (
    <span className="flex items-baseline tabular-nums">
      {prefix && <span className="text-amber">{prefix}</span>}
      <CountUp to={parseFloat(num)} duration={2} mode="roll" decimals={decimals} separator="" />
      {suffix && <span className="text-amber">{suffix}</span>}
    </span>
  )
}

function ProductHero({ p }: { p: ProductDetail }) {
  const live = p.status === 'Live'
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
        <a href="/#products" className="transition-colors hover:text-fg">Products</a>
        <span>/</span>
        <span className="text-fg-2">{p.name}</span>
      </motion.nav>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-3">
            <Tag>{p.category}</Tag>
            <span className="label flex items-center gap-2 text-fg-2">
              <span className={`size-1.5 rounded-full ${live ? 'bg-amber' : 'bg-volt-2'}`} />
              {p.status}
            </span>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.95] font-[470]">
            <AnimatedText as="span" className="block" speed={1.6} delay={0.45}>
              {p.name}
            </AnimatedText>
          </h1>
          <AnimatedText preset="fade" speed={4} delay={0.7} className="max-w-[46ch] text-[18px] leading-relaxed text-fg-2">
            {p.intro}
          </AnimatedText>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="flex flex-wrap gap-3"
          >
            {live && p.url ? (
              <Button variant="light" href={p.url}>Visit {p.name}</Button>
            ) : (
              <Button variant="light" href={`mailto:hello@enuvor.com?subject=${encodeURIComponent(p.name + ' early access')}`}>
                Get early access
              </Button>
            )}
            <Button href="/contact">Talk to us</Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8% round 22px)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          className="corner-hit [--shine:220px] relative rounded-[22px] border border-line bg-surface p-2"
        >
          <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
            <img src={productMedia(p.slug).hero} alt={p.name} className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-ink/70 px-3 py-2 backdrop-blur">
            <span className="size-1.5 rounded-full bg-amber" />
            <span className="label text-fg-2">{p.tagline}</span>
          </div>
        </motion.div>
      </div>

      <div className="corner-hit [--shine:150px] mt-16 grid grid-cols-1 rounded-[22px] border border-line sm:grid-cols-3">
        {p.stats.map((st, i) => (
          <Reveal key={st.label} delay={i * 0.06} className="border-line p-6 md:p-8 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r">
            <p className="font-display text-[clamp(2rem,3.6vw,2.8rem)] leading-none font-[460]">
              <StatValue value={st.value} />
            </p>
            <p className="label mt-3 text-mute">{st.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Features({ p }: { p: ProductDetail }) {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <SectionHead tag="Features" title="What it does, plainly." />
        <Reveal delay={0.1}>
          <p className="label max-w-[30ch] text-mute md:text-right">{p.features.length} core features</p>
        </Reveal>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {p.features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 2) * 0.08}>
            <article className="corner-hit [--shine:80px] group grid h-[192px] grid-cols-[140px_1fr] gap-2 rounded-[18px] border border-line bg-surface p-2 transition-colors duration-300 hover:border-line-2 sm:grid-cols-[190px_1fr]">
              <div className="relative overflow-hidden rounded-[12px] bg-surface-2">
                <img
                  src={productMedia(p.slug).card(i + 1)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-2.5 px-3 py-2 md:px-5">
                <span className="label text-amber">/ 0{i + 1}</span>
                <AnimatedText as="h3" className="font-display text-[clamp(1.35rem,2.1vw,1.75rem)] leading-[1.05] font-[500]">
                  {f.title}
                </AnimatedText>
                <AnimatedText as="p" preset="fade" speed={4} className="line-clamp-3 text-[15.5px] leading-relaxed text-mute">
                  {f.desc}
                </AnimatedText>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Step({ i, total, progress, title, desc }: { i: number; total: number; progress: MotionValue<number>; title: string; desc: string }) {
  const start = i / total
  const lit = useTransform(progress, [start - 0.08, start + 0.08], [0.28, 1])
  const dot = useTransform(progress, [start - 0.02, start + 0.04], [0, 1])
  return (
    <motion.li style={{ opacity: lit }} className="relative grid grid-cols-[56px_1fr] gap-4 py-8 pl-8 sm:grid-cols-[88px_1fr] sm:gap-8 sm:pl-12">
      <motion.span style={{ scale: dot, opacity: dot }} className="absolute left-0 top-[44px] size-[11px] -translate-x-1/2 rounded-full bg-amber" />
      <span className="font-display text-[44px] leading-none font-[400] text-fg-2 sm:text-[64px]">0{i + 1}</span>
      <div className="pt-1">
        <h3 className="font-display text-[26px] leading-none font-[500] sm:text-[32px]">{title}</h3>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-mute">{desc}</p>
      </div>
    </motion.li>
  )
}

function Steps({ p }: { p: ProductDetail }) {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  return (
    <section className="container-x py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead tag="Getting started" title={`From first call to running on ${p.name}.`} desc="Four steps, with a person from our team on every one." />
        </div>
        <div className="relative">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-line" />
          <motion.div style={{ scaleY: scrollYProgress }} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-amber" />
          <ol ref={ref} className="divide-y divide-line">
            {p.steps.map((s, i) => (
              <Step key={s.title} i={i} total={p.steps.length} progress={scrollYProgress} title={s.title} desc={s.desc} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Audience({ p }: { p: ProductDetail }) {
  return (
    <section className="border-y border-line py-16 md:py-20">
      <div className="container-x flex flex-col items-center gap-8 text-center">
        <Tag>Built for</Tag>
        <AnimatedText as="h3" className="font-display max-w-[22ch] text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.05] font-[460] text-balance">
          Teams that need it to just work
        </AnimatedText>
        <div className="flex flex-wrap justify-center gap-2">
          {p.audience.map((a, i) => (
            <Reveal key={a} delay={i * 0.05}>
              <span className="label inline-block rounded-[10px] border border-line-2 bg-surface-2 px-4 py-2.5 text-[12px]! text-fg-2">{a}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Others({ p }: { p: ProductDetail }) {
  const others = productsDetail.filter((x) => x.slug !== p.slug)
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHead tag="Portfolio" title="More from ENUVOR" className="mb-12" />
      <div className="grid gap-3 md:grid-cols-2">
        {others.map((o, i) => (
          <Reveal key={o.slug} delay={i * 0.06}>
            <a
              href={`/products/${o.slug}`}
              className="corner-hit [--shine:80px] group flex h-full flex-col rounded-[18px] border border-line bg-surface p-2 transition-colors duration-300 hover:border-line-2"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-[12px]">
                <img src={productMedia(o.slug).hero} alt="" loading="lazy" className="h-full w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-[15px] text-fg">{o.name}</p>
                  <p className="text-[13px] text-mute">{o.category} · {o.status}</p>
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
