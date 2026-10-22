import { AnimatePresence, motion } from 'motion/react'
import { Cookie, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cx } from '@/components/ui'

const KEY = 'enuvor-consent'
const EVENT = 'enuvor:cookie-settings'
const EASE = [0.16, 1, 0.3, 1] as const

type Consent = { analytics: boolean; marketing: boolean; at: string }

/** Reopens the banner with preferences expanded (used by the Cookie Policy page). */
export const openCookieSettings = () => window.dispatchEvent(new Event(EVENT))

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Consent) : null
  } catch {
    return null
  }
}

const categories = [
  { key: 'essential', title: 'Essential', desc: 'Keeps the site working and remembers this choice.', locked: true },
  { key: 'analytics', title: 'Analytics', desc: 'Shows us which pages help, so we can improve them.' },
  { key: 'marketing', title: 'Marketing', desc: 'Measures campaigns on other platforms.' },
] as const

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false })

  useEffect(() => {
    const saved = readConsent()
    if (saved) setPrefs({ analytics: saved.analytics, marketing: saved.marketing })
    const t = saved ? undefined : window.setTimeout(() => setOpen(true), 1400)
    const reopen = () => {
      setExpanded(true)
      setOpen(true)
    }
    window.addEventListener(EVENT, reopen)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener(EVENT, reopen)
    }
  }, [])

  const save = (next: { analytics: boolean; marketing: boolean }) => {
    setPrefs(next)
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...next, at: new Date().toISOString() }))
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
    setOpen(false)
    window.setTimeout(() => setExpanded(false), 500)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-x-3 bottom-3 z-[90] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[560px]"
        >
          {/* corner-hit sets position: relative, so it lives on this inner card, never on the fixed wrapper */}
          <div className="corner-hit [--shine:90px] rounded-[14px] border border-line-2 bg-surface px-5 py-4">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-[12px] border border-line-2 bg-surface-2 text-amber">
                <Cookie className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[19px] leading-tight font-[500]">We use cookies</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">
                  Essential ones keep the site running. With your OK, we also use a few to learn what helps.{' '}
                  <a href="/cookies" className="text-fg-2 underline underline-offset-2 hover:text-fg">
                    Read more
                  </a>
                </p>
              </div>
              <button
                onClick={() => save(prefs)}
                aria-label="Close and keep current choice"
                className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-[8px] text-dim transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <ul className="mt-5 flex flex-col rounded-[12px] border border-line bg-ink-2">
                    {categories.map((c) => {
                      const on = 'locked' in c ? true : prefs[c.key]
                      return (
                        <li key={c.key} className="flex items-center justify-between gap-4 px-4 py-3.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-line">
                          <div className="min-w-0">
                            <p className="text-[14px] text-fg">{c.title}</p>
                            <p className="mt-0.5 text-[12.5px] leading-snug text-mute">{c.desc}</p>
                          </div>
                          {'locked' in c ? (
                            <span className="label shrink-0 text-[10px]! text-dim">Always on</span>
                          ) : (
                            <Switch on={on} label={c.title} onChange={(v) => setPrefs((p) => ({ ...p, [c.key]: v }))} />
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 flex items-center gap-2">
              {expanded ? (
                <button onClick={() => save(prefs)} className="h-10 flex-1 rounded-[10px] bg-fg text-[14px] text-ink transition-colors hover:bg-amber">
                  Save choices
                </button>
              ) : (
                <>
                  <button
                    onClick={() => save({ analytics: true, marketing: true })}
                    className="h-10 flex-1 rounded-[10px] bg-fg text-[14px] text-ink transition-colors hover:bg-amber"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={() => save({ analytics: false, marketing: false })}
                    className="h-10 flex-1 rounded-[10px] border border-line-2 bg-surface-2 text-[14px] text-fg-2 transition-colors hover:text-fg"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="h-10 rounded-[10px] px-3 text-[14px] text-mute transition-colors hover:text-fg"
              >
                {expanded ? 'Back' : 'Customize'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Switch({ on, label, onChange }: { on: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx('relative flex h-6 w-10 shrink-0 items-center rounded-full border p-0.5 transition-colors duration-300', on ? 'justify-end border-amber bg-amber' : 'justify-start border-line-2 bg-surface-3')}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 34 }} className={cx('size-[18px] rounded-full', on ? 'bg-ink' : 'bg-fg-2')} />
    </button>
  )
}
