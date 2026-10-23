import { AnimatePresence, motion, useInView } from 'motion/react'
import { Blocks, Frame, MousePointer2, Square, Type, Users, TrendingUp, DollarSign, Activity, type LucideIcon } from 'lucide-react'
import { createRef, useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from 'react'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Chevron, SectionHead, cx } from '@/components/ui'
import { process } from '@/data/site'
import LaunchGrowthStage from './LaunchGrowthStage'

// One panel, three phases. Pick a phase on the left and the stage on the right shows what it
// produces. It steps through them on its own on large screens and holds still on phones.

const phases = [
  { time: 'Week 1', items: ['Discovery workshop', 'Audit of what exists', 'Written plan with price'], icons: ['item-workshop', 'item-audit', 'item-plan'] },
  { time: 'Weeks 2 to 8', items: ['Weekly releases', 'Live preview links', 'Tests on every change'], icons: ['item-releases', 'item-preview', 'item-tests'] },
  { time: 'Ongoing', items: ['Go-live and monitoring', 'Fixes and updates', 'A roadmap that compounds'], icons: ['item-monitor', 'item-fixes', 'item-roadmap'] },
]

const STEP_MS = 6500
const RESUME_MS = 14000

function useAutoplayAllowed() {
  return useSyncExternalStore(
    (cb) => {
      const mqs = [window.matchMedia('(min-width: 768px)'), window.matchMedia('(prefers-reduced-motion: reduce)')]
      mqs.forEach((m) => m.addEventListener('change', cb))
      return () => mqs.forEach((m) => m.removeEventListener('change', cb))
    },
    () => window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

const Photo = ({ n, size }: { n: number; size: number }) => (
  <img src={`/media/people/p${n}.webp`} alt="" draggable={false} className="rounded-full object-cover" style={{ width: size, height: size }} />
)

/** Beams drawn as one SVG: each leaves its node horizontally, bends in the middle, and lands horizontally. */
function BeamLayer({ box, pairs }: { box: RefObject<HTMLDivElement | null>; pairs: { from: RefObject<HTMLElement | null>; to: RefObject<HTMLElement | null>; side: 'left' | 'right' | 'center'; delay: number }[] }) {
  const [paths, setPaths] = useState<{ d: string; delay: number }[]>([])
  useEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      const base = el.getBoundingClientRect()
      const pt = (n: HTMLElement | null, edge: 'left' | 'right' | 'center') => {
        const r = n?.getBoundingClientRect()
        if (!r) return null
        const x = edge === 'left' ? r.left : edge === 'right' ? r.right : r.left + r.width / 2
        return { x: x - base.left, y: r.top + r.height / 2 - base.top }
      }
      const next = pairs.map((p) => {
        const a = pt(p.from.current, p.side === 'left' ? 'right' : 'center')
        const b = pt(p.to.current, p.side === 'right' ? 'left' : 'center')
        if (!a || !b) return null
        const dx = (b.x - a.x) * 0.5
        return { d: `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`, delay: p.delay }
      })
      setPaths(next.filter((x): x is { d: string; delay: number } => x !== null))
    }
    measure()
    // the stage fades and scales in, so re-measure once it has settled
    const timers = [120, 420, 900].map((ms) => window.setTimeout(measure, ms))
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      timers.forEach(window.clearTimeout)
      ro.disconnect()
    }
    // pairs are fixed for this stage, so measure once per box
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box])

  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} />
          <path
            d={p.d}
            fill="none"
            stroke="#f59a23"
            strokeWidth={1.8}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.16 1"
            strokeDashoffset={0.16}
            style={{ animation: `beam-run 2.8s linear ${p.delay}s infinite` }}
          />
        </g>
      ))}
    </svg>
  )
}

