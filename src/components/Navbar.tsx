import { X } from 'lucide-react'
import ServiceIcon from '@/components/ServiceIcon'
import { serviceIcons } from '@/data/services'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation } from 'react-router'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { media } from '@/config/media'
import { productsMenu, servicesMenu, company } from '@/data/site'
import { Button, Chevron, cx } from './ui'

type MenuKey = 'services' | 'products' | 'company'
type NavItem = { label: string; menu?: MenuKey; href?: string }

const NAV: NavItem[] = [
  { label: 'Services', menu: 'services' },
  { label: 'Products', menu: 'products' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]
const MENU_ORDER: MenuKey[] = ['services', 'products', 'company']
const EASE = [0.16, 1, 0.3, 1] as const

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cx('flex items-center gap-2.5', className)} aria-label="ENUVOR home">
      <img src={media.mark} alt="" width={28} height={28} className="size-7 object-contain" />
      <span className="font-display text-[15px] font-[620] tracking-[0.22em]! [font-stretch:118%]!">ENUVOR</span>
    </a>
  )
}

export default function Navbar({ onMobileToggle }: { onMobileToggle?: (open: boolean) => void }) {
  const [active, setActive] = useState<MenuKey | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [dir, setDir] = useState(0)
  const [mobile, setMobile] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const prev = useRef<MenuKey | null>(null)

  const open = useCallback((key: MenuKey | null) => {
    window.clearTimeout(closeTimer.current)
    if (key && prev.current) setDir(MENU_ORDER.indexOf(key) > MENU_ORDER.indexOf(prev.current) ? 1 : -1)
    else setDir(0)
    prev.current = key
    setActive(key)
  }, [])

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      prev.current = null
      setActive(null)
    }, 140)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (open(null), setMobile(false))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => onMobileToggle?.(mobile), [mobile, onMobileToggle])

  // Close any open menu when the route changes
  const { pathname } = useLocation()
  useEffect(() => {
    open(null)
    setMobile(false)
  }, [pathname, open])

  // Close the mega menu once the page scrolls under it
  useEffect(() => {
    if (!active) return
    const y0 = window.scrollY
    const onScroll = () => Math.abs(window.scrollY - y0) > 40 && open(null)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [active, open])

  return (
    <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={scheduleClose}>
      <div
        className={cx(
          'relative border-b border-line backdrop-blur-xl transition-colors duration-500',
          active || mobile ? 'bg-ink/95' : 'bg-ink/70',
        )}
      >
        <div className="container-x flex h-16 items-center justify-between">
          <Logo />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:block" aria-label="Main">
            <ul className="flex items-center" onMouseLeave={() => setHovered(null)}>
              {NAV.map((item) => {
                const isOpen = item.menu && active === item.menu
                const inner = (
                  <>
                    {hovered === item.label && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-[8px] bg-white/[0.06]"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                    {item.menu && (
                      <Chevron
                        className={cx(
                          'relative size-3 rotate-90 text-mute transition-transform duration-300',
                          isOpen && '-rotate-90 text-fg',
                        )}
                      />
                    )}
                  </>
                )
                const cls = cx(
                  'relative flex h-9 items-center gap-1.5 px-3.5 font-display text-[14px] font-[500] tracking-[-0.01em] transition-colors',
                  isOpen ? 'text-fg' : 'text-fg-2 hover:text-fg',
                )
                return (
                  <li key={item.label} onMouseEnter={() => setHovered(item.label)}>
                    {item.menu ? (
                      <button
                        className={cls}
                        aria-expanded={!!isOpen}
                        onMouseEnter={() => open(item.menu!)}
                        onFocus={() => open(item.menu!)}
                        onClick={() => open(item.menu!)}
                      >
                        {inner}
                      </button>
                    ) : (
                      <a href={item.href} className={cls} onMouseEnter={() => open(null)}>
                        {inner}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href="/contact" className="hidden h-9 items-center px-3 text-[14px] text-fg-2 transition-colors hover:text-fg md:flex">
              Contact
            </a>
            <span className="hidden sm:block">
              <Button href="/contact" variant="light" className="h-9! pl-3.5! text-[13.5px] [&>span]:size-6!">
                Start a project
              </Button>
            </span>
            <button
              className="relative grid size-10 place-items-center rounded-[9px] border border-line-2 bg-surface-2 lg:hidden"
              aria-label={mobile ? 'Close menu' : 'Open menu'}
              aria-expanded={mobile}
              onClick={() => setMobile((m) => !m)}
            >
              <span className={cx('absolute inset-0 m-auto h-px w-4 bg-fg transition-transform duration-500 ease-out-expo', mobile ? 'rotate-45' : '-translate-y-[3.5px]')} />
              <span className={cx('absolute inset-0 m-auto h-px w-4 bg-fg transition-transform duration-500 ease-out-expo', mobile ? '-rotate-45' : 'translate-y-[3.5px]')} />
            </button>
          </div>
        </div>
      </div>

      {/* Page blur behind the open menu: sits under the bar and panel (inside the header's stacking context) */}
      <AnimatePresence>
        {active && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pointer-events-none fixed inset-0 -z-10 hidden bg-ink/45 backdrop-blur-md lg:block"
          />
        )}
      </AnimatePresence>

      {/* Desktop mega menu - one surface that morphs between panels */}
      <div className="pointer-events-none absolute inset-x-0 top-full hidden justify-center pt-2 lg:flex">
        <AnimatePresence>
          {active && (
            <motion.div
              key="surface"
              initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)', transition: { duration: 0.18 } }}
              transition={{ duration: 0.35, ease: EASE }}
              className="corner-hit pointer-events-auto rounded-[18px] [--shine:130px]"
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            >
              <MorphSurface active={active} dir={dir} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </header>
  )
}

function MorphSurface({ active, dir }: { active: MenuKey; dir: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [ready, setReady] = useState(false)
  const onSize = useCallback((w: number, h: number) => setSize({ w, h }), [])

  // Enable the size transition only after the first measurement so the panel doesn't grow from 0.
  useEffect(() => {
    if (!size || ready) return
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [size, ready])

  return (
    <div
      className="relative overflow-hidden rounded-[18px] border border-line-2 bg-ink-2"
      style={{
        width: size?.w,
        height: size?.h,
        transition: ready ? 'width .45s cubic-bezier(.16,1,.3,1), height .45s cubic-bezier(.16,1,.3,1)' : 'none',
      }}
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={active}
          custom={dir}
          className="absolute left-0 top-0 w-max"
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 48 }),
            center: { opacity: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, x: d * -48 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Measured onSize={onSize}>
            {active === 'services' && <ServicesPanel />}
            {active === 'products' && <ProductsPanel />}
          </Measured>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Measured({ onSize, children }: { onSize: (w: number, h: number) => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current!
    const measure = () => onSize(el.offsetWidth, el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [onSize])
  return <div ref={ref}>{children}</div>
}

function StatusDot({ meta }: { meta?: string }) {
  if (!meta) return null
  return (
    <span className="label flex items-center gap-1 text-[9.5px]! text-mute">
      <span className={cx('size-1 rounded-full', meta === 'Live' ? 'bg-amber' : meta === 'Building' ? 'bg-volt-2' : 'bg-dim')} />
      {meta}
    </span>
  )
}

function ImageBox({ src, href, className }: { src: string; href: string; className?: string }) {
  return (
    <a href={href} className={cx('relative block min-h-[200px] overflow-hidden rounded-[12px] border border-line bg-surface', className)}>
      <img src={src} alt="" className="absolute inset-0 h-full w-full rounded-[inherit] object-cover" />
    </a>
  )
}

function PanelLabel({ children }: { children: ReactNode }) {
  return <p className="label px-2.5 pb-1 pt-1 text-[10px]! text-dim">{children}</p>
}

function ServicesPanel() {
  return (
    <div className="grid w-[950px] grid-cols-[1fr_1fr_1fr_170px] gap-3 p-3">
      {servicesMenu.map((g) => (
        <div key={g.heading} className="flex flex-col">
          <PanelLabel>{g.heading}</PanelLabel>
          {g.links.map((l) => {
            return (
              <a key={l.title} href={l.href} className="corner-hit corner-hit-hover [--shine:44px] group flex items-start gap-3 rounded-[10px] p-2.5 transition-colors duration-200 hover:bg-white/[0.04]">
                <span className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-line bg-surface text-fg-2 transition-colors group-hover:text-amber">
                  <ServiceIcon src={serviceIcons[l.title]} className="size-[22px]" />
                </span>
                <span className="flex flex-col pt-px">
                  <span className="text-[14px] leading-[1.2] text-fg">{l.title}</span>
                  <span className="whitespace-nowrap text-[12.5px] leading-[1.2] text-mute">{l.desc}</span>
                </span>
              </a>
            )
          })}
        </div>
      ))}
      <ImageBox src={media.menuServices} href="#services" />
    </div>
  )
}

/** Products: app-store style tiles with status, plus a portfolio counter. */
function ProductsPanel() {
  return (
    <div className="grid w-[720px] grid-cols-[1fr_1fr_1fr_150px] gap-2 p-2">
      {productsMenu.map((p, i) => (
        <a key={p.title} href={p.href} className="group flex flex-col overflow-hidden rounded-[12px] border border-line bg-surface transition-colors duration-300 hover:border-line-2">
          <div className="aspect-square overflow-hidden">
            <img src={media.products[i]} alt="" className="h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <div className="flex flex-col gap-2 p-3">
            <p className="font-display text-[16px] leading-none font-[500]">{p.title}</p>
            <StatusDot meta={p.meta} />
          </div>
        </a>
      ))}
      <a href="#products" className="group flex flex-col justify-between rounded-[12px] bg-fg p-4 text-ink">
        <span className="label text-ink/60">Portfolio</span>
        <div>
          <p className="font-display text-[56px] leading-none font-[500]">{productsMenu.length}</p>
          <p className="mt-2 flex items-center gap-1 text-[13px]">
            View all <Chevron className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </p>
        </div>
      </a>
    </div>
  )
}

/** Mobile: a right-hand sidebar. Soft slide and fade, accordion groups, light stagger. */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [section, setSection] = useState<string | null>(null)

  useEffect(() => {
    if (!open) setSection(null)
  }, [open])

  const itemIn = (i: number) => ({
    initial: { opacity: 0, x: 14 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.12 + i * 0.035, ease: EASE } },
  })

  const Row = ({ href, title, meta, icon }: { href: string; title: string; meta?: string; icon?: string }) => (
    <a href={href} onClick={onClose} className="group flex items-center gap-3 rounded-[10px] px-2 py-2 text-[15px] text-fg-2 transition-colors active:bg-white/[0.05]">
      {icon && (
        <span className="grid size-8 shrink-0 place-items-center rounded-[8px] border border-line bg-surface text-fg-2">
          <ServiceIcon src={icon} className="size-[18px]" />
        </span>
      )}
      <span className="flex-1">{title}</span>
      {meta && <span className="label text-[9.5px]! text-dim">{meta}</span>}
    </a>
  )

  const groups: { label: string; body: ReactNode }[] = [
    {
      label: 'Services',
      body: servicesMenu.map((g) => (
        <div key={g.heading} className="pb-2">
          <p className="label px-2 pb-1 pt-2 text-[10px]! text-dim">{g.heading}</p>
          {g.links.map((l) => (
            <Row key={l.title} href={l.href} title={l.title} icon={serviceIcons[l.title]} />
          ))}
        </div>
      )),
    },
    { label: 'Products', body: productsMenu.map((l) => <Row key={l.title} href={l.href} title={l.title} meta={l.meta} />) },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%', transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed bottom-0 right-0 top-0 flex w-[min(88vw,360px)] flex-col border-l border-line bg-ink-2 lg:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-[9px] border border-line-2 bg-surface-2 text-fg-2 transition-colors active:bg-surface-3"
              >
                <X className="size-4" strokeWidth={1.8} />
              </button>
            </div>

            <nav data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-3" aria-label="Mobile">
              {groups.map((g, i) => (
                <motion.div key={g.label} {...itemIn(i)} className="border-b border-line">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-left font-display text-[22px] leading-none"
                    onClick={() => setSection(section === g.label ? null : g.label)}
                    aria-expanded={section === g.label}
                  >
                    {g.label}
                    <Chevron className={cx('size-4 text-mute transition-transform duration-300', section === g.label ? '-rotate-90' : 'rotate-90')} />
                  </button>
                  <AnimatePresence initial={false}>
                    {section === g.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-3">{g.body}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              {[
                ['Work', '/work'],
                ['About', '/about'],
                ['Blog', '/blog'],
                ['Contact', '/contact'],
              ].map(([t, h], i) => (
                <motion.a
                  key={t}
                  href={h}
                  onClick={onClose}
                  {...itemIn(groups.length + i)}
                  className="flex items-center justify-between border-b border-line py-4 font-display text-[22px] leading-none"
                >
                  {t}
                  <Chevron className="size-4 text-mute" />
                </motion.a>
              ))}
            </nav>

            <motion.div {...itemIn(groups.length + 3)} className="shrink-0 border-t border-line p-5">
              <Button href="/contact" variant="light" className="w-full justify-between">
                Start a project
              </Button>
              <a href={`mailto:${company.email}`} className="label mt-4 block text-center text-mute">
                {company.email}
              </a>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
