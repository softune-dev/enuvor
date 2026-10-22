import { motion } from 'motion/react'
import { useLocation } from 'react-router'
import PageShell from '@/components/PageShell'
import { AnimatedText, Button, Chevron, Tag } from '@/components/ui'

const EASE = [0.16, 1, 0.3, 1] as const

const links = [
  { title: 'Services', desc: 'What we build', href: '/#services' },
  { title: 'Work', desc: 'Projects we shipped', href: '/work' },
  { title: 'About', desc: 'The team behind ENUVOR', href: '/about' },
  { title: 'Blog', desc: 'Notes from the studio', href: '/blog' },
]

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <PageShell>
      <section className="container-x flex min-h-[80svh] flex-col justify-center pb-20 pt-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <Tag>Error 404</Tag>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
              aria-hidden
              className="font-display text-[clamp(7rem,22vw,16rem)] leading-[0.8] font-[480] tracking-[-0.04em]"
            >
              4<span className="text-amber">0</span>4
            </motion.p>
            <h1 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-[470]">
              <AnimatedText as="span" className="block" speed={1.6} delay={0.6}>
                This page took a different route.
              </AnimatedText>
            </h1>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-fg-2">
              We could not find <span className="label break-all text-fg">{pathname}</span>. It may have moved, or the link may be out of date.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
              className="flex flex-wrap gap-3"
            >
              <Button variant="light" href="/">Back to home</Button>
              <Button href="mailto:hello@enuvor.com">Report a broken link</Button>
            </motion.div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="label mb-2 text-mute">Try one of these</p>
            {links.map((l, i) => (
              <motion.a
                key={l.title}
                href={l.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 + i * 0.07, ease: EASE }}
                className="corner-hit [--shine:60px] group flex items-center justify-between gap-4 rounded-[16px] border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-2"
              >
                <div>
                  <p className="text-[16px] text-fg">{l.title}</p>
                  <p className="text-[13px] text-mute">{l.desc}</p>
                </div>
                <Chevron className="text-dim transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-fg" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
