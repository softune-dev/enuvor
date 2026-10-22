import { lazy, Suspense } from 'react'
import PageShell from '@/components/PageShell'
import Clients from '@/sections/Clients'
import Faq from '@/sections/Faq'
import Hero from '@/sections/Hero'
import Manifesto from '@/sections/Manifesto'
import Pricing from '@/sections/Pricing'
import Process from '@/sections/Process'
import Products from '@/sections/Products'
import Services from '@/sections/Services'
import Stats from '@/sections/Stats'
import Testimonials from '@/sections/Testimonials'
import WhyUs from '@/sections/WhyUs'

// Loaded on demand: the bento pulls in WebGL and physics code the first screen does not need
const Bento = lazy(() => import('@/sections/Bento'))
import Work from '@/sections/Work'

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <Clients />
      <Manifesto />
      <Products />
      <Services />
      <Suspense fallback={<div className="min-h-[900px]" />}>
        <Bento />
      </Suspense>
      <Work />
      <Process />
      <Testimonials />
      <Stats />
      <Pricing />
      <WhyUs />
      <Faq />
    </PageShell>
  )
}