/** Stage 1: four people feed one written plan, which fans out to four end nodes. Magic UI beams. */
function PlanStage() {
  const box = useRef<HTMLDivElement>(null)
  const people = [
    { name: 'Priya', role: 'Design', n: 1 },
    { name: 'Rafi', role: 'Engineer', n: 2 },
    { name: 'Maya', role: 'Product', n: 3 },
    { name: 'Daniel', role: 'Growth', n: 4 },
  ]
  const ends = ['Design', 'Build', 'Launch', 'Support']
  // Stable ref objects, so the beams can measure their nodes after the first paint
  const [refs] = useState(() => people.map(() => createRef<HTMLDivElement>()))
  const [endRefs] = useState(() => ends.map(() => createRef<HTMLDivElement>()))
  // Anchor points on the plan card: one on each side per row, so every beam leaves and lands on the same grid
  const [inRefs] = useState(() => people.map(() => createRef<HTMLSpanElement>()))
  const [outRefs] = useState(() => ends.map(() => createRef<HTMLSpanElement>()))
  const doc = useRef<HTMLDivElement>(null)

  return (
    <div ref={box} className="relative flex h-full items-center justify-between gap-3 px-5 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-3 self-stretch py-2">
        {people.map((p, i) => (
          <div key={p.name} className="flex flex-col items-center gap-1">
            <div ref={refs[i]} className="relative z-10 rounded-full border border-white/20 bg-[#141519] p-0.5">
              <Photo n={p.n} size={42} />
            </div>
            <span className="label text-[8.5px]! text-mute">{p.role}</span>
          </div>
        ))}
      </div>

      <div ref={doc} className="relative z-10 w-[min(200px,32%)] rounded-[16px] border border-white/15 bg-[#191a20] p-4">
        {people.map((_, i) => (
          <span key={`in-${i}`} ref={inRefs[i]} aria-hidden className="absolute left-0 size-px" style={{ top: `${(i + 0.5) * 25}%` }} />
        ))}
        {ends.map((_, i) => (
          <span key={`out-${i}`} ref={outRefs[i]} aria-hidden className="absolute right-0 size-px" style={{ top: `${(i + 0.5) * 25}%` }} />
        ))}
        <div className="flex items-center justify-between">
          <span className="font-display text-[15px] font-[500] text-fg">Project plan</span>
          <span className="label rounded-full border border-white/15 px-2 py-0.5 text-[8.5px]! text-fg-2">Draft 2</span>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {['92%', '74%', '84%', '58%'].map((w, i) => (
            <span key={i} className="block h-1.5 rounded-full bg-white/12" style={{ width: w }} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cx('h-1.5 rounded-full', i < 2 ? 'bg-amber' : 'bg-white/12')} />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 self-stretch py-2">
        {ends.map((e, i) => (
          <div key={e} ref={endRefs[i]} className="relative z-10">
            <span className="inline-flex h-11 items-center gap-3 rounded-[10px] border border-line-2 bg-surface-2 pl-4 pr-1.5 text-[14px] font-medium tracking-[-0.01em] text-fg">
              {e}
              <span className="grid size-8 place-items-center overflow-hidden rounded-[7px] bg-white/[0.06]">
                <Chevron className="size-3.5" />
              </span>
            </span>
          </div>
        ))}
      </div>

      <BeamLayer
        box={box}
        pairs={[
          ...people.map((_, i) => ({ from: refs[i], to: inRefs[i], side: 'left' as const, delay: i * 0.4 })),
          ...ends.map((_, i) => ({ from: outRefs[i], to: endRefs[i], side: 'right' as const, delay: 1.6 + i * 0.3 })),
        ]}
      />
    </div>
  )
}

const sideWidths = [62, 44, 70, 52, 58, 40, 66, 48, 56, 72, 46, 60]
const layerAt: Record<number, string> = { 3: 'stats', 4: 'stats2', 5: 'chart', 6: 'table' }

/** Left panel: one label bar and rows of one dot plus one box. The row count is measured so the list always fills the height. */
function SidePanel({ sel }: { sel: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(9)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setN(Math.max(6, Math.floor((el.clientHeight - 24 - 14 + 4) / 32)))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="hidden min-h-0 flex-col gap-2 overflow-hidden border-r border-white/[0.08] bg-[#0e0f13] p-3 md:flex">
      <span className="h-1.5 w-10 shrink-0 rounded-xs bg-white/20" />
      <div className="flex min-h-0 flex-1 flex-col justify-between">
        {Array.from({ length: n }, (_, i) => {
          const active = i === 0 || layerAt[i] === sel
          return (
            <div key={i} className={cx('flex h-7 shrink-0 items-center gap-2 rounded-xs px-2 transition-colors', active && 'bg-white/[0.07]')}>
              <span className={cx('size-1.5 shrink-0 rounded-full', active ? 'bg-amber' : 'bg-white/25')} />
              <span className={cx('h-2 rounded-xs', active ? 'bg-white/50' : 'bg-white/20')} style={{ width: `${sideWidths[i % sideWidths.length]}%` }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Stage 2: two designers collaborate in real-time on a modern desktop dashboard interface.
 *  The canvas shows a realistic web dashboard with sidebar, stats, chart and live table, while cursors work on components. */
const buildSteps = [
  { who: 'p', x: 44, y: 22, op: 'sel', id: 'stats' },
  { who: 'r', x: 74, y: 22, op: 'sel', id: 'stats2' },
  { who: 'p', x: 55, y: 50, op: 'sel', id: 'chart' },
  { who: 'r', x: 55, y: 80, op: 'sel', id: 'table' },
  { who: 'p', x: 76, y: 80, op: 'sel', id: 'table' },
  { who: 'r', x: 44, y: 22, op: 'sel', id: 'stats' },
  { who: 'p', x: 55, y: 50, op: 'sel', id: 'chart' },
  { who: 'r', x: 78, y: 50, op: 'sel', id: 'chart' },
] as const

const props: Record<string, { x: number; y: number; w: number; h: number; radius: number; opacity: number; fill: string }> = {
  stats: { x: 180, y: 58, w: 220, h: 84, radius: 10, opacity: 100, fill: '#16171d' },
  stats2: { x: 412, y: 58, w: 220, h: 84, radius: 10, opacity: 100, fill: '#16171d' },
  chart: { x: 180, y: 154, w: 452, h: 140, radius: 10, opacity: 100, fill: '#16171d' },
  table: { x: 180, y: 306, w: 452, h: 120, radius: 10, opacity: 100, fill: '#16171d' },
}

function replayBuild(n: number) {
  let sel: string = 'stats'
  const pos: Record<string, { x: number; y: number }> = { p: { x: 44, y: 32 }, r: { x: 74, y: 32 } }
  let last: (typeof buildSteps)[number] | null = null
  for (let k = 0; k <= n; k++) {
    const s = buildSteps[k]
    pos[s.who] = { x: s.x, y: s.y }
    last = s
    sel = s.id
  }
  return { sel, pos, last }
}

const designers = [
  { key: 'p', name: 'Priya', bg: '#f59a23', photo: 1 },
  { key: 'r', name: 'Rafi', bg: '#e7e2d8', photo: 2 },
] as const

function BuildStage() {
  const [idx, setIdx] = useState(0)
  const [jit, setJit] = useState<Record<string, { dx: number; dy: number }>>({ p: { dx: 0, dy: 0 }, r: { dx: 0, dy: 0 } })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      setIdx((v) => (v + 1) % buildSteps.length)
      t = setTimeout(tick, 900 + Math.random() * 800)
    }
    t = setTimeout(tick, 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setJit({
        p: { dx: (Math.random() - 0.5) * 1.5, dy: (Math.random() - 0.5) * 1.5 },
        r: { dx: (Math.random() - 0.5) * 1.5, dy: (Math.random() - 0.5) * 1.5 },
      })
    }, 650)
    return () => window.clearInterval(id)
  }, [])

  const st = replayBuild(idx)
  const tools: { key: string; Icon: LucideIcon }[] = [
    { key: 'select', Icon: MousePointer2 },
    { key: 'frame', Icon: Frame },
    { key: 'rect', Icon: Square },
    { key: 'text', Icon: Type },
    { key: 'component', Icon: Blocks },
  ]
  const selProps = props[st.sel] ?? props.stats

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="grid min-h-0 flex-1 grid-cols-[auto_1fr] md:grid-cols-[96px_1fr_104px]">
        <SidePanel sel={st.sel} />

        {/* Desktop Web Dashboard Canvas */}
        <div className="relative flex min-h-0">
          {/* Tool palette */}
          <div className="flex w-10 shrink-0 flex-col items-center justify-center gap-1 border-r border-white/[0.08] bg-[#101116] p-1">
            {tools.map(({ key, Icon }) => (
              <span key={key} className={cx('grid size-6 place-items-center transition-colors duration-300', key === 'select' ? 'bg-amber text-black' : 'text-mute')}>
                <Icon className="size-3" strokeWidth={1.8} />
              </span>
            ))}
          </div>

          {/* Main Dashboard Artboard */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0d0e12]">
            {/* Dashboard Container: Clean, Minimal, Sharp, High-Precision */}
            <div className="flex h-full flex-col">
              {/* Main Dashboard Canvas Body (No Window Header / No Dots / No Top Title Bar) */}
              <main className="flex flex-1 flex-col gap-2.5 overflow-hidden bg-[#0d0e12] p-4">
                {/* Compact workspace controls fill the top band without introducing another page heading. */}
                <div className="flex h-8 shrink-0 items-center justify-between bg-white/[0.025] px-3">
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-amber" />
                    <span className="h-1.5 w-16 rounded-full bg-white/25" />
                    <span className="h-1.5 w-8 rounded-full bg-white/10" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    {[18, 26, 18].map((w, i) => (
                      <span key={i} className={cx('h-4 bg-white/[0.045]', i === 1 && 'bg-white/[0.09]')} style={{ width: w }} />
                    ))}
                  </span>
                </div>

                {/* Row 1: KPI Cards with Crisp Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Card 1 */}
                  <div className={cx('flex flex-col justify-between rounded-[7px] bg-white/[0.035] p-2.5 transition-all', st.sel === 'stats' && 'ring-1 ring-amber/50 bg-amber/[0.045]')}>
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 w-16 rounded-sm bg-white/20" />
                      <span className="text-[7px] font-semibold text-amber">+22.4%</span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-display text-[15px] font-[650] tracking-tight text-white">$94,200</span>
                      <span className="text-[7px] text-white/40">100k</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className={cx('flex flex-col justify-between rounded-[7px] bg-white/[0.035] p-2.5 transition-all', st.sel === 'stats2' && 'ring-1 ring-amber/50 bg-amber/[0.045]')}>
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 w-20 rounded-sm bg-white/20" />
                      <span className="text-[7px] font-semibold text-amber">+14.2%</span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-display text-[15px] font-[650] tracking-tight text-white">1,428</span>
                      <span className="text-[7px] text-white/40">99.8%</span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Analytics Chart with Sharp Proportions */}
                <div className={cx('flex flex-col justify-between rounded-[7px] bg-white/[0.035] p-2.5 transition-all', st.sel === 'chart' && 'ring-1 ring-amber/50 bg-amber/[0.035]')}>
                  <div className="flex items-center justify-between">
                    <div className="h-1.5 w-20 rounded-sm bg-white/25" />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="size-1 rounded-sm bg-white/60" />
                        <span className="h-1 w-6 rounded-sm bg-white/15" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="size-1 rounded-sm bg-white/30" />
                        <span className="h-1 w-6 rounded-sm bg-white/15" />
                      </div>
                    </div>
                  </div>
                  {/* Clean Chart Grid */}
                  <div className="relative mt-2 flex h-20 items-end gap-2 bg-black/10 p-2">
                    <div className="pointer-events-none absolute inset-x-2 top-1/2 border-b border-dashed border-white/[0.06]" />
                    {[
                      { h1: 35, h2: 45 },
                      { h1: 50, h2: 60 },
                      { h1: 65, h2: 78 },
                      { h1: 45, h2: 65 },
                      { h1: 75, h2: 88 },
                      { h1: 60, h2: 80 },
                      { h1: 85, h2: 100 },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1.5 z-10">
                        <div className="flex h-full w-full items-end justify-center gap-1">
                          <div
                            className="w-2 rounded-t-sm bg-white/20"
                            style={{ height: `${item.h1 * 0.45}px` }}
                          />
                          <div
                            className={cx(
                              'w-2 rounded-t-sm transition-all',
                              i === 6 ? 'bg-amber shadow-[0_0_10px_rgba(245,154,35,0.22)]' : 'bg-white/35',
                            )}
                            style={{ height: `${item.h2 * 0.45}px` }}
                          />
                        </div>
                        <div className="h-1 w-3 rounded-sm bg-white/20" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 3: Table Row with Numbers Only (No Text) */}
                <div className={cx('flex min-h-0 flex-1 flex-col gap-1.5 rounded-[7px] bg-white/[0.035] p-2.5 transition-all', st.sel === 'table' && 'ring-1 ring-amber/50 bg-amber/[0.035]')}>
                  <div className="flex items-center justify-between">
                    <div className="h-1.5 w-16 rounded-sm bg-white/20" />
                    <div className="h-1.5 w-8 rounded-sm bg-white/20" />
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col gap-1">
                    {[
                      { amt: '+$490.00', pct: '+12%' },
                      { amt: '+$2,400.00', pct: '+28%' },
                    ].map((row, k) => (
                      <div key={k} className="flex flex-1 items-center justify-between rounded-sm bg-white/[0.02] px-2 py-1">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-sm bg-white/20" />
                          <div className="h-1.5 w-20 rounded-sm bg-white/25" />
                          <div className="h-1.5 w-12 rounded-sm bg-white/10" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-semibold text-amber">{row.amt}</span>
                          <span className="px-1 text-[6.5px] font-semibold text-fg-2">{row.pct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Release rail gives the lower band a real purpose and mirrors the site's compact status UI. */}
                <div className="flex h-9 shrink-0 items-center justify-between bg-white/[0.025] px-3">
                  <span className="flex items-center gap-2">
                    <span className="flex -space-x-1.5">
                      <span className="size-5 overflow-hidden rounded-full border border-[#0d0e12]"><Photo n={1} size={20} /></span>
                      <span className="size-5 overflow-hidden rounded-full border border-[#0d0e12]"><Photo n={2} size={20} /></span>
                    </span>
                    <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-white/45">Build 41</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map((n) => (
                      <motion.span
                        key={n}
                        className={cx('h-1 w-8 rounded-full', n < 3 ? 'bg-amber/75' : 'bg-white/10')}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.45, delay: n * 0.1 }}
                      />
                    ))}
                    <span className="ml-1 font-mono text-[7px] uppercase tracking-[0.1em] text-amber">Ready</span>
                  </span>
                </div>
              </main>
            </div>

            {/* Live Collaborative Designers */}
            {designers.map((d) => {
              const at = st.pos[d.key]
              const j = jit[d.key]
              const clicking = st.last?.who === d.key
              return (
                <motion.div
                  key={d.key}
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 z-30"
                  animate={{ left: `${at.x + j.dx}%`, top: `${at.y + j.dy}%` }}
                  transition={{ type: 'spring', stiffness: 90, damping: 16 }}
                >
                  {clicking && (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0.3, opacity: 0.7 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute -top-2 -left-2 size-4 rounded-full border"
                      style={{ borderColor: d.bg }}
                    />
                  )}
                  <svg viewBox="0 0 16 16" className="size-3.5" fill={d.bg}>
                    <path d="M1.5 1 14 6.5 8.4 8.4 6.5 14z" stroke="#0d0e12" strokeWidth="0.8" />
                  </svg>
                  <span className="mt-1 ml-2 inline-flex h-6 items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 text-[8.5px] font-[650] text-black shadow-[0_5px_16px_rgba(0,0,0,.35)]" style={{ background: d.bg }}>
                    <span className="size-5 overflow-hidden rounded-full border border-black/15 bg-black/10">
                      <Photo n={d.photo} size={20} />
                    </span>
                    {d.name}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Properties Inspector: Pure Minimal Skeletons & Metrics */}
        <div className="hidden flex-col gap-3 overflow-hidden border-l border-white/[0.08] bg-[#0e0f13] p-3 md:flex">
          <div className="flex items-center justify-between">
            <div className="h-2 w-14 rounded-sm bg-white/30" />
            <div className="h-1.5 w-10 rounded-sm bg-white/15" />
          </div>

          {/* Coordinates / Dimensions Grid with Numbers Only */}
          <div className="grid grid-cols-2 gap-1">
            {[
              ['X', selProps.x],
              ['Y', selProps.y],
              ['W', selProps.w],
              ['H', selProps.h],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between bg-white/[0.035] px-1.5 py-1 text-[8px]">
                <span className="text-white/40">{l}</span>
                <span className="font-mono text-white/90">{v}</span>
              </div>
            ))}
          </div>

          {/* Radius & Opacity Sliders */}
          <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-2">
            <div className="flex items-center justify-between text-[8px]">
              <div className="h-1.5 w-10 rounded-sm bg-white/20" />
              <span className="font-mono text-white/80">{selProps.radius}px</span>
            </div>
            <div className="h-1 rounded-sm bg-white/10">
              <div className="h-full rounded-sm bg-white/50" style={{ width: '40%' }} />
            </div>

            <div className="flex items-center justify-between text-[8px] mt-0.5">
              <div className="h-1.5 w-12 rounded-sm bg-white/20" />
              <span className="font-mono text-white/80">{selProps.opacity}%</span>
            </div>
            <div className="h-1 rounded-sm bg-white/10">
              <div className="h-full rounded-sm bg-white/50" style={{ width: `${selProps.opacity}%` }} />
            </div>
          </div>

          {/* Color Fill Picker */}
          <div className="flex flex-col gap-1 border-t border-white/[0.06] pt-2">
            <div className="h-1.5 w-8 rounded-sm bg-white/20" />
            <div className="flex items-center justify-between bg-white/[0.035] px-1.5 py-1">
              <span className="size-2.5 rounded-sm border border-white/20" style={{ background: selProps.fill }} />
              <span className="font-mono text-[7.5px] text-white/80">{selProps.fill}</span>
            </div>
          </div>

          {/* Switch Options: Skeletons */}
          <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-2">
            {[1, 2, 3].map((k) => (
              <div key={k} className="flex items-center justify-between">
                <div className="h-1.5 w-14 rounded-sm bg-white/20" />
                <span className={cx('flex h-2.5 w-5 items-center rounded-sm p-px', k < 3 ? 'justify-end bg-white/70' : 'justify-start bg-white/15')}>
                  <span className="size-2 rounded-sm bg-ink" />
                </span>
              </div>
            ))}
          </div>

          {/* Align: a row of small tool buttons */}
          <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-2">
            <div className="h-1.5 w-9 rounded-sm bg-white/20" />
            <div className="grid grid-cols-6 gap-1">
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <span
                  key={k}
                  className={cx(
                    'flex h-5 flex-col justify-center gap-[2px] rounded-xs px-[5px]',
                    k % 3 === 0 ? 'items-start' : k % 3 === 1 ? 'items-center' : 'items-end',
                    k === 1 ? 'bg-white/[0.09]' : 'bg-white/[0.035]',
                  )}
                >
                  <span className={cx('h-[2px] w-full rounded-[1px]', k === 1 ? 'bg-amber' : 'bg-white/30')} />
                  <span className={cx('h-[2px] w-1/2 rounded-[1px]', k === 1 ? 'bg-amber' : 'bg-white/30')} />
                </span>
              ))}
            </div>
          </div>

          {/* Effects: toggled rows */}
          <div className="flex flex-col gap-1 border-t border-white/[0.06] pt-2">
            <div className="h-1.5 w-10 rounded-sm bg-white/20" />
            {[
              { w: 'w-12', on: true },
              { w: 'w-9', on: false },
            ].map((r, k) => (
              <div key={k} className="flex h-5 items-center gap-1.5 rounded-sm bg-white/[0.035] px-1.5">
                <span className={cx('size-1.5 shrink-0 rounded-full', r.on ? 'bg-amber' : 'bg-white/25')} />
                <span className={cx('h-1.5 rounded-sm bg-white/25', r.w)} />
                <span className="ml-auto h-1.5 w-4 rounded-sm bg-white/10" />
              </div>
            ))}
          </div>

          {/* Typography Footer */}
          <div className="mt-auto flex flex-col gap-1 border-t border-white/[0.06] pt-2">
            <div className="h-1.5 w-12 rounded-sm bg-white/20" />
            <div className="h-4 bg-white/[0.035]" />
          </div>
        </div>
      </div>
    </div>
  )
}

const visits = [38, 44, 41, 52, 49, 58, 55, 63, 60, 68, 66, 74, 71, 82]

/** Stage 3: a live analytics dashboard with KPIs, a traffic chart and where people land. */
function GrowthStage() {
  const max = Math.max(...visits)
  const statCards = [
    { value: 48.2, dp: 1, unit: 'k', delta: '+12%', prefix: '',  Icon: Users       },
    { value: 3.8,  dp: 1, unit: '%', delta: '+0.6', prefix: '',  Icon: TrendingUp   },
    { value: 86.4, dp: 1, unit: 'k', delta: '+18%', prefix: '$', Icon: DollarSign   },
    { value: 1284, dp: 0, unit: '',  delta: '+9%',  prefix: '',  Icon: Activity     },
  ] as const
  const topPages = [
    { pct: 42, skW: 'w-14' },
    { pct: 26, skW: 'w-10' },
    { pct: 18, skW: 'w-16' },
    { pct: 11, skW: 'w-8'  },
    { pct: 7,  skW: 'w-12' },
    { pct: 4,  skW: 'w-6'  },
  ]
  return (
    <div className="flex h-full flex-col gap-3 px-5 py-5 md:px-7 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="font-display text-[16px] font-[500] text-fg">Overview</span>
          <span className="flex items-center gap-1.5 rounded-full border border-[#4ade80]/30 px-2 py-0.5 text-[9.5px] text-[#4ade80]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#4ade80]" />
            128 live
          </span>
        </span>
        <span className="flex gap-1 rounded-full border border-white/12 p-0.5 text-[9.5px]">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <span key={r} className={cx('rounded-full px-2 py-0.5', r === '30d' ? 'bg-white/10 text-fg' : 'text-mute')}>
              {r}
            </span>
          ))}
        </span>
      </div>

      {/* 4 KPI cards — skeleton labels, numbers visible */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {statCards.map((c, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-[10px] border border-white/10 px-3 py-2.5">
            {/* top row: skeleton label + icon */}
            <div className="flex items-center justify-between">
              <div className="h-1.5 w-12 rounded-sm bg-white/20" />
              <span className="grid size-5 place-items-center rounded-md bg-white/[0.07] text-white/40">
                <c.Icon className="size-3" strokeWidth={1.8} />
              </span>
            </div>
            <p className="font-display flex items-baseline gap-0.5 text-[18px] leading-none font-[500] text-fg">
              {c.prefix && <span className="text-[13px]">{c.prefix}</span>}
              <NumberTicker value={c.value} decimalPlaces={c.dp} />
              {c.unit && <span className="text-[13px]">{c.unit}</span>}
            </p>
            <span className="w-fit rounded-sm bg-emerald-500/15 px-1.5 py-0.5 text-[8.5px] font-semibold text-emerald-400">{c.delta}</span>
          </div>
        ))}
      </div>

      {/* Bar chart + Top pages */}
      <div className="grid min-h-0 flex-1 gap-2.5 md:grid-cols-[1fr_140px]">
        {/* Bar chart */}
        <div className="flex min-h-0 flex-col rounded-[10px] border border-white/10 p-3">
          {/* skeleton header */}
          <div className="flex items-center justify-between">
            <div className="h-1.5 w-20 rounded-sm bg-white/20" />
            <div className="h-1.5 w-14 rounded-sm bg-white/15" />
          </div>
          {/* bars — rendered above dashed lines via z-10 */}
          <div className="relative mt-2 min-h-0 flex-1">
            {/* grid lines layer — behind bars */}
            <div className="absolute inset-0 pointer-events-none">
              {[25, 50, 75].map((p) => (
                <span key={p} className="absolute inset-x-0 border-t border-dashed border-white/[0.07]" style={{ bottom: `${p}%` }} />
              ))}
            </div>
            {/* bars layer — above grid lines */}
            <div className="relative z-10 flex h-full items-end gap-1">
              {visits.map((v, i) => (
                <motion.span
                  key={i}
                  className={cx('flex-1 origin-bottom rounded-t-[3px]', i === visits.length - 1 ? 'bg-amber' : 'bg-white/20')}
                  style={{ height: `${(v / max) * 100}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
          </div>
          {/* day labels as skeleton bars */}
          <div className="mt-1.5 flex justify-between gap-0.5">
            {visits.map((_, i) => (
              <span
                key={i}
                className={cx('flex-1 h-1 rounded-sm', (i === 0 || i === 7 || i === visits.length - 1) ? 'bg-white/25' : 'bg-white/10')}
              />
            ))}
          </div>
        </div>

        {/* Top pages */}
        <div className="hidden flex-col rounded-[10px] border border-white/10 p-3 md:flex">
          {/* skeleton header */}
          <div className="h-1.5 w-14 rounded-sm bg-white/20" />
          <div className="mt-2.5 flex flex-1 flex-col justify-between gap-1.5">
            {topPages.map((pg, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  {/* path as skeleton bar */}
                  <div className={cx('h-1.5 rounded-sm bg-white/20', pg.skW)} />
                  <span className="text-[8.5px] text-mute">{pg.pct}%</span>
                </div>
                <span className="mt-1 block h-1 rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-volt-2" style={{ width: `${pg.pct}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

void GrowthStage

const stages: ReactNode[] = [<PlanStage key="a" />, <BuildStage key="b" />, <LaunchGrowthStage key="c" />]

// Discover uses bg-1 and Launch uses bg-2 behind their stages; Design & build stays on the plain surface.
const backdrops: (string | undefined)[] = ['/media/bg-1.webp', undefined, '/media/bg-2.webp']

const NOISE = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

/** Blurred photo behind a stage, with a soft dark tint and film grain on top. */
function StageBackdrop({ src }: { src?: string }) {
  if (!src) return null
  return (
    <>
      <img src={src} alt="" aria-hidden draggable={false} className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-50 blur-[7px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0e0f13]/65" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
    </>
  )
}

export default function Process() {
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const allowed = useAutoplayAllowed()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 0.35 })
  // Autoplay only runs while the section is on screen, so it starts when the visitor arrives
  const autoplay = allowed && !manual && inView

  // Advance on a timer; after a manual pick it stays put for a while, then carries on
  useEffect(() => {
    if (!autoplay) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % process.length), STEP_MS)
    return () => window.clearTimeout(id)
  }, [autoplay, active])
  useEffect(() => {
    if (!manual || !allowed) return
    const id = window.setTimeout(() => setManual(false), RESUME_MS)
    return () => window.clearTimeout(id)
  }, [manual, allowed])

  return (
    <section ref={sectionRef} id="process" className="container-x pt-10 pb-24 md:pt-12 md:pb-32">
      <SectionHead
        align="center"
        tag="How we work"
        title="A clear path from idea to launch."
        desc="Three phases, one accountable team, and something you can use every week."
        className="mb-14 md:mb-16"
      />

      <div className="grid gap-2 rounded-[22px] border border-line bg-surface p-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <ul className="flex flex-col gap-1">
          {process.map((p, i) => {
            const on = i === active
            const d = phases[i]
            return (
              <li key={p.step}>
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => {
                    setActive(i)
                    setManual(true)
                  }}
                  className={cx(
                    'relative block w-full rounded-[16px] px-5 py-5 text-left transition-[background-color,opacity] duration-500 md:px-6',
                    on ? 'corner-hit [--shine:90px] bg-[#1d1e24] shadow-[0_14px_24px_-20px_rgba(0,0,0,0.6)]' : 'opacity-40 hover:opacity-70',
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-4">
                      <span className={cx('font-["Playfair_Display",serif] text-[34px] italic leading-none transition-colors', on ? 'text-amber' : 'text-dim')}>{`0${i + 1}`}</span>
                      <span className={cx('font-display text-[24px] leading-none font-[500] transition-colors md:text-[26px]', on ? 'text-fg' : 'text-fg-2')}>{p.title}</span>
                    </span>
                    <span className="label hidden text-dim sm:block">{d.time}</span>
                  </span>

                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="block overflow-hidden"
                      >
                        <span className="mt-4 block max-w-[40ch] text-[15px] leading-relaxed text-mute">{p.desc}</span>
                        <span className="mt-5 flex flex-col">
                          {d.items.map((it, k) => (
                            <span key={it} className="label flex items-center gap-3 border-t border-line py-2 text-fg-2">
                              <img src={`/media/apps/${d.icons[k]}.webp`} alt="" className="size-6 shrink-0 object-contain" />
                              {it}
                            </span>
                          ))}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="hidden lg:block relative min-h-[400px] overflow-hidden rounded-[16px] border border-white/[0.07] bg-[#101115]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <StageBackdrop src={backdrops[active]} />
              {inView && stages[active]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
