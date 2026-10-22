import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { cx } from '@/components/ui'
import VoicePanel from '@/components/VoicePanel'
import { media } from '@/config/media'

const EASE = [0.16, 1, 0.3, 1] as const
// Soft spring for travelling between hero, corner and footer
const TRAVEL = { stiffness: 46, damping: 15, mass: 1.15 }
const BASE = 500 // rendered size of the mark; everything else is a scale of this
const TRANSITION_MS = 2000

type Mode = 'hero' | 'dock' | 'footer'

/**
 * The mark as two separate parts (arch + pillar) that share one canvas.
 * In the hero they sit slightly apart and drift independently (float, pointer and scroll parallax);
 * everywhere else they close into the whole logo.
 */
function SplitMark({ mode, ready }: { mode: Mode; ready: boolean }) {
  const hero = mode === 'hero'
  const spread = useSpring(hero ? 1 : 0, { stiffness: 55, damping: 16, mass: 1 })
  useEffect(() => {
    spread.set(hero ? 1 : 0)
  }, [hero, spread])

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const mx = useSpring(px, { stiffness: 70, damping: 18 })
  const my = useSpring(py, { stiffness: 70, damping: 18 })
  const { scrollY } = useScroll()
  const sy = useTransform(scrollY, (v) => Math.min(Math.max(v, 0), 700))

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    if (reduced) return
    // Touch screens have no pointer to follow, so the mark drifts on its own instead
    const touch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    if (touch) {
      let raf = 0
      const t0 = performance.now()
      const drift = (now: number) => {
        const t = (now - t0) / 1000
        px.set(Math.sin(t * 0.7) * 0.7)
        py.set(Math.cos(t * 0.5) * 0.5)
        raf = requestAnimationFrame(drift)
      }
      raf = requestAnimationFrame(drift)
      return () => cancelAnimationFrame(raf)
    }
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 2)
      py.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [px, py, reduced])

  // Offsets are in px at the mark's 500px design size; the back layer (arch) moves less than the front one (pillar)
  const archX = useTransform([spread, mx], ([s, m]: number[]) => -m * 4 * s)
  const archY = useTransform([spread, my, sy], ([s, m, y]: number[]) => s * (-14 - m * 3 - y * 0.035))
  const archRot = useTransform([spread, mx], ([s, m]: number[]) => -m * 0.5 * s)
  const archScale = useTransform(spread, (s) => 1 - 0.006 * s)
  const pillarX = useTransform([spread, mx], ([s, m]: number[]) => m * 8 * s)
  const pillarY = useTransform([spread, my, sy], ([s, m, y]: number[]) => s * (13 + m * 5 + y * 0.055))
  const pillarRot = useTransform([spread, mx], ([s, m]: number[]) => m * 0.9 * s)
  const pillarScale = useTransform(spread, (s) => 1 + 0.025 * s)
  const glow = useTransform(spread, (s) => 0.9 * s)

  const enter = (fromY: number, delay: number) => ({
    initial: { opacity: 0, y: fromY, filter: 'blur(16px)' },
    // Drop the filter once the entrance ends: a leftover blur(0px) layer can draw a seam line while the parts move
    animate: ready ? { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : undefined,
    transition: { duration: 1.5, delay, ease: EASE },
  })

  return (
    <div className="relative h-full w-full">
      {/* Soft coloured light behind each part; only visible while they are spread */}
      <motion.div
        aria-hidden
        style={{ opacity: glow }}
        className="absolute -inset-[8%] [background:radial-gradient(38%_34%_at_50%_30%,rgb(245_154_35/0.16),transparent_70%),radial-gradient(22%_30%_at_50%_72%,rgb(42_107_255/0.22),transparent_70%)]"
      />

      <motion.div style={{ x: archX, y: archY, rotate: archRot, scale: archScale, transformOrigin: '50% 42%' }} className="absolute inset-0">
        <motion.div
          animate={hero && !reduced ? { y: [0, -5, 0] } : { y: 0 }}
          transition={hero && !reduced ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6, ease: EASE }}
          className="h-full w-full"
        >
          <motion.img src={media.heroPart1} alt="" fetchPriority="high" className="h-full w-full object-contain" {...enter(-90, 0.1)} />
        </motion.div>
      </motion.div>

      <motion.div style={{ x: pillarX, y: pillarY, rotate: pillarRot, scale: pillarScale, transformOrigin: '50% 63%' }} className="absolute inset-0">
        <motion.div
          animate={hero && !reduced ? { y: [0, 6, 0] } : { y: 0 }}
          transition={hero && !reduced ? { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } : { duration: 0.6, ease: EASE }}
          className="h-full w-full"
        >
          <motion.img src={media.heroPart2} alt="" fetchPriority="high" className="h-full w-full object-contain" {...enter(90, 0.4)} />
        </motion.div>
      </motion.div>
    </div>
  )
}



