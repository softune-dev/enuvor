import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import CardSwap, { Card } from '@/components/bits/CardSwap'
import FolderFloat from '@/components/bits/FolderFloat'
import LogoLoop from '@/components/bits/LogoLoop'
import { servicesDetail } from '@/data/services'
import { stackColors } from '@/data/stackColors'
import { stackIcons } from '@/data/stackIcons'
import { Reveal, SectionHead } from '@/components/ui'
import ServerTerminal from '@/sections/ServerTerminal'

// Everything here is about what it is like to work with ENUVOR day to day. Services, products,
// process steps, pricing and numbers already live in their own sections, so none of that repeats.
// Every visual runs on its own: nothing waits for a hover.

/** App icons from /public/media/apps (the icon pack you supplied). Replace a file to change an icon. */
const Icon3D = ({ name, size }: { name: string; size: number }) => (
  <img src={`/media/apps/${name}.png`} alt="" width={size} height={size} draggable={false} className="shrink-0 object-contain" style={{ width: size, height: size }} />
)

const events = [
  { icon: 'figma', title: 'Design v2 ready for review', description: 'Checkout flow, 14 screens' },
  { icon: 'github', title: 'Build 41 on staging', description: 'All checks passed' },
  { icon: 'calendar', title: 'Sprint 6 planned', description: '8 tasks, 2 weeks' },
  { icon: 'wallet', title: 'Milestone 2 invoice', description: 'Approved by you' },
  { icon: 'youtube', title: 'Demo recording posted', description: '4 min walkthrough' },
  { icon: 'notes', title: 'Release notes v1.4', description: 'Published to your team' },
]

// Every tool listed across our services that has a logo, split into two rows
const allTools = [...new Set(servicesDetail.flatMap((s) => s.stack))].filter((n) => stackIcons[n])
const stackRows = [
  { direction: 'left' as const, tools: allTools.filter((_, i) => i % 3 === 0) },
  { direction: 'right' as const, tools: allTools.filter((_, i) => i % 3 === 1) },
  { direction: 'left' as const, tools: allTools.filter((_, i) => i % 3 === 2) },
]
const topics = [
  { label: 'Web app', icon: 'safari' },
  { label: 'Mobile app', icon: 'appstore' },
  { label: 'AI agent', icon: 'tips' },
  { label: 'Automation', icon: 'home' },
  { label: 'Online store', icon: 'store' },
  { label: 'Launch film', icon: 'videos' },
  { label: 'Brand', icon: 'photos' },
  { label: 'Dashboards', icon: 'numbers' },
]

const ago = ['now', '2m', '8m', '21m', '48m', '1h', '2h', '3h', '5h']

/** One logo tile of the stack rows. */
function StackTile({ name }: { name: string }) {
  const Icon = stackIcons[name]
  return (
    <span
      className="corner-hit [--shine:26px] grid size-14 shrink-0 place-items-center rounded-[14px] border border-line-2 bg-surface-2"
      style={{ color: stackColors[name] ?? '#ececee' }}
    >
      <Icon className="size-7" />
    </span>
  )
}

/** True on phones: the bento then holds still (no timers, no autoplay) and the lists scroll by hand. */
function useCompact() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(max-width: 767px)')
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia('(max-width: 767px)').matches,
    () => false,
  )
}

