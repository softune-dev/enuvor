import { useEffect, useRef, useState } from 'react'

// A production server console: a release pipeline that passes, then a live access log. The status
// strip on top shows CPU, memory and requests. On compact screens it renders one finished frame.

type Row =
  | { kind: 'cmd'; text: string }
  | { kind: 'step'; tag: string; text: string }
  | { kind: 'done'; text: string }
  | { kind: 'sep'; text: string }
  | { kind: 'log'; method: string; path: string; status: number; ms: number }

const pipeline: Row[] = [
  { kind: 'cmd', text: 'enuvor deploy --env production --tag v1.4.0' },
  { kind: 'step', tag: 'test', text: '248 passed, 0 failed' },
  { kind: 'step', tag: 'a11y', text: 'axe-core, 0 violations' },
  { kind: 'step', tag: 'security', text: 'dependency audit clean' },
  { kind: 'step', tag: 'perf', text: 'lighthouse 98 / 100' },
  { kind: 'step', tag: 'build', text: 'image checkout:41 pushed' },
  { kind: 'step', tag: 'deploy', text: 'rolling update, 3 of 3 pods ready' },
  { kind: 'step', tag: 'traffic', text: 'shifted 10% > 50% > 100%' },
  { kind: 'done', text: 'v1.4.0 is live · 41s · error rate 0.00%' },
  { kind: 'sep', text: 'tail -f /var/log/enuvor/access.log' },
]

const paths = ['/api/orders', '/api/products', '/api/cart', '/api/session', '/healthz', '/checkout', '/api/search?q=shoes', '/static/app.js', '/api/invoices', '/api/webhooks/stripe']
const methods = ['GET', 'GET', 'GET', 'POST', 'GET', 'GET', 'POST', 'GET']

/** Deterministic pseudo-random log line, so every visit shows the same believable traffic. */
function logRow(i: number): Row {
  const r = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  const status = r(3) > 0.93 ? 304 : r(4) > 0.985 ? 404 : r(5) > 0.5 ? 200 : 201
  return { kind: 'log', method: methods[Math.floor(r(1) * methods.length)], path: paths[Math.floor(r(2) * paths.length)], status, ms: 8 + Math.floor(r(6) * 70) }
}

const rowAt = (i: number): Row => (i < pipeline.length ? pipeline[i] : logRow(i))
const clock = (i: number) => {
  const s = 14 * 3600 + 2 * 60 + 11 + Math.floor(i * 0.9)
  return [Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':')
}

const bar = (pct: number, n = 10) => '█'.repeat(Math.round((pct / 100) * n)) + '░'.repeat(n - Math.round((pct / 100) * n))

function Line({ row, i }: { row: Row; i: number }) {
  const time = <span className="text-dim">{clock(i)}</span>
  switch (row.kind) {
    case 'cmd':
      return (
        <div className="whitespace-pre-wrap">
          <span className="text-[#4ade80]">enuvor@prod-01</span>
          <span className="text-dim">:</span>
          <span className="text-[#6aa8ff]">~</span>
          <span className="text-dim">$ </span>
          <span className="text-fg">{row.text}</span>
        </div>
      )
    case 'step':
      return (
        <div className="flex gap-2 whitespace-pre">
          {time}
          <span className="w-[62px] text-[#6aa8ff]">{row.tag}</span>
          <span className="text-fg-2">{row.text}</span>
          <span className="ml-auto text-[#4ade80]">OK</span>
        </div>
      )
    case 'done':
      return (
        <div className="flex gap-2 whitespace-pre">
          {time}
          <span className="text-[#4ade80]">✔ {row.text}</span>
        </div>
      )
    case 'sep':
      return <div className="whitespace-pre text-dim">── {row.text} ──</div>
    default: {
      const tone = row.status >= 400 ? 'text-amber' : row.status === 304 ? 'text-dim' : 'text-[#4ade80]'
      return (
        <div className="flex gap-2 whitespace-pre">
          {time}
          <span className="w-9 text-fg-2">{row.method}</span>
          <span className="min-w-0 flex-1 truncate text-fg-2">{row.path}</span>
          <span className={tone}>{row.status}</span>
          <span className="w-10 text-right text-dim">{row.ms}ms</span>
        </div>
      )
    }
  }
}


export default function ServerTerminal({ compact = false }: { compact?: boolean }) {
  const [n, setN] = useState(compact ? 22 : 1)
  const [tick, setTick] = useState(0)
  // How many log lines fit: measured from the pane, so the terminal always fills its card
  const paneRef = useRef<HTMLDivElement>(null)
  const [cap, setCap] = useState(14)
  useEffect(() => {
    const el = paneRef.current
    if (!el) return
    const measure = () => setCap(Math.max(6, Math.floor((el.clientHeight - 30) / 18.8) - 1))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (compact || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(22)
      return
    }
    const id = window.setInterval(() => setN((v) => v + 1), 420)
    return () => window.clearInterval(id)
  }, [compact])

  useEffect(() => {
    if (compact) return
    const id = window.setInterval(() => setTick((v) => v + 1), 1100)
    return () => window.clearInterval(id)
  }, [compact])

  const cpu = 24 + Math.round(10 * Math.sin(tick * 0.9))
  const mem = 41 + Math.round(3 * Math.sin(tick * 0.5))
  const rps = 1240 + Math.round(60 * Math.sin(tick * 1.3))
  const first = Math.max(0, n - cap)
  const rows = Array.from({ length: Math.min(n, cap) }, (_, k) => first + k)

  return (
    <div className="@container absolute top-5 right-0 bottom-0 left-5 flex flex-col overflow-hidden rounded-tl-[14px] border-t border-l border-line-2 bg-[#090a0d] max-lg:right-5 max-lg:bottom-5 max-lg:rounded-[14px] max-lg:border font-mono text-[11.5px] leading-[1.55]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-3.5 py-2 text-[10.5px] whitespace-nowrap">
        <span className="flex shrink-0 items-center gap-2 text-fg-2">
          <span className="size-1.5 rounded-full bg-[#4ade80]" />
          prod-01 · up 142d
        </span>
        <span className="flex min-w-0 items-center gap-3 text-dim">
          <span>
            cpu <span className="text-amber">{bar(cpu, 8)}</span> {cpu}%
          </span>
          <span className="hidden @sm:inline">
            mem <span className="text-[#6aa8ff]">{bar(mem, 8)}</span> {mem}%
          </span>
          <span className="hidden @lg:inline">
            req/s <span className="text-fg-2">{rps.toLocaleString('en-US')}</span>
          </span>
        </span>
      </div>
      <div ref={paneRef} className="flex min-h-0 flex-1 flex-col justify-start gap-px overflow-hidden px-3.5 py-3 [mask-image:linear-gradient(to_bottom,black_90%,transparent)]">
        {rows.map((i) => (
          <Line key={i} row={rowAt(i)} i={i} />
        ))}
        <div className="whitespace-pre pt-1">
          <span className="text-[#4ade80]">enuvor@prod-01</span>
          <span className="text-dim">:</span>
          <span className="text-[#6aa8ff]">~</span>
          <span className="text-dim">$ </span>
          <span className="inline-block h-[12px] w-[7px] translate-y-[2px] animate-pulse bg-fg-2" />
        </div>
      </div>
    </div>
  )
}
