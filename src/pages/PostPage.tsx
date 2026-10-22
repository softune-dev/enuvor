import { motion, useScroll } from 'motion/react'
import { useParams } from 'react-router'
import NotFound from '@/pages/NotFound'
import PageShell from '@/components/PageShell'
import { AnimatedText, Reveal, SectionHead, Tag } from '@/components/ui'
import { postBySlug, postCover, posts } from '@/data/blog'
import { Meta, PostCard } from '@/pages/BlogPage'

const EASE = [0.16, 1, 0.3, 1] as const

export default function PostPage() {
  const { slug } = useParams()
  const post = postBySlug(slug)
  const { scrollYProgress } = useScroll()
  if (!post) return <NotFound />

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <PageShell>
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-40 h-px origin-left bg-amber" />

      <article>
        <header className="container-x pb-12 pt-24 md:pt-28">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            aria-label="Breadcrumb"
            className="label flex flex-wrap items-center gap-2 text-dim"
          >
            <a href="/" className="transition-colors hover:text-fg">Home</a>
            <span>/</span>
            <a href="/blog" className="transition-colors hover:text-fg">Blog</a>
            <span>/</span>
            <span className="text-fg-2">{post.category}</span>
          </motion.nav>
          <div className="mx-auto mt-10 flex max-w-[860px] flex-col items-start gap-6">
            <Tag>{post.category}</Tag>
            <h1 className="font-display text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[0.98] font-[470] text-balance">
              <AnimatedText as="span" className="block" speed={1.6} delay={0.45}>
                {post.title}
              </AnimatedText>
            </h1>
            <AnimatedText preset="fade" speed={4} delay={0.7} className="max-w-[52ch] text-[18px] leading-relaxed text-fg-2">
              {post.excerpt}
            </AnimatedText>
            <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <div>
                <p className="text-[15px] text-fg">{post.author.name}</p>
                <p className="text-[13px] text-mute">{post.author.role}</p>
              </div>
              <Meta p={post} />
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(6% 6% 6% 6% round 22px)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
          transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
          className="container-x"
        >
          <div className="corner-hit [--shine:220px] rounded-[22px] border border-line bg-surface p-2">
            <div className="aspect-[16/8] overflow-hidden rounded-[16px]">
              <img src={postCover(post.slug)} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </motion.div>

        <div className="container-x py-16 md:py-24">
          <div className="mx-auto flex max-w-[680px] flex-col gap-10">
            {post.body.map((b, i) => (
              <Reveal key={i}>
                {b.heading && <h2 className="font-display mb-4 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] font-[500]">{b.heading}</h2>}
                <p className={`leading-[1.75] text-fg-2 ${i === 0 ? 'text-[20px]' : 'text-[17px]'}`}>{b.text}</p>
              </Reveal>
            ))}
            <div className="flex items-center justify-between border-t border-line pt-6">
              <a href="/blog" className="label text-fg-2 transition-colors hover:text-fg">Back to blog</a>
              <a href="/contact" className="label text-amber transition-colors hover:text-amber-2">Work with us</a>
            </div>
          </div>
        </div>
      </article>

      <section className="container-x pb-24 md:pb-32">
        <SectionHead tag="Keep reading" title="More from the journal" className="mb-12" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <PostCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
