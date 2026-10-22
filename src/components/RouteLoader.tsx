import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

const ARCH = '/brand/loader-part-1.webp'
const PILLAR = '/brand/loader-part-2.webp'
const HOLD = 580 // ms the mark stays assembled before the curtain lifts
const ease = [0.16, 1, 0.3, 1] as const

// Warm the two parts so the first transition never waits on the network
if (typeof window !== 'undefined') for (const src of [ARCH, PILLAR]) new Image().src = src

/**
 * Route transition: the logo assembles from its two parts. The arch drops in, the crystal pillar
 * rises into it and the arch dips in response, then the curtain lifts off the new page.
 * Pure transforms and opacity, under a second, skipped for reduced motion and for hash-only changes.
 */
export default function RouteLoader() {
  const { pathname } = useLocation()
  const [run, setRun] = useState(0)
  const [shown, setShown] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setRun((n) => n + 1)
    setShown(true)
    const t = window.setTimeout(() => setShown(false), HOLD)
    return () => window.clearTimeout(t)
  }, [pathname])

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          key={run}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-[#0b0c0f]"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.38, ease }}
        >
          <div className="relative size-[132px] overflow-hidden">
            {/* arch: a quick drop, then a small lift when the pillar pushes up into it */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={ARCH}
                alt=""
                draggable={false}
                className="size-full will-change-transform"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.26, delay: 0.2, times: [0, 0.35, 1], ease: 'easeInOut' }}
              />
            </motion.div>
            <motion.img
              src={PILLAR}
              alt=""
              draggable={false}
              className="absolute inset-0 size-full will-change-transform"
              initial={{ y: 64, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.24, delay: 0.08, ease: [0.3, 0.9, 0.4, 1] }}
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
