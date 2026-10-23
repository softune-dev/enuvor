import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { AnimatedText, Button, Tag } from '@/components/ui'
import { media } from '@/config/media'
import { heroTracks } from '@/data/site'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <>
      <section ref={ref} id="top" className="relative isolate flex min-h-[max(100svh,680px)] flex-col overflow-hidden">
      {/* Backdrop: a grayscale band behind the 3D mark, top and bottom edges faded into the page colour */}
      <motion.div
        style={{
          y: bgY,
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 32%, #000 68%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 32%, #000 68%, transparent 100%)',
        }}
        className="absolute inset-x-0 top-[28%] -z-20 h-[44%] md:top-[19%] md:h-[60%]"
      >
        <img src={media.heroBg} alt="" className="h-full w-full object-cover opacity-35 grayscale md:opacity-60" fetchPriority="high" />
      </motion.div>

      {/* Resting spot for the floating ENUVOR mark (see SiteAgent) */}
      <div
        data-orb-slot="hero"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[20%] aspect-square w-[min(78vw,340px)] -translate-x-1/2 md:top-[13%] md:w-[min(40vw,500px)]"
      />

      <div className="container-x flex flex-1 flex-col justify-between pb-8 pt-24 md:pb-10 md:pt-28">
        {/* Top row */}
        <div className="flex items-start justify-center gap-8 md:justify-between">
          <ul className="hidden flex-col gap-1.5 sm:flex">
            {heroTracks.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: EASE }}
                className="label text-fg-2"
              >
                <span className="text-amber">/</span> {t}
              </motion.li>
            ))}
          </ul>
          <div className="hidden md:block">
            <AnimatedText preset="fade" speed={4} delay={0.5} className="max-w-[34ch] text-[17px] leading-[1.45] text-fg-2">
              A product company that also builds for others, software, apps, AI, 3D animation and video, made by one team.
            </AnimatedText>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="md:hidden">
            <Tag className="bg-ink/60! backdrop-blur">Product company · Software studio</Tag>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="hidden md:block">
              <Tag className="bg-ink/60! backdrop-blur">Product company · Software studio</Tag>
            </motion.div>
            <h1 className="font-display text-center text-[clamp(2.9rem,8.4vw,6.6rem)] leading-[0.95] font-[470] md:text-left">
              <AnimatedText as="span" className="block" speed={1.6} delay={0.2}>Software that</AnimatedText>
              <AnimatedText as="span" className="block text-fg-2" speed={1.6} delay={0.45}>compounds.</AnimatedText>
            </h1>
            <div className="md:hidden">
              <AnimatedText preset="fade" speed={4} delay={0.5} className="mx-auto max-w-[40ch] text-center text-[15px] leading-relaxed text-mute">
                A product company that also builds for others, software, apps, AI, 3D animation and video.
              </AnimatedText>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="corner-hit inline-flex self-center items-stretch gap-0 rounded-[16px] border border-line-2 bg-ink/70 p-2 backdrop-blur-md md:self-end"
          >
            <video src={media.clarissaVideo} poster={media.clarissa} autoPlay loop muted playsInline aria-label="Clarissa, ENUVOR client partnership" className="w-[88px] h-[100px] shrink-0 rounded-[10px] object-cover object-center" />
            <div className="flex flex-1 flex-col justify-center gap-3 py-1 pl-2 pr-1">
              <div>
                <p className="text-[15px] leading-tight">Talk to Clarissa</p>
                <p className="label mt-1 text-mute">Client partnership</p>
              </div>
              <Button variant="light" className="h-9! self-start pl-3! text-[13px] [&>span]:size-6!">
                Book a 20-min call
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      </section>
    </>
  )
}
