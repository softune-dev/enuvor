import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button, Reveal, SectionHead, cx } from '@/components/ui'
import { media } from '@/config/media'
import { faqs } from '@/data/site'

type FaqItem = { q: string; a: string }

export default function Faq({
  items = faqs,
  title = 'Questions,',
  titleMuted = 'answered.',
}: {
  items?: FaqItem[]
  title?: string
  titleMuted?: string
}) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="container-x py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
          <SectionHead tag="FAQ" title={title} titleMuted={titleMuted} />
          <Reveal delay={0.1}>
            <div className="corner-hit [--shine:56px] inline-flex self-start items-stretch gap-0 rounded-[16px] border border-line-2 bg-ink/70 p-2 backdrop-blur-md">
              <img src={media.clarissa} alt="Clarissa, ENUVOR Partnerships" className="w-[88px] h-[100px] shrink-0 rounded-[10px] object-cover object-center" />
              <div className="flex flex-1 flex-col justify-center gap-3 py-1 pl-2 pr-1">
                <div>
                  <p className="text-[15px] leading-tight">Talk to Clarissa</p>
                  <p className="label mt-1 text-mute">Partnerships</p>
                </div>
                <Button variant="light" className="h-9! self-start pl-3! text-[13px] [&>span]:size-6!">
                  Book a 20-min call
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className={cx('corner-hit [--shine:46px] rounded-[16px] border bg-surface transition-colors duration-300', isOpen ? 'border-line-2' : 'border-line')}>
                  <button
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left md:px-6"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-[16px] leading-snug">{f.q}</span>
                    <span className="relative grid size-7 shrink-0 place-items-center rounded-[7px] bg-white/[0.05]">
                      <span className="absolute h-px w-3 bg-fg" />
                      <span className={cx('absolute h-3 w-px bg-fg transition-transform duration-500 ease-out-expo', isOpen && 'rotate-90')} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[60ch] px-5 pb-6 text-[15px] leading-relaxed text-mute md:px-6">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
