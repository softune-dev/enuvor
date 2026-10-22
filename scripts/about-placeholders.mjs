// Placeholder images for /about. Replace any file in public/media/about with your own using the same name.
import sharp from 'sharp'
import fs from 'node:fs'

const out = 'public/media/about'
fs.mkdirSync(`${out}/team`, { recursive: true })
const ph = (name, w, h) => {
  const label = `ABOUT/${name.toUpperCase()} · ${w}×${h}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d1f24"/><stop offset="1" stop-color="#131518"/></linearGradient><pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="28" stroke="#ffffff" stroke-opacity="0.025" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#p)"/><rect x="20" y="${h - 52}" width="${label.length * 9.2 + 24}" height="32" fill="#000" fill-opacity="0.35" stroke="#fff" stroke-opacity="0.08"/><text x="32" y="${h - 31}" font-family="Consolas, monospace" font-size="14" fill="#8a8d96" letter-spacing="1">${label}</text></svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 70, mozjpeg: true }).toFile(`${out}/${name}`)
}
await Promise.all([
  ph('hero.jpg', 1600, 1200),
  ph('studio.jpg', 1920, 900),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ph(`team/member-${n}.jpg`, 800, 1000)),
])
console.log('done')
