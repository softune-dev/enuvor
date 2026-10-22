import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import PageShell from '@/components/PageShell'
import { AnimatedText, Reveal, Tag, cx } from '@/components/ui'
import { openCookieSettings } from '@/components/CookieConsent'
import { legalBySlug, legalDocs, type LegalDoc } from '@/data/legal'

export default function LegalPage({ slug }: { slug: LegalDoc['slug'] }) {
  const doc = legalBySlug(slug)!
  const active = useActiveSection(doc.sections.map((s) => s.id))

  return (
    <PageShell>
      <section className="container-x pb-12 pt-24 md:pt-28">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          aria-label="Breadcrumb"
          className="label flex items-center gap-2 text-dim"
        >
          <a href="/" className="transition-colors hover:text-fg">Home</a>
          <span>/</span>
          <span className="text-fg-2">{doc.title}</span>
        </motion.nav>
        <div className="mt-6 flex flex-col items-start gap-6">
          <Tag>Legal</Tag>
          <h1 className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] font-[470]">
            <AnimatedText as="span" className="block" speed={1.6} delay={0.4}>
              {doc.title}
            </AnimatedText>
          </h1>
          <AnimatedText preset="fade" speed={4} delay={0.6} className="max-w-[52ch] text-[17px] leading-relaxed text-mute">
            {doc.intro}
          </AnimatedText>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="flex flex-wrap items-center gap-2"
          >
            {legalDocs.map((d) => (
              <a
                key={d.slug}
                href={`/${d.slug}`}
                aria-current={d.slug === slug ? 'page' : undefined}
                className={cx(
                  'rounded-full border px-4 py-2 text-[13.5px] transition-colors',
                  d.slug === slug ? 'border-fg bg-fg text-ink' : 'border-line-2 bg-surface-2 text-fg-2 hover:text-fg',
                )}
              >
                {d.title}
              </a>
            ))}
            <span className="label ml-2 text-dim">Updated {doc.updated}</span>
          </motion.div>
        </div>
      </section>

      <section className="container-x border-t border-line pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28 flex flex-col">
              <p className="label mb-4 text-mute">On this page</p>
              {doc.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cx(
                    'border-l py-2 pl-4 text-[14px] transition-colors',
                    active === s.id ? 'border-amber text-fg' : 'border-line text-mute hover:text-fg-2',
                  )}
                >
                  {s.heading}
                </a>
              ))}
              {slug === 'cookies' && <CookieButton className="mt-8" />}
            </nav>
          </aside>

          <article className="flex max-w-[720px] flex-col gap-12">
            {doc.sections.map((s, i) => (
              <Reveal key={s.id}>
                <section id={s.id} className="scroll-mt-28">
                  <span className="label text-amber">/ {String(i + 1).padStart(2, '0')}</span>
                  <h2 className="font-display mt-3 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] font-[500]">{s.heading}</h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {s.body.map((p, j) => (
                      <p key={j} className="text-[16px] leading-[1.75] text-fg-2">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
            {slug === 'cookies' && <CookieButton className="self-start lg:hidden" />}
          </article>
        </div>
      </section>
    </PageShell>
  )
}

function CookieButton({ className }: { className?: string }) {
  return (
    <button
      onClick={openCookieSettings}
      className={cx('rounded-full border border-line-2 bg-surface-2 px-4 py-2.5 text-[13.5px] text-fg-2 transition-colors hover:border-amber/50 hover:text-fg', className)}
    >
      Cookie settings
    </button>
  )
}

/** Highlights the section currently near the top of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids.join()])
  return active
}
