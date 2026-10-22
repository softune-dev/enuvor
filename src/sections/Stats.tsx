import CountUp from '@/components/bits/CountUp'
import { Reveal } from '@/components/ui'
import { stats } from '@/data/site'

export default function Stats() {
  return (
    <section className="container-x pt-6 pb-16 md:pt-8 md:pb-24">
      <div className="corner-hit grid grid-cols-2 rounded-[22px] border border-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.06}
            className="flex flex-col justify-between gap-12 border-line p-6 md:p-8 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 [&:not(:last-child)]:border-r max-lg:[&:nth-child(2)]:border-r-0"
          >
            <div>
              <p className="font-display flex items-baseline text-[clamp(2.6rem,5vw,4rem)] leading-none font-[460] tabular-nums">
                <CountUp to={s.to} duration={2} mode="roll" />
                <span className="text-amber">{s.suffix}</span>
              </p>
              <p className="label mt-3 text-mute">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
