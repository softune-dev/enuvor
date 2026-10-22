import LogoLoop from '@/components/bits/LogoLoop'

const clientLogos = [
  ['Northwind', '/media/clients/northwind.svg'],
  ['Halcyon', '/media/clients/halcyon.svg'],
  ['Kestrel', '/media/clients/kestrel.svg'],
  ['Lumen & Co', '/media/clients/lumen-co.svg'],
  ['Parallax', '/media/clients/parallax.svg'],
  ['Orbitra', '/media/clients/orbitra.svg'],
  ['Vantage', '/media/clients/vantage.svg'],
  ['Monolith', '/media/clients/monolith.svg'],
  ['Atlas Pay', '/media/clients/atlas-pay.svg'],
  ['Fieldnote', '/media/clients/fieldnote.svg'],
] as const

export default function Clients() {
  return (
    <section className="border-y border-line py-10">
      <p className="label mb-8 text-center text-mute">Trusted by teams across industries</p>
      <LogoLoop
        logos={clientLogos.map(([title, src]) => ({ src, alt: title, title }))}
        speed={40}
        gap={84}
        logoHeight={44}
        fadeOut
        fadeOutColor="#08090b"
        pauseOnHover={false}
        ariaLabel="Clients"
      />
    </section>
  )
}
