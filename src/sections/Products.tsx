import { ArrowRight } from 'lucide-react'
import { AnimatedText, Reveal, SectionHead, cx } from '@/components/ui'
import { media } from '@/config/media'
import { products } from '@/data/site'

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cx(
        'size-1.5 rounded-full',
        status === 'Live' ? 'bg-amber' : status.startsWith('In') ? 'bg-volt-2' : 'bg-dim',
      )}
    />
  )
}

export default function Products() {
  const [lead, ...rest] = products
  return (
    <section id="products" className="container-x py-24 md:py-32">
      <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <SectionHead
          tag="Products"
          title="SaaS we build, own and operate."
          desc="Our own products keep us honest. The patterns we prove on them are the ones we bring to client work."
        />
        <Reveal delay={0.1}>
          <p className="label max-w-[30ch] text-mute md:text-right">
            {products.length} products · more launching under ENUVOR
          </p>
        </Reveal>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <a
            href={lead.href}
            className="corner-hit group flex h-full flex-col rounded-[22px] border border-line bg-surface p-2 transition-colors duration-500 hover:border-line-2"
          >
            <div className="aspect-[16/10] overflow-hidden rounded-[16px]">
              <img src={media.products[0]} alt={lead.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 p-5 md:p-7">
              <div className="flex items-center justify-between">
                <span className="label flex items-center gap-2 text-fg-2">
                  <StatusDot status={lead.status} /> {lead.status} · {lead.category}
                </span>
                <span className="label text-dim">01</span>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
                <div>
                  <AnimatedText as="h3" className="font-display text-[clamp(2rem,3.6vw,2.8rem)] leading-none font-[500]">{lead.name}</AnimatedText>
                  <AnimatedText as="p" className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-mute">{lead.desc}</AnimatedText>
                </div>
                <span className="flex shrink-0 items-center gap-3 self-start rounded-full md:self-auto border border-line-2 bg-surface-2 py-1.5 pr-1.5 pl-5 text-[14px] text-fg-2 transition-colors duration-300 group-hover:border-amber/50 group-hover:text-fg">
                  Visit site
                  <span className="grid size-8 place-items-center rounded-full bg-fg text-ink transition-transform duration-300 group-hover:bg-amber">
                    <ArrowRight className="size-4" strokeWidth={2.25} />
                  </span>
                </span>
              </div>
            </div>
          </a>
        </Reveal>

        <div className="grid gap-3 lg:col-span-5">
          {rest.map((p, i) => (
            <Reveal key={p.name} delay={0.08 * (i + 1)}>
              <a
                href={p.href}
                className="corner-hit group grid h-full grid-cols-[42%_1fr] gap-2 rounded-[22px] border border-line bg-surface p-2 transition-colors duration-500 hover:border-line-2"
              >
                <div className="overflow-hidden rounded-[16px]">
                  <img src={media.products[i + 1]} alt={p.name} loading="lazy" className="h-full min-h-[190px] w-full object-cover" />
                </div>
                <div className="flex flex-col justify-between gap-4 p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <span className="label flex items-center gap-2 text-fg-2">
                      <StatusDot status={p.status} /> {p.status}
                    </span>
                    <span className="label text-dim">0{i + 2}</span>
                  </div>
                  <div>
                    <p className="label mb-2 text-mute">{p.category}</p>
                    <AnimatedText as="h3" className="font-display text-[24px] leading-none font-[500]">{p.name}</AnimatedText>
                    <AnimatedText as="p" className="mt-2 text-[14px] leading-relaxed text-mute">{p.desc}</AnimatedText>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
