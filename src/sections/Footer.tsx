import { useState, type ComponentType } from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { AnimatedText, Button, Chevron, Tag } from '@/components/ui'
import { media } from '@/config/media'
import { company, productsMenu, servicesMenu } from '@/data/site'

const nav = [
  ['Services', '#services'],
  ['Products', '#products'],
  ['Work', '/work'],
  ['About', '/about'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
  ['Careers', '/about#careers'],
]

const legal = [
  ['Privacy Policy', '/privacy'],
  ['Terms of Service', '/terms'],
  ['Cookie Policy', '/cookies'],
]

export const socials: { label: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { label: 'LinkedIn', href: '#', Icon: FaLinkedinIn },
  { label: 'X', href: '#', Icon: FaXTwitter },
  { label: 'Instagram', href: '#', Icon: FaInstagram },
  { label: 'Facebook', href: '#', Icon: FaFacebookF },
]

function Cta() {
  return (
    <section id="contact" className="relative isolate overflow-hidden">
      <img src={media.footerBg} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover grayscale" />
      <div className="absolute inset-0 -z-10 bg-ink/55" />
      <div className="absolute inset-x-0 top-0 -z-10 h-2/5 bg-gradient-to-b from-ink to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
      <div className="container-x flex min-h-[560px] flex-col items-center justify-center gap-6 py-32 text-center md:min-h-[640px]">
        <Tag>Let's get started</Tag>
        <AnimatedText as="h2" className="font-display max-w-[16ch] text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[1] font-[460] text-balance">
          Have something worth building?
        </AnimatedText>
        <AnimatedText preset="fade" speed={4} delay={0.2} className="max-w-[46ch] text-[16px] leading-relaxed text-fg-2">
          Tell us where you are and where you want to be. You'll get a written plan with scope, timeline and price within a week.
        </AnimatedText>
        <div className="mt-2">
          <Button variant="light" href="/contact">
            Start a project
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <>
      <Cta />
      <footer className="relative overflow-hidden pt-16 md:pt-20">
        <div className="container-x">
          {/* Brand block + 3D slot (swap /media/footer-3d.webp or set footer3dVideo) */}
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <img src={media.mark} alt="" className="size-10 object-contain" />
                <span className="font-display text-[26px] font-[620] tracking-[0.22em]! [font-stretch:118%]!">ENUVOR</span>
              </div>
              <p className="font-display max-w-[20ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.08] font-[440] text-fg-2">
                {company.tagline}
              </p>
            </div>
            {/* Landing spot for the floating ENUVOR mark (see SiteAgent) */}
            <div data-orb-slot="footer" aria-hidden className="mx-auto aspect-square w-[min(36vw,140px)] md:mr-0 md:w-[150px]" />
          </div>

          <div className="mt-16 grid gap-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.3fr]">
            <div>
              <p className="label mb-5 text-mute">Navigation</p>
              <ul className="flex flex-col gap-2.5">
                {nav.map(([t, h]) => (
                  <li key={t}>
                    <a href={h} className="text-[15px] text-fg-2 transition-colors hover:text-fg">
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-5 text-mute">Services</p>
              <ul className="flex flex-col gap-2.5">
                {servicesMenu.flatMap((g) => g.links).slice(0, 8).map((l) => (
                  <li key={l.title}>
                    <a href={l.href} className="text-[15px] text-fg-2 transition-colors hover:text-fg">
                      {l.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-5 text-mute">Products</p>
              <ul className="flex flex-col gap-2.5">
                {productsMenu.map((p) => (
                  <li key={p.title}>
                    <a href={p.href} className="flex items-center gap-2 text-[15px] text-fg-2 transition-colors hover:text-fg">
                      {p.title}
                      <span className="label text-[10px]! text-dim">{p.meta}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <p className="label mb-3 text-mute">Socials</p>
                <div className="flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="grid size-10 place-items-center rounded-[9px] border border-line bg-surface text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
                    >
                      <s.Icon className="size-[17px]" aria-hidden />
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="label mb-2 text-mute">Email</p>
                <a href={`mailto:${company.email}`} className="font-display text-[22px] font-[460] transition-colors hover:text-amber">
                  {company.email}
                </a>
              </div>
              <div>
                <p className="label mb-3 text-mute">Newsletter, product launches only</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email) setSent(true)
                  }}
                  className="flex h-12 items-center rounded-[11px] border border-line bg-surface p-1 pl-4 focus-within:border-line-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={sent ? "You're on the list" : 'Email address'}
                    className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-dim"
                    aria-label="Email address"
                  />
                  <button className="grid size-10 place-items-center rounded-[8px] bg-fg text-ink" aria-label="Subscribe">
                    <Chevron />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="label text-fg">© {new Date().getFullYear()} ENUVOR. All rights reserved.</p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
              {legal.map(([t, h]) => (
                <a key={t} href={h} className="label text-dim transition-colors hover:text-fg-2">
                  {t}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  )
}
