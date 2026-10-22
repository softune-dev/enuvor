import { useEffect, useState } from 'react'
import { AnimatedText, Chevron, Tag, cx } from '@/components/ui'
import { media } from '@/config/media'
import { testimonials } from '@/data/site'

const total = testimonials.length
const testimonialLogos = [
  '/media/clients/atlas-pay.svg',
  '/media/clients/lumen-co.svg',
  '/media/clients/kestrel.svg',
]

function ArrowButton({ dir, onClick, label, disabled }: { dir: 'prev' | 'next'; onClick: () => void; label: string; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="grid size-11 place-items-center rounded-[6px] border border-white/15 bg-[#1a1a1a] text-fg transition-colors hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-[#1a1a1a]"
    >
      <Chevron className={cx('size-4', dir === 'prev' && 'rotate-180')} />
    </button>
  )
}

function usePerView() {
  const [perView, setPerView] = useState(1)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setPerView(mq.matches ? 2 : 1)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return perView
}

export default function Testimonials() {
  const perView = usePerView()
  const [index, setIndex] = useState(0)
  const max = total - perView

  const next = () => setIndex((i) => Math.min(i + 1, max))
  const prev = () => setIndex((i) => Math.max(i - 1, 0))

  return (
    <section className="container-x pt-16 pb-6 md:pt-20 md:pb-8">
      <div className="mb-14 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-5">
          <Tag>Testimonials</Tag>
          <AnimatedText as="h2" delay={0.1} className="font-display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] font-[460] lg:whitespace-nowrap">
            Hear from our satisfied clients
          </AnimatedText>
        </div>
        <div className="flex gap-2">
          <ArrowButton dir="prev" onClick={prev} label="Previous testimonial" disabled={index === 0} />
          <ArrowButton dir="next" onClick={next} label="Next testimonial" disabled={index >= max} />
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(calc(${index} * (-100% - 16px) / ${perView}))` }}
        >
          {testimonials.map((t, i) => {
            const [, company = ''] = t.role.split(', ')
            return (
              <figure
                key={i}
                className="corner-hit grid shrink-0 gap-2 rounded-[10px] border border-line bg-surface p-2 sm:grid-cols-[1fr_46%]"
                style={{ width: `calc((100% - ${(perView - 1) * 16}px) / ${perView})` }}
              >
                <div className="flex flex-col justify-between gap-8 p-5 md:p-7">
                  <img
                    src={testimonialLogos[i]}
                    alt={company}
                    className="h-9 w-auto max-w-[180px] object-contain object-left"
                  />
                  <blockquote className="testimonial-quote py-1 text-[19px] leading-[1.22] font-normal tracking-[-0.015em] text-white md:text-[22px]">
                    <AnimatedText as="span" speed={3} className="block">{t.quote}</AnimatedText>
                  </blockquote>
                  <figcaption>
                    <p className="text-[15px]">{t.name}</p>
                    <p className="label mt-1.5 text-mute">{t.role}</p>
                  </figcaption>
                </div>
                <div className="min-h-[340px] overflow-hidden rounded-[6px] lg:min-h-[380px]">
                  <img src={media.avatars[i]} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
