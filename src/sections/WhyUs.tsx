import { Check, Reveal, SectionHead, cx } from '@/components/ui'
import { media } from '@/config/media'
import { comparison } from '@/data/site'

export default function WhyUs() {
  const cols = 'grid grid-cols-[1fr_1.25fr_1fr_1fr]'
  return (
    <section className="container-x pt-10 pb-24 md:pt-12 md:pb-32">
      <SectionHead
        align="center"
        tag="Why ENUVOR"
        title="Built like a product company."
        desc="Because we are one. Here is how that changes the work."
        className="mb-14 md:mb-20"
      />
      <Reveal>
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0" data-lenis-prevent-touch>
          <div className="corner-hit min-w-[720px] rounded-[22px] border border-line">
            {/* highlighted column */}
            <div className="pointer-events-none absolute inset-y-0 left-[calc(100%/4.25)] w-[calc(100%*1.25/4.25)] border-x border-line-2 bg-surface-2" />
            <div className={cx(cols, 'relative border-b border-line')}>
              <div className="p-5" />
              <div className="flex items-center gap-2.5 p-5">
                <img src={media.mark} alt="" className="size-6 object-contain" />
                <span className="font-display text-[15px] font-[620] tracking-[0.2em]! [font-stretch:118%]!">ENUVOR</span>
              </div>
              {comparison.columns.slice(1).map((c) => (
                <div key={c} className="p-5 text-[15px] text-mute">
                  {c}
                </div>
              ))}
            </div>
            {comparison.rows.map((r, ri) => (
              <div key={r.label} className={cx(cols, 'relative', ri < comparison.rows.length - 1 && 'border-b border-line')}>
                <div className="label flex items-center p-5 text-mute">{r.label}</div>
                {r.values.map((v, vi) => (
                  <div key={v} className={cx('flex items-center gap-2.5 p-5 text-[14.5px]', vi === 0 ? 'text-fg' : 'text-mute')}>
                    <Check ok={r.ok[vi]} />
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
