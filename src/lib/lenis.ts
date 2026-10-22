import type Lenis from 'lenis'

// Shared smooth-scroll instance so pages and links can scroll without prop drilling.
export const lenisRef: { current: Lenis | null } = { current: null }

const NAV_OFFSET = -72

export function scrollToTop() {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

/** Smooth-scroll to an element by hash. Returns false when the element isn't on this page. */
export function scrollToHash(hash: string) {
  const el = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null
  if (!el) return false
  if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: NAV_OFFSET })
  else el.scrollIntoView({ behavior: 'smooth' })
  return true
}