/** Where the mark should sit right now, in viewport pixels. */
function measure(): { mode: Mode; x: number; y: number; size: number } {
  // clientWidth/Height exclude the scrollbar, so the docked mark never sits on top of it
  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight
  const mobile = w < 768
  const dock = mobile ? 52 : 60
  const edge = mobile ? 20 : 36

  const footer = document.querySelector<HTMLElement>('[data-orb-slot="footer"]')
  const fr = footer?.getBoundingClientRect()
  if (fr && fr.width > 0 && fr.top < h * 0.68 && fr.bottom > 80) {
    return { mode: 'footer', x: fr.left, y: fr.top, size: fr.width }
  }

  const hero = document.querySelector<HTMLElement>('[data-orb-slot="hero"]')
  const hr = hero?.getBoundingClientRect()
  if (hr && hr.width > 0 && hr.top > 64 - hr.height * 0.45) {
    return { mode: 'hero', x: hr.left, y: hr.top, size: hr.width }
  }

  return { mode: 'dock', x: w - edge - dock, y: h - edge - dock, size: dock }
}

export default function SiteAgent() {
  const [mode, setMode] = useState<Mode>('dock')
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const x = useSpring(0, TRAVEL)
  const y = useSpring(0, TRAVEL)
  const scale = useSpring(0.1, TRAVEL)
  const blur = useMotionValue(0)
  const filter = useMotionTemplate`blur(${blur}px)`

  // Track the active slot every frame so the mark follows page transitions and scroll exactly.
  useEffect(() => {
    let raf = 0
    let prev: Mode | null = null
    let travelUntil = 0
    const tick = () => {
      const t = measure()
      const now = performance.now()
      const s = t.size / BASE
      if (prev === null) {
        x.jump(t.x)
        y.jump(t.y)
        scale.jump(s)
        prev = t.mode
        setMode(t.mode)
        setReady(true)
      } else if (t.mode !== prev) {
        prev = t.mode
        travelUntil = now + TRANSITION_MS
        setMode(t.mode)
      }
      if (now < travelUntil || t.mode === 'dock') {
        x.set(t.x)
        y.set(t.y)
        scale.set(s)
      } else {
        // Resting in hero/footer: stick to the slot so it scrolls with the page
        x.jump(t.x)
        y.jump(t.y)
        scale.jump(s)
      }
      // Motion blur only while travelling, scaled by speed
      const speed = Math.hypot(x.getVelocity(), y.getVelocity())
      blur.set(now < travelUntil ? Math.min(speed / 700, 4) : 0)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [x, y, scale, blur])

  useEffect(() => setOpen(false), [pathname])

  // Hero and footer are the mark's resting spots; the panel belongs to the corner
  useEffect(() => {
    if (mode !== 'dock') setOpen(false)
  }, [mode])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.div
        style={{ x, y, scale, filter, width: BASE, height: BASE, transformOrigin: '0 0' }}
        className="pointer-events-none fixed left-0 top-0 z-40"
      >
        <div className="h-full w-full">
          <button
            type="button"
            onClick={() => mode === 'dock' && setOpen((o) => !o)}
            disabled={mode !== 'dock'}
            tabIndex={mode === 'dock' ? 0 : -1}
            aria-label={open ? 'Close ENUVOR assistant' : 'Open ENUVOR assistant'}
            aria-expanded={open}
            className={cx(
              'group relative block h-full w-full rounded-[22%] outline-none',
              mode === 'dock' ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none cursor-default',
            )}
          >
            {media.hero3dVideo ? (
              <video src={media.hero3dVideo} poster={media.hero3d} autoPlay muted loop playsInline className="h-full w-full object-contain" />
            ) : (
              <SplitMark mode={mode} ready={ready} />
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>{open && <VoicePanel onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

