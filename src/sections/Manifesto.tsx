import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { Tag } from '@/components/ui'
import { manifesto } from '@/data/site'

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  )
}

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = manifesto.split(' ')

  return (
    <section id="about" className="container-x py-16 md:py-20">
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <div>
          <Tag>About ENUVOR</Tag>
        </div>
        <p ref={ref} className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.16] font-[430]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  )
}
