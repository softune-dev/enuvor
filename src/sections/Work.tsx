import { ArrowRight } from 'lucide-react'
import { AnimatedText, Button, Reveal, SectionHead } from '@/components/ui'
import { featuredSlugs, projectBySlug, projectImage } from '@/data/projects'

const featured = featuredSlugs.map((s) => projectBySlug(s)).filter((p) => !!p)

export default function Work() {
  return (
    <section id="work" className="container-x py-24 md:py-32">
      <SectionHead
        align="center"
        tag="Selected work"
        title="Shipped. Live. Still running."
        desc="A few of the products and platforms we have built, each one live today."
        className="mb-14 md:mb-20"
      />

      <div className="flex flex-col gap-3">
        {featured.map((w) => (
          <div key={w.slug} className="md:sticky md:top-28">
            <Reveal y={0}>
              <article className="corner-hit [--shine:260px] grid gap-2 rounded-[22px] border border-line bg-surface p-2 md:grid-cols-[minmax(0,560px)_1fr]">
                <a href={`/work/${w.slug}`} className="block aspect-square overflow-hidden rounded-[16px]">
                  <img src={projectImage(w.slug)} alt={w.name} loading="lazy" className="h-full w-full object-cover" />
                </a>
                <div className="flex flex-col p-4 md:p-8">
                  <div className="label flex items-center gap-2 border-b border-line pb-4 text-mute">
                    {w.year} <span className="text-dim">•</span> {w.sector}
                  </div>
                  <p className="font-display mt-6 text-[22px] font-[600] tracking-[-0.02em]! text-fg-2">{w.name}</p>
                  <AnimatedText as="h3" className="font-display mt-6 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] font-[480] text-balance md:mt-10">
                    {w.title}
                  </AnimatedText>
                  <AnimatedText as="p" className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-mute">{w.summary}</AnimatedText>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="light" href={`/work/${w.slug}`}>
                      View project
                    </Button>
                    {w.url && <Button href={w.url}>Visit site</Button>}
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 md:mt-auto">
                    {w.facts.slice(0, 2).map((s) => (
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
        <a
          href="/work"
          className="group flex items-center gap-3 rounded-full border border-line-2 bg-surface-2 py-1.5 pr-1.5 pl-5 text-[14px] text-fg-2 transition-colors duration-300 hover:border-amber/50 hover:text-fg"
        >
          See all work
          <span className="grid size-8 place-items-center rounded-full bg-fg text-ink transition-colors duration-300 group-hover:bg-amber">
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </span>
        </a>
      </Reveal>
    </section>
  )
}
