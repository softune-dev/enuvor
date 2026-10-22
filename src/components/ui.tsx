import { motion, useInView, type HTMLMotionProps } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { TextEffect } from './ui/text-effect'
import VerticalCutReveal, { type VerticalCutRevealRef } from './fancy/text/vertical-cut-reveal'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export function Tag({ children, className }: { children: string; className?: string }) {
  const wrap = useRef<HTMLSpanElement>(null)
  const reveal = useRef<VerticalCutRevealRef>(null)
  const inView = useInView(wrap, { once: true, margin: '0px 0px -8% 0px' })

  useEffect(() => {
    if (inView) reveal.current?.startAnimation()
  }, [inView])

  return (
    <motion.span
      ref={wrap}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cx(
        'label inline-flex w-fit items-center rounded-none border-l-2 border-l-white/80 bg-[#1a1a1a] px-3 py-2 text-fg',
        className,
      )}
    >
      <VerticalCutReveal
        ref={reveal}
        autoStart={false}
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="first"
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.2 }}
      >
        {children}
      </VerticalCutReveal>
    </motion.span>
  )
}

export function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cx('size-3.5', className)} aria-hidden>
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cx('size-3.5', className)} aria-hidden>
      <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type ButtonProps = {
  children: ReactNode
  href?: string
  variant?: 'light' | 'dark'
  className?: string
}

export function Button({ children, href = '/contact', variant = 'dark', className }: ButtonProps) {
  return (
    <a
      href={href}
      className={cx(
        'group inline-flex h-11 items-center gap-3 rounded-[10px] pl-4 pr-1.5 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-300',
        variant === 'light'
          ? 'box-border border border-[#8b8f98] bg-fg text-ink hover:bg-white'
          : 'border border-line-2 bg-surface-2 text-fg hover:border-white/20 hover:bg-surface-3',
        className,
      )}
    >
      {children}
      <span
        className={cx(
          'grid size-8 place-items-center overflow-hidden rounded-[7px]',
          variant === 'light' ? 'bg-ink/[0.16]' : 'bg-white/[0.06]',
        )}
      >
        <span className="relative block size-3.5 overflow-hidden">
          <Chevron className="absolute inset-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-[140%]" />
          <Chevron className="absolute inset-0 -translate-x-[140%] transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
        </span>
      </span>
    </a>
  )
}

type AnimatedTextProps = {
  children: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'blockquote'
  className?: string
  preset?: 'fade' | 'slide' | 'blur' | 'scale' | 'fade-in-blur'
  per?: 'word' | 'char' | 'line'
  speed?: number
  delay?: number
}

/** Library text reveal (Motion Primitives TextEffect), fired once when scrolled into view. Reserves its space beforehand so nothing jumps. */
export function AnimatedText({ children, as = 'p', className, preset = 'slide', per = 'word', speed = 2.4, delay = 0 }: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const Tag = as
  return (
    <span ref={ref} className="block">
      {inView ? (
        <TextEffect as={as} per={per} preset={preset} speedReveal={speed} delay={delay} className={className}>
          {children}
        </TextEffect>
      ) : (
        <Tag aria-hidden className={cx(className, 'invisible')}>
          {children}
        </Tag>
      )}
    </span>
  )
}

export function SectionHead({
  tag,
  title,
  titleMuted,
  desc,
  align = 'left',
  className,
}: {
  tag: string
  title: string
  titleMuted?: string
  desc?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cx('flex flex-col gap-5', align === 'center' && 'items-center text-center', className)}>
      <Tag>{tag}</Tag>
      <h2 className="font-display max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] font-[460] text-balance">
        <AnimatedText as="span" className="block" delay={0.1}>
          {title}
        </AnimatedText>
        {titleMuted && (
          <AnimatedText as="span" className="block text-mute" delay={0.3}>
            {titleMuted}
          </AnimatedText>
        )}
      </h2>
      {desc && (
        <AnimatedText
          preset="fade"
          speed={4}
          delay={0.2}
          className={cx('max-w-[52ch] text-[16px] leading-relaxed text-mute text-pretty', align === 'center' && 'mx-auto')}
        >
          {desc}
        </AnimatedText>
      )}
    </div>
  )
}

export function Reveal({ delay = 0, y = 18, className, children, ...rest }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Image or video slot. When `video` is set and loads, it replaces the still. */
export function Media({
  src,
  video,
  alt = '',
  className,
  imgClassName,
  eager,
}: {
  src: string
  video?: string
  alt?: string
  className?: string
  imgClassName?: string
  eager?: boolean
}) {
  return (
    <div className={cx('relative overflow-hidden', className)}>
      {video ? (
        <video
          src={video}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          className={cx('h-full w-full object-cover', imgClassName)}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={cx('h-full w-full object-cover', imgClassName)}
        />
      )}
    </div>
  )
}

export function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-amber" fill="none" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-dim" fill="none" aria-hidden>
      <path d="M4.5 8h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
