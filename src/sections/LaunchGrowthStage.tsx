import { motion } from 'motion/react'
import OrbitImages from '@/components/bits/OrbitImages'

const lifecycleIcons = [
  { src: '/media/process-icons/launch.webp', alt: 'Go live' },
  { src: '/media/process-icons/monitor.webp', alt: 'Monitor' },
  { src: '/media/process-icons/improve.webp', alt: 'Maintain' },
  { src: '/media/process-icons/roadmap.webp', alt: 'Roadmap' },
  { src: '/media/process-icons/grow.webp', alt: 'Grow' },
  { src: '/media/process-icons/schedule.webp', alt: 'Schedule' },
]

export default function LaunchGrowthStage() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden">
      <OrbitImages
        images={lifecycleIcons}
        altPrefix="Launch and growth"
        shape="ellipse"
        baseWidth={920}
        radiusX={350}
        radiusY={118}
        rotation={-5}
        duration={18}
        itemSize={72}
        width="92%"
        height="88%"
        showPath
        pathColor="rgba(255,255,255,.15)"
        pathWidth={1}
        pathDash={0}
        depth={0.66}
        itemRadius={18}
        shadow={0.12}
        hoverScale={1.08}
        hoverSpeed={0.2}
        draggable
        clickToFront
        intro={false}
        showLabels
        centerContent={
          <motion.div
            className="relative grid size-[132px] place-items-center"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="absolute inset-2 bg-[radial-gradient(circle,rgba(245,154,35,.14),transparent_68%)] blur-lg" />
            <motion.img
              src="/brand/enuvor-mark-256.png"
              alt="ENUVOR"
              className="relative h-[104px] w-[104px] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,.55)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        }
      />
    </div>
  )
}
