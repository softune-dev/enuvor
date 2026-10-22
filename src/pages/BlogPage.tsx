import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import PageShell from '@/components/PageShell'
import { AnimatedText, Chevron, Tag } from '@/components/ui'
import { blogCategories, formatDate, postCover, posts, type Post } from '@/data/blog'

const EASE = [0.16, 1, 0.3, 1] as const

export default function BlogPage() {
  const [cat, setCat] = useState('All')
  const [featured, ...rest] = posts
  const list = cat === 'All' ? rest : posts.filter((p) => p.category === cat)

  return (
    <PageShell>
      <section className="container-x pb-10 pt-24 md:pt-28">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          aria-label="Breadcrumb"
          className="label flex items-center gap-2 text-dim"
        >
          <a href="/" className="transition-colors hover:text-fg">Home</a>
          <span>/</span>
          <span className="text-fg-2">Blog</span>
        </motion.nav>
        <div className="mt-6 flex flex-col gap-6">
          <Tag>Journal</Tag>
          <h1 className="font-display max-w-[16ch] text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.95] font-[470]">
            <AnimatedText as="span" className="block" speed={1.6} delay={0.45}>
              Notes from the studio.
            </AnimatedText>
          </h1>
          <AnimatedText preset="fade" speed={4} delay={0.7} className="max-w-[48ch] text-[18px] leading-relaxed text-fg-2">
            What we learn building our own products and shipping for clients, written down plainly.
          </AnimatedText>
        </div>
      </section>

      <section className="container-x pb-16">
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(6% 6% 6% 6% round 22px)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
          transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
        >
          <a
            href={`/blog/${featured.slug}`}
            className="corner-hit [--shine:220px] group grid gap-2 rounded-[22px] border border-line bg-surface p-2 transition-colors duration-300 hover:border-line-2 lg:grid-cols-[1.3fr_1fr]"
          >
            <div className="aspect-[16/10] overflow-hidden rounded-[16px]">
              <img src={postCover(featured.slug)} alt="" className="h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col justify-between gap-8 p-5 md:p-8">
              <div className="flex flex-col gap-4">
                <span className="label text-amber">Featured · {featured.category}</span>
                <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.02] font-[480] text-balance">{featured.title}</h2>
                <p className="max-w-[42ch] text-[16px] leading-relaxed text-mute">{featured.excerpt}</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Meta p={featured} />
                <Chevron className="text-dim transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-fg" />
              </div>
            </div>
          </a>
        </motion.div>
      </section>

      <section className="container-x pb-24 md:pb-32">
        <div className="mb-8 flex flex-wrap gap-2 border-t border-line pt-8">
          {blogCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`label rounded-[10px] border px-4 py-2.5 text-[12px]! transition-colors ${
                cat === c ? 'border-fg bg-fg text-ink' : 'border-line bg-surface text-fg-2 hover:border-line-2 hover:text-fg'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <PostCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </PageShell>
  )
}

export function Meta({ p }: { p: Post }) {
  return (
    <p className="label text-dim">
      {formatDate(p.date)} · {p.readTime} read
    </p>
  )
}

export function PostCard({ p }: { p: Post }) {
  return (
    <a
      href={`/blog/${p.slug}`}
      className="corner-hit [--shine:80px] group flex h-full flex-col rounded-[18px] border border-line bg-surface p-2 transition-colors duration-300 hover:border-line-2"
    >
      <div className="aspect-[16/10] overflow-hidden rounded-[12px]">
        <img src={postCover(p.slug)} alt="" loading="lazy" className="h-full w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="label text-amber">{p.category}</span>
        <h3 className="font-display text-[22px] leading-[1.1] font-[500] text-balance">{p.title}</h3>
        <p className="line-clamp-2 text-[14.5px] leading-relaxed text-mute">{p.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <Meta p={p} />
          <Chevron className="text-dim transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-fg" />
        </div>
      </div>
    </a>
  )
}
