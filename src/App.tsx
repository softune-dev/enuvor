import Lenis from 'lenis'
import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router'
import Navbar from '@/components/Navbar'
import SiteAgent from '@/components/SiteAgent'
import { lenisRef, scrollToHash } from '@/lib/lenis'
import Home from '@/pages/Home'
import ServicePage from '@/pages/ServicePage'
import WorkPage from '@/pages/WorkPage'
import AboutPage from '@/pages/AboutPage'
import BlogPage from '@/pages/BlogPage'
import ContactPage from '@/pages/ContactPage'
import LegalPage from '@/pages/LegalPage'
import CookieConsent from '@/components/CookieConsent'
import RouteLoader from '@/components/RouteLoader'
import NotFound from '@/pages/NotFound'
import PostPage from '@/pages/PostPage'
import ProductPage from '@/pages/ProductPage'

/** Routes internal <a href> clicks through the router so pages animate instead of reloading. */
function useInternalLinks() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest('a')
      const href = a?.getAttribute('href')
      if (!a || !href || a.target === '_blank' || /^(mailto:|tel:|https?:)/.test(href)) return
      e.preventDefault()
      if (href === '#' || href === '/#') return

      const url = new URL(href, window.location.href)
      if (url.pathname === location.pathname && url.search === window.location.search) {
        // Same page: scroll to the section, or go home if the section lives there
        if (url.hash && !scrollToHash(url.hash)) navigate('/' + url.hash)
        else if (!url.hash) lenisRef.current?.scrollTo(0)
        return
      }
      navigate(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate, location.pathname])
}

export default function App() {
  const location = useLocation()
  useInternalLinks()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ duration: 1.1 })
    lenisRef.current = l
    let raf = 0
    const loop = (t: number) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      lenisRef.current = null
    }
  }, [])

  const onMobileToggle = useCallback((open: boolean) => {
    if (open) lenisRef.current?.stop()
    else lenisRef.current?.start()
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [])

  return (
    <div className="grain">
      <Navbar onMobileToggle={onMobileToggle} />
      <SiteAgent />
      <CookieConsent />
      <RouteLoader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<LegalPage slug="privacy" />} />
          <Route path="/terms" element={<LegalPage slug="terms" />} />
          <Route path="/cookies" element={<LegalPage slug="cookies" />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
