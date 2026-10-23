import { X } from 'lucide-react'
import { Check, Reveal, SectionHead, cx } from '@/components/ui'
import { media } from '@/config/media'
import { comparison } from '@/data/site'

/** Warning mark for a competitor's gap: a red-tinted cross in a ring, so it reads as a miss at a glance. */
const Miss = () => (
  <span className="grid size-5 shrink-0 place-items-center rounded-full border border-[#ff5d5d]/40 bg-[#ff5d5d]/10">
    <X className="size-3 text-[#ff5d5d]" strokeWidth={2.2} />
  </span>
)

const { rows } = comparison
const [brand, ...others] = comparison.columns

const Brand = () => (
  <span className="flex items-center gap-2.5">
    <img src={media.mark} alt="" className="size-6 object-contain" />
    <span className="font-display text-[15px] font-[620] tracking-[0.2em]! [font-stretch:118%]!">{brand}</span>
  </span>
)

export default function WhyUs() {
  return (
    <section className="container-x pt-10 pb-24 md:pt-12 md:pb-32">
      <SectionHead
        align="center"
        tag="Why ENUVOR"
        title="Built like a product company."
        desc="Because we are one. Here is how that changes the work."
        className="mb-14 md:mb-20"
      />

      {/* Desktop: one grid, the ENUVOR column lifted as a raised panel behind its cells */}
      <Reveal className="hidden md:block">
        <div className="relative grid grid-cols-[170px_1.3fr_1fr_1fr] py-3">
          <div className="corner-hit pointer-events-none col-start-2 rounded-[16px] border border-line-2 bg-surface-2" style={{ gridRow: `1 / span ${rows.length + 1}` }} />

          <span className="col-start-2 row-start-1 flex items-center px-7 py-6">
            <Brand />
          </span>
          {others.map((c, i) => (
            <span key={c} className="flex items-center px-7 py-6 text-[15px] text-mute" style={{ gridColumn: i + 3, gridRow: 1 }}>
              {c}
            </span>
          ))}

          {rows.map((r, ri) => {
            const row = ri + 2
            return (
              <div key={r.label} className="contents">
                <span className={cx('label flex items-center border-t border-line py-5 pr-4 text-mute')} style={{ gridColumn: 1, gridRow: row }}>
                  {r.label}
                </span>
                {r.values.map((v, vi) => (
                  <span
                    key={v}
                    className={cx('relative flex items-center gap-3 border-t px-7 py-5 text-[14.5px]', vi === 0 ? 'border-line-2 text-fg' : 'border-line text-mute')}
                    style={{ gridColumn: vi + 2, gridRow: row }}
                  >
                    {vi === 0 ? (
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-amber/15">
                        <Check ok />
                      </span>
                    ) : (
                      r.ok[vi] ? <Check ok /> : <Miss />
                    )}
                    {v}
                  </span>
                ))}
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Mobile: one card per criterion, ENUVOR first and highlighted, no sideways scrolling */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((r, ri) => (
          <Reveal key={r.label} delay={ri * 0.05}>
            <div className="rounded-[16px] border border-line bg-surface p-4">
              <p className="label mb-3 text-mute">{r.label}</p>
              <div className="flex flex-col gap-1.5">
                {r.values.map((v, vi) => (
                  <div
                    key={v}
                    className={cx(
                      'flex items-center gap-3 rounded-[10px] px-3 py-3',
                      vi === 0 ? 'border border-line-2 bg-surface-2' : 'px-3',
                    )}
                  >
                    {vi === 0 ? (
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-amber/15">
                        <Check ok />
                      </span>
                    ) : (
                      r.ok[vi] ? <Check ok /> : <Miss />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={cx('block text-[14px] leading-snug', vi === 0 ? 'text-fg' : 'text-mute')}>{v}</span>
                      <span className={cx('label mt-0.5 block text-[9.5px]!', vi === 0 ? 'text-amber' : 'text-dim')}>{comparison.columns[vi]}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
