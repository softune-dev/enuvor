import { Building2, Layers, Package, ShieldCheck, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Check, Reveal, SectionHead, cx } from '@/components/ui'
import { pricing } from '@/data/site'

const icons: Record<string, LucideIcon> = { Starter: Package, Growth: Layers, Enterprise: Building2 }
const EASE = [0.16, 1, 0.3, 1] as const

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const price = (monthly: number) => Math.round(monthly * (yearly ? 1 - pricing.yearlyDiscount : 1))

  return (
    <section id="pricing" className="container-x pt-10 pb-24 md:pt-12 md:pb-32">
      <SectionHead align="center" tag="Pricing" title="Flexible plans for every stage" className="mb-10" />

      <Reveal className="mb-14 flex justify-center">
        <div role="tablist" aria-label="Billing period" className="relative inline-flex rounded-[10px] border border-line-2 bg-surface p-1">
          {(['Monthly', 'Yearly'] as const).map((p) => {
            const active = (p === 'Yearly') === yearly
            return (
              <button
                key={p}
                role="tab"
                aria-selected={active}
                onClick={() => setYearly(p === 'Yearly')}
                className={cx('relative flex h-9 items-center gap-2 rounded-[7px] px-5 text-[13.5px] transition-colors', active ? 'text-ink' : 'text-mute hover:text-fg')}
              >
                {active && <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-[7px] bg-fg" transition={{ type: 'spring', bounce: 0.1, duration: 0.45 }} />}
                <span className="relative">{p}</span>
                {p === 'Yearly' && (
                  <span className={cx('label relative rounded-[4px] px-1.5 py-0.5 text-[10px]!', active ? 'bg-ink/10 text-ink' : 'bg-white/[0.06] text-fg-2')}>
                    -{pricing.yearlyDiscount * 100}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {pricing.plans.map((plan, i) => {
          const Icon = icons[plan.name] ?? Package
          return (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className={cx(
                  'corner-hit flex h-full flex-col rounded-[14px] border p-6',
                  plan.popular ? 'border-line-2 bg-surface' : 'border-transparent lg:border-line',
                )}
              >
                <span className="grid size-9 place-items-center rounded-[8px] border border-line-2 bg-surface-2 text-fg-2">
                  <Icon className="size-[17px]" strokeWidth={1.6} />
                </span>

                <div className="mt-5 flex items-center gap-2.5">
                  <h3 className="font-display text-[22px] leading-none font-[500]">{plan.name}</h3>
                  {plan.popular && <span className="label rounded-[4px] bg-white/[0.08] px-1.5 py-1 text-[10px]! text-fg-2">Popular</span>}
                </div>
                <p className="mt-2 text-[13.5px] text-mute">{plan.desc}</p>

                <p className="mt-7 flex items-baseline gap-1.5">
                  <motion.span
                    key={String(yearly)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="font-display text-[44px] leading-none font-[480] tabular-nums"
                  >
                    ${price(plan.monthly).toLocaleString('en-US')}
                  </motion.span>
                  <span className="text-[14px] text-mute">/mo</span>
                </p>

                <a
                  href="/contact"
                  className={cx(
                    'mt-7 grid h-11 place-items-center rounded-[9px] text-[14px] font-medium transition-colors',
                    plan.popular ? 'bg-fg text-ink hover:bg-white' : 'border border-line-2 bg-surface-2 text-fg hover:bg-surface-3',
                  )}
                >
                  Choose {plan.name}
                </a>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-mute">
                  <ShieldCheck className="size-3.5" strokeWidth={1.6} /> 30-day money-back guarantee
                </p>

                <ul className="mt-7 flex flex-col gap-3.5 border-t border-line pt-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14px] text-fg-2">
                      <Check ok />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
