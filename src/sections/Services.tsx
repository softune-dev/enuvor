import { AnimatedText, Button, Reveal, SectionHead } from '@/components/ui'
import { media } from '@/config/media'
import { services } from '@/data/site'

export default function Services() {
  return (
    <section id="services" className="container-x py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            tag="Services"
            title="One studio for the whole build."
            desc="Engineering, AI, commerce and creative under one roof, so the product, the launch and the growth plan come from the same team."
          />
          <Reveal delay={0.15} className="mt-8">
            <Button href="#contact">Discuss your project</Button>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4">
          {services.map((s, i) => (
            <div key={s.title} className="lg:sticky" style={{ top: `${104 + i * 18}px` }}>
              <Reveal>
                <article className="corner-hit relative grid gap-2 rounded-[22px] border border-line bg-surface p-2 md:grid-cols-[1fr_40%]">
                  <div className="flex flex-col gap-8 p-4 md:p-6">
                    <div>
                      <span className="label text-amber">/ 0{i + 1}</span>
                      <AnimatedText as="h3" className="font-display mt-4 text-[28px] leading-[1.05] font-[500] md:text-[32px]">{s.title}</AnimatedText>
                      <AnimatedText as="p" className="mt-2 text-[15px] text-mute">{s.sub}</AnimatedText>
                    </div>
                    <ul className="flex flex-col">
                      {s.items.map((it) => (
                        <li key={it} className="label border-t border-line py-3 text-fg-2 last:pb-0">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pointer-events-none absolute inset-y-4 right-4 hidden w-[35%] overflow-hidden md:flex md:items-center md:justify-center">
                    <img src={media.serviceComponents[i]} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  </div>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
