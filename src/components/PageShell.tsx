import { motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { scrollToHash, scrollToTop } from '@/lib/lenis'
import Footer from '@/sections/Footer'

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const EASE_IN = [0.4, 0, 1, 1] as const

/** Wraps every route: old page fades up and out, new page slides in from the bottom. */
export default function PageShell({ children }: { children: ReactNode }) {
  const { hash } = useLocation()

  useEffect(() => {
    scrollToTop()
    if (hash) {
      const id = window.setTimeout(() => scrollToHash(hash), 500)
      return () => window.clearTimeout(id)
    }
  }, [hash])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.22, ease: EASE_IN } }}
      >
        <main>{children}</main>
        <Footer />
      </motion.div>

    </>
  )
}
