import { AnimatedText, Button, Reveal, SectionHead } from '@/components/ui'
import { media } from '@/config/media'
import { work } from '@/data/site'

export default function Work() {
  return (
    <section id="work" className="container-x py-24 md:py-32">
      <SectionHead
        align="center"
        tag="Selected work"
        title="Shipped. Measured. Still running."
        desc="A few recent engagements across fintech, commerce and logistics."
        className="mb-14 md:mb-20"
      />

      <div className="flex flex-col gap-3">
        {work.map((w, i) => (
          <div key={w.client} className="md:sticky md:top-28">
          <Reveal y={0}>
            <article className="corner-hit [--shine:260px] grid gap-2 rounded-[22px] border border-line bg-surface p-2 md:h-[620px] md:grid-cols-[46%_1fr]">
              <div className="aspect-[4/3] overflow-hidden rounded-[16px] md:aspect-auto">
                <img src={media.work[i]} alt={w.client} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col p-4 md:p-8">
                <div className="label flex items-center gap-2 border-b border-line pb-4 text-mute">
                  {w.year} <span className="text-dim">•</span> {w.sector}
                </div>
                <p className="font-display mt-6 text-[22px] font-[600] tracking-[-0.02em]! text-fg-2">{w.client}</p>
                <AnimatedText as="h3" className="font-display mt-8 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] font-[480] text-balance md:mt-12">
                  {w.title}
                </AnimatedText>
                <AnimatedText as="p" className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-mute">{w.desc}</AnimatedText>
                <div className="mt-6">
                  <Button href="#">View case study</Button>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 md:mt-auto">
                  {w.stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-[30px] leading-none font-[500]">{s.value}</p>
                      <p className="label mt-2 text-mute">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
          </div>
        ))}
      </div>

      <Reveal className="mt-10 flex justify-center">
        <Button href="/work">See all work</Button>
      </Reveal>
    </section>
  )
}
