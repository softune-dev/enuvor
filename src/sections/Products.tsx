import { Check } from 'lucide-react'
import { Button, Reveal, SectionHead } from '@/components/ui'
import { media } from '@/config/media'
import { products } from '@/data/site'

/** One product for now: the image beside its name, one line about it, and two actions. */
export default function Products() {
  const p = products[0]
  return (
    <section id="products" className="container-x py-24 md:py-32">
      <SectionHead
        tag="Product"
        title="The SaaS we build, own and operate."
        desc="Our own product keeps us honest. What we prove on it is what we bring to client work."
        className="mb-12 md:mb-16"
      />

      <Reveal>
        <div className="corner-hit grid gap-2 rounded-[22px] border border-line bg-surface p-2 lg:grid-cols-[1.15fr_1fr]">
          <a href={p.href} className="block aspect-[16/10] overflow-hidden rounded-[16px] lg:aspect-auto lg:min-h-[360px]">
            <img src={media.products[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
          </a>
          <div className="flex flex-col justify-center gap-6 p-6 md:p-10">
            <span className="label flex items-center gap-2 text-fg-2">
              <span className="size-1.5 rounded-full bg-amber" />
              {p.status}
            </span>
            <div>
              <h3 className="font-display text-[clamp(2rem,3.6vw,2.8rem)] leading-[1.02] font-[500]">{p.name}</h3>
              <p className="mt-4 max-w-[40ch] text-[16px] leading-relaxed text-mute">{p.desc}</p>
            </div>
            <ul className="flex flex-col gap-2.5">
              {['Storefront, products and stock', 'Orders, payments and delivery', 'Sales reports in one place'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[14.5px] text-fg-2">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-amber/15 text-amber">
                    <Check className="size-3" strokeWidth={2.4} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button variant="light" href={p.href}>Learn more</Button>
              {p.url && <Button href={p.url}>Visit site</Button>}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
