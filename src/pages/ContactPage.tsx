import { motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import PageShell from '@/components/PageShell'
import { AnimatedText, Button, Tag, cx } from '@/components/ui'
import { media } from '@/config/media'
import { company } from '@/data/site'

const EASE = [0.16, 1, 0.3, 1] as const
const budgetOptions = ['$1k to $5k', '$5k to $10k', '$10k to $20k', '$20k+']

export default function ContactPage() {
  return (
    <PageShell>
      <section className="container-x pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <div className="relative isolate">
            <div
              aria-hidden
              className="absolute -inset-y-16 -left-[30vw] right-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
            >
              <img src={media.heroBg} alt="" className="h-full w-full object-cover opacity-35 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/30 via-ink/65 to-ink" />
            </div>
            <div className="flex h-full flex-col items-start justify-between gap-12 p-2 md:p-4">
            <div className="flex flex-col items-start gap-6">
            <Tag>Contact us</Tag>
            <h1 className="font-display max-w-[14ch] text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.98] font-[470]">
              <AnimatedText as="span" className="block" speed={1.6} delay={0.4}>
                Let's talk about your project
              </AnimatedText>
            </h1>
            <AnimatedText preset="fade" speed={4} delay={0.6} className="max-w-[44ch] text-[17px] leading-relaxed text-mute">
              Share a few details about your business and what you want to build. Our team will read your message and get back to you shortly.
            </AnimatedText>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
              className="corner-hit [--shine:56px] inline-flex items-stretch rounded-[16px] border border-line-2 bg-surface p-2"
            >
              <video src={media.clarissaVideo} poster={media.clarissa} autoPlay loop muted playsInline aria-label="Clarissa, ENUVOR client partnership" className="h-[100px] w-[88px] shrink-0 rounded-[10px] object-cover object-center" />
              <div className="flex flex-1 flex-col justify-center gap-3 py-1 pl-3 pr-1">
                <div>
                  <p className="text-[15px] leading-tight">Talk to Clarissa</p>
                  <p className="label mt-1 text-mute">Client partnership</p>
                </div>
                <Button variant="light" href={`mailto:${company.email}?subject=Book a call`} className="h-9! self-start pl-3! text-[13px] [&>span]:size-6!">
                  Book a 20-min call
                </Button>
              </div>
            </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </PageShell>
  )
}

const field = 'h-12 w-full rounded-[6px] border border-line bg-black px-4 text-[15px] outline-none transition-colors placeholder:text-dim focus:border-line-2'

/** No backend yet: submitting opens the visitor's email app with everything filled in. */
function ContactForm() {
  const [sent, setSent] = useState(false)
  const topic = new URLSearchParams(useLocation().search).get('topic')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const body = [
      `Name: ${d.get('name')}`,
      `Email: ${d.get('email')}`,
      `Company: ${d.get('company') || '-'}`,
      `Budget: ${d.get('budget') || '-'}`,
      '',
      String(d.get('message') ?? ''),
    ].join('\n')
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`New project from ${d.get('name')}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form onSubmit={onSubmit} className="corner-hit [--shine:180px] flex flex-col gap-5 rounded-[10px] border border-line bg-surface p-5 md:p-8">
      <Label text="Full name">
        <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
      </Label>
      <Label text="Email">
        <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
      </Label>
      <Label text="Company name">
        <input name="company" autoComplete="organization" placeholder="Your company" className={field} />
      </Label>
      <Label text="Budget">
        <div className="relative">
          <select name="budget" defaultValue="" className={cx(field, 'appearance-none pr-10 invalid:text-dim')} required>
            <option value="" disabled>
              Select budget range
            </option>
            {budgetOptions.map((b) => (
              <option key={b} value={b} className="bg-surface text-fg">
                {b}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mute" />
        </div>
      </Label>
      <Label text="Message">
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={topic ? `I would like to talk about ${topic}.` : undefined}
          placeholder="Tell us about your project"
          className={cx(field, 'h-auto resize-none py-3 leading-relaxed')}
        />
      </Label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-mute">
        By submitting you agree to our <a href="/terms" className="text-fg-2 underline underline-offset-2 hover:text-fg">Terms of Service</a> and{' '}
        <a href="/privacy" className="text-fg-2 underline underline-offset-2 hover:text-fg">Privacy Policy</a>.
      </p>

      <button
        type="submit"
        className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-fg px-6 text-[15px] text-ink transition-colors hover:bg-amber"
      >
        {sent ? 'Opening your email app' : 'Submit'}
        <ArrowRight className="size-4" strokeWidth={2.25} />
      </button>
      </div>
    </form>
  )
}

function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="label text-mute">{text}</span>
      {children}
    </label>
  )
}
