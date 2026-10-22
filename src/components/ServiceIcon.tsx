import { cn } from '@/lib/utils'

/** Service line icons live in /public/icons as black-stroke SVGs. Masking them lets the icon take the current text colour. */
export default function ServiceIcon({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-6 bg-current', className)}
      style={{
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  )
}