/** New events slide in at the top and push the older ones down, one every couple of seconds. */
function LiveFeed({ compact }: { compact: boolean }) {
  const entry = (k: number) => ({ id: k, ...events[k % events.length] })
  const [items, setItems] = useState(() => [8, 7, 6, 5, 4, 3, 2, 1, 0].map(entry))
  const next = useRef(9)
  useEffect(() => {
    if (compact || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      const k = next.current++
      setItems((prev) => [entry(k), ...prev].slice(0, 9))
    }, 2400)
    return () => window.clearInterval(id)
  }, [compact])
  if (compact) {
    return (
      <div data-lenis-prevent className="absolute inset-0 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <div key={it.id} className="flex items-center gap-3 rounded-[14px] bg-[linear-gradient(180deg,#3a3644_0%,#27242f_100%)] px-3.5 py-3">
              <Icon3D name={it.icon} size={34} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] text-fg">{it.title}</span>
                <span className="block truncate text-[12.5px] text-mute">{it.description}</span>
              </span>
              <span className="label shrink-0 text-[10px]! text-dim">{ago[i]}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="absolute inset-0 overflow-hidden px-5 pt-5 [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              layout="position"
              initial={{ opacity: 0, y: -56 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="flex items-center gap-3 rounded-[14px] bg-[linear-gradient(180deg,#3a3644_0%,#27242f_100%)] px-3.5 py-3"
            >
              <Icon3D name={it.icon} size={34} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] text-fg">{it.title}</span>
                <span className="block truncate text-[12.5px] text-mute">{it.description}</span>
              </span>
              <span className="label shrink-0 text-[10px]! text-dim">{ago[i]}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Visual on top, a short caption at the bottom. */
function Box({ className, title, desc, tall, children }: { className?: string; title: string; desc: string; tall?: boolean; children: ReactNode }) {
  return (
    <Reveal className={className}>
      <article aria-label={title} className="flex h-full flex-col rounded-[22px] border border-line bg-surface">
        <div className={tall ? 'relative min-h-[500px] w-full flex-1 overflow-hidden rounded-t-[22px]' : 'relative min-h-[380px] w-full flex-1 overflow-hidden rounded-t-[22px]'}>{children}</div>
        <div className="mt-auto border-t border-line px-5 py-4">
          <h3 className="font-display text-[18px] leading-tight font-[500]">{title}</h3>
          <p className="mt-1 max-w-[46ch] text-[13px] leading-relaxed text-mute">{desc}</p>
        </div>
      </article>
    </Reveal>
  )
}

const people = { Priya: 'p1', Rafi: 'p2', Maya: 'p3', Daniel: 'p4', You: 'p5', Nadia: 'p6' } as const
type Person = keyof typeof people

/** Round profile photo (stock portraits in /public/media/people). */
function Avatar({ who, size = 22 }: { who: Person; size?: number }) {
  return (
    <img
      src={`/media/people/${people[who]}.jpg`}
      alt={who}
      width={size}
      height={size}
      draggable={false}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  )
}

const statusStyle = {
  paid: 'bg-[#4ade80]/12 text-[#4ade80]',
  due: 'bg-amber/15 text-amber',
  upcoming: 'bg-white/[0.07] text-mute',
} as const

const Status = ({ kind, children }: { kind: keyof typeof statusStyle; children: ReactNode }) => (
  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-[500] ${statusStyle[kind]}`}>{children}</span>
)

/** Frame shared by the stack cards: a title, a status chip and the body. */
function SpaceCard({ title, chip, children }: { title: string; chip: string; children: ReactNode }) {
  return (
    <Card>
      <div className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-[500] text-fg">{title}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] text-fg-2">
            <span className="size-1.5 rounded-full bg-[#4ade80]" />
            {chip}
          </span>
        </div>
        {children}
      </div>
    </Card>
  )
}

function PortalCards({ compact }: { compact: boolean }) {
  return (
    <CardSwap width={300} height={340} cardDistance={22} verticalDistance={44} depth={80} skewAmount={5} delay={3600} autoplay={!compact} theme="dark" cardRadius={16}>
      {/* 1. The product being built, as a real looking dashboard */}
      <SpaceCard title="Live preview" chip="Build 41 passed">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[12px] border border-white/[0.07] bg-[#0e0f13]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-1.5">
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="ml-2 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[9.5px] text-mute">app.yourbrand.com/overview</span>
          </div>
          <div className="flex flex-1 gap-2 p-2">
            <div className="flex w-4 flex-col items-center gap-2 pt-0.5">
              <span className="size-4 rounded-[5px] bg-amber/50" />
              <span className="size-4 rounded-[5px] bg-white/[0.08]" />
              <span className="size-4 rounded-[5px] bg-white/[0.08]" />
              <span className="size-4 rounded-[5px] bg-white/[0.08]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Avatar who="Priya" size={18} />
                  <span className="text-[10.5px] font-[500] text-fg">Good morning, Priya</span>
                </span>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[8.5px] text-mute">Last 7 days</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[['Orders', '2,418', '+12%'], ['Conversion', '3.8%', '+0.4%'], ['Revenue', '$18.4k', '+9%']].map(([l, v, d]) => (
                  <div key={l} className="rounded-[7px] bg-white/[0.05] px-2 py-1.5">
                    <p className="text-[8px] text-mute">{l}</p>
                    <p className="font-display text-[13px] leading-tight font-[500] text-fg">{v}</p>
                    <p className="text-[8px] text-[#4ade80]">{d}</p>
                  </div>
                ))}
              </div>
              <div className="flex min-h-0 flex-1 flex-col rounded-[8px] bg-white/[0.04] p-2">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-fg-2">Revenue</span>
                  <span className="text-[#4ade80]">+9.2%</span>
                </div>
                <svg viewBox="0 0 200 64" preserveAspectRatio="none" className="min-h-0 w-full flex-1">
                  <defs>
                    <linearGradient id="pc-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#f59a23" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#f59a23" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[16, 32, 48].map((y) => (
                    <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  ))}
                  <path d="M0 48 C16 44 28 50 46 36 S78 40 98 26 S132 30 152 16 S186 12 200 6 L200 64 L0 64 Z" fill="url(#pc-area)" />
                  <path d="M0 48 C16 44 28 50 46 36 S78 40 98 26 S132 30 152 16 S186 12 200 6" fill="none" stroke="#f59a23" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="flex justify-between text-[7.5px] text-mute">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </SpaceCard>

      {/* 2. Sprint progress with the tasks in flight */}
      <SpaceCard title="Task board" chip="Sprint 6">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="text-fg-2">Progress</span>
            <span className="text-fg">6 of 9 done</span>
          </div>
          <div className="grid grid-cols-9 gap-1">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className={i < 6 ? 'h-1.5 rounded-full bg-amber' : 'h-1.5 rounded-full bg-white/10'} />
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          {([
            ['Checkout redesign', 'Design', 'done', 'Priya'],
            ['Payment gateway', 'Dev', 'done', 'Rafi'],
            ['Order emails', 'Dev', 'doing', 'Rafi'],
            ['Admin reports', 'Dev', 'next', 'Daniel'],
            ['Launch checklist', 'QA', 'next', 'Maya'],
          ] as const).map(([name, tag, state, who]) => (
            <div key={name} className="flex items-center gap-2.5 rounded-[10px] bg-white/[0.05] px-3 py-2">
              <span className={state === 'done' ? 'grid size-4 shrink-0 place-items-center rounded-full bg-amber' : state === 'doing' ? 'size-4 shrink-0 rounded-full border-2 border-amber' : 'size-4 shrink-0 rounded-full border border-white/25'}>
                {state === 'done' && (
                  <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="#0e0f12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.2 5 8.6 9.5 3.6" />
                  </svg>
                )}
              </span>
              <span className={state === 'done' ? 'flex-1 truncate text-[13px] text-mute line-through' : 'flex-1 truncate text-[13px] text-fg'}>{name}</span>
              <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] text-fg-2">{tag}</span>
              <Avatar who={who} size={22} />
            </div>
          ))}
        </div>
      </SpaceCard>

      {/* 3. A short thread: the question, the answer and the record of it */}
      <SpaceCard title="Decision log" chip="12 decisions">
        <div className="flex flex-1 flex-col justify-between">
          {([
            ['Priya', '12 Oct', 'Move checkout to one step?'],
            ['You', '12 Oct', 'Yes, go with one step.'],
            ['Rafi', '9 Oct', 'Launch in Bangla and English.'],
            ['You', '9 Oct', 'Agreed, ship both.'],
            ['Maya', '2 Oct', 'Launch date set for 18 Nov.'],
          ] as const).map(([who, date, text], i) => {
            const you = who === 'You'
            return (
              <div key={i} className={you ? 'flex flex-row-reverse items-start gap-2.5' : 'flex items-start gap-2.5'}>
                <Avatar who={who} size={26} />
                <div className={you ? 'flex min-w-0 flex-1 flex-col items-end' : 'flex min-w-0 flex-1 flex-col items-start'}>
                  <p className={you ? 'flex flex-row-reverse items-baseline gap-2 text-[11.5px]' : 'flex items-baseline gap-2 text-[11.5px]'}>
                    <span className="font-[500] text-fg">{who}</span>
                    <span className="text-mute">{date}</span>
                                      </p>
                  <p
                    className={
                      you
                        ? 'mt-1 max-w-[88%] rounded-[10px] rounded-tr-[3px] bg-amber/15 px-3 py-1.5 text-[12.5px] leading-snug text-fg'
                        : 'mt-1 max-w-[88%] rounded-[10px] rounded-tl-[3px] bg-white/[0.05] px-3 py-1.5 text-[12.5px] leading-snug text-fg-2'
                    }
                  >
                    {text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </SpaceCard>

      {/* 4. The next invoice and every milestone around it */}
      <SpaceCard title="Invoices" chip="Fixed price">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-mute">Milestone 3 of 5 · due 4 Nov</p>
            <p className="font-display text-[32px] leading-none font-[500] text-fg">$6,000</p>
          </div>
          <div className="relative size-14">
            <svg viewBox="0 0 56 56" className="size-full -rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="#f59a23" strokeWidth="5" strokeLinecap="round" strokeDasharray="55 138" />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[12px] font-[500] text-fg">2/5</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          {([
            ['Milestone 1', '$8,000', 'paid', 'Paid'],
            ['Milestone 2', '$10,000', 'paid', 'Paid'],
            ['Milestone 3', '$6,000', 'due', 'Due 4 Nov'],
            ['Milestone 4', '$5,000', 'upcoming', 'Upcoming'],
            ['Milestone 5', '$3,000', 'upcoming', 'Upcoming'],
          ] as const).map(([n, a, k, l]) => (
            <div key={n} className="flex items-center justify-between rounded-[10px] bg-white/[0.05] px-3 py-2 text-[13px]">
              <span className="text-fg-2">{n}</span>
              <span className="flex items-center gap-2.5">
                <span className="text-fg">{a}</span>
                <Status kind={k}>{l}</Status>
              </span>
            </div>
          ))}
        </div>
      </SpaceCard>
    </CardSwap>
  )
}

export default function Bento() {
  const navigate = useNavigate()
  const compact = useCompact()
  return (
    <section id="working-with-us" className="container-x pt-10 pb-24 md:pt-12 md:pb-32">
      <SectionHead
        align="center"
        tag="Working with us"
        title="Built to be easy to work with."
        desc="Clear updates, shared access and a clean handover, so you always know where the project stands."
        className="mb-14 md:mb-20"
      />

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
        <Box tall className="lg:col-span-4" title="See the work, not status reports." desc="One space with the live build, task board, decisions and invoices.">
          <div className="absolute inset-0 grid place-items-center">
            <div className="origin-center scale-[0.9] sm:scale-100">
              <PortalCards compact={compact} />
            </div>
          </div>
        </Box>

        <Box tall className="lg:col-span-4" title="You hear about it as it happens." desc="Releases, reviews and approvals land in a shared feed, not a monthly email.">
          <LiveFeed compact={compact} />
        </Box>

                <Box tall className="lg:col-span-4" title="Not sure where to begin? Pick a topic." desc="Choose what you want to talk about and we start the conversation from there.">
          <div className="absolute inset-0 flex items-end justify-center pb-20">
            <FolderFloat
              items={topics.map((t) => ({ label: t.label, value: t.label, icon: <Icon3D name={t.icon} size={24} /> }))}
              label="Start here"
              sublabel="Pick a topic"
              defaultOpen
              trigger="click"
              autoplay={compact ? 0 : 3600}
              physics={!compact}
              folderColor="#1f56d6"
              frontColor="#2a6bff"
              onSelect={(value) => navigate(`/contact?topic=${encodeURIComponent(value)}`)}
            />
          </div>
        </Box>

        <Box className="lg:col-span-5" title="Nothing ships unchecked." desc="Tests, accessibility, speed and security checks run before every release.">
          <ServerTerminal compact={compact} />
        </Box>

        <Box className="md:col-span-2 lg:col-span-7" title="Modern tools, picked per project." desc="Proven frameworks and AI tooling, chosen to fit your product, not ours.">
          <div className="absolute inset-0 flex flex-col justify-center gap-3.5">
            {compact
              ? stackRows.map((row, ri) => (
                  <div key={ri} data-lenis-prevent className="flex gap-3.5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {row.tools.map((n) => (
                      <StackTile key={n} name={n} />
                    ))}
                  </div>
                ))
              : stackRows.map((row, ri) => (
                  <LogoLoop
                    key={ri}
                    direction={row.direction}
                    logos={row.tools.map((n) => ({ node: <StackTile name={n} />, title: n }))}
                    speed={34}
                    gap={14}
                    logoHeight={56}
                    fadeOut
                    fadeOutWidth={0.22}
                    fadeOutColor="#121317"
                    pauseOnHover={false}
                    intro={false}
                    ariaLabel="Tools we use"
                  />
                ))}
          </div>
        </Box>
      </div>
    </section>
  )
}
