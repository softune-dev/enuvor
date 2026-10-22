// Generates placeholder media. Replace any file in public/media with your own using the same name.
import sharp from 'sharp'
import fs from 'node:fs'

const out = 'public/media'
fs.mkdirSync(out, { recursive: true })

const mark = '_source-logos/Polished Blue-Gold Arch Emblem.png'
await sharp(mark).resize(1100).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(`${out}/hero-3d.png`)
await sharp(mark).resize(900).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(`${out}/footer-3d.png`)
await sharp(mark).resize(96).png().toFile('public/brand/enuvor-mark-96.png')
await sharp(mark).resize(256).png().toFile('public/brand/enuvor-mark-256.png')

const ph = (name, w, h, label, tone = 0) => {
  const hue = ['#16171b', '#141619', '#17161a', '#131518'][tone % 4]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1d1f24"/><stop offset="1" stop-color="${hue}"/>
    </linearGradient>
    <pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="28" stroke="#ffffff" stroke-opacity="0.025" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#p)"/>
  <rect x="24" y="${h - 58}" rx="6" width="${label.length * 9.2 + 24}" height="34" fill="#000" fill-opacity="0.35" stroke="#fff" stroke-opacity="0.08"/>
  <text x="36" y="${h - 36}" font-family="Consolas, monospace" font-size="14" fill="#8a8d96" letter-spacing="1">${label}</text>
</svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 70, mozjpeg: true }).toFile(`${out}/${name}`)
}

const files = [
  ['hero-bg.jpg', 1920, 1080],
  ['founder.jpg', 400, 400],
  ['product-01.jpg', 1200, 900],
  ['product-02.jpg', 1200, 900],
  ['product-03.jpg', 1200, 900],
  ['work-01.jpg', 1200, 900],
  ['work-02.jpg', 1200, 900],
  ['work-03.jpg', 1200, 900],
  ['service-01.jpg', 900, 900],
  ['service-02.jpg', 900, 900],
  ['service-03.jpg', 900, 900],
  ['service-04.jpg', 900, 900],
  ['process-01.jpg', 900, 700],
  ['process-02.jpg', 900, 700],
  ['process-03.jpg', 900, 700],
  ['showreel-poster.jpg', 1920, 1080],
  ['menu-feature.jpg', 600, 600],
  ['menu-services.jpg', 480, 640],
  ['avatar-01.jpg', 200, 200],
  ['avatar-02.jpg', 200, 200],
  ['avatar-03.jpg', 200, 200],
]
await Promise.all(files.map(([n, w, h], i) => ph(n, w, h, `${n.toUpperCase()} · ${w}×${h}`, i)))
console.log('done')
