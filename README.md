# ENUVOR — landing site

Vite + React 19 + TypeScript + Tailwind v4, with `motion` for animation and `lenis` for smooth scroll.
React Bits components (pulled from the registry, then restyled) live in `src/components/bits/`: `BlurText`, `CountUp`, `LogoLoop`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Replacing placeholders

Every image is a placeholder. To swap one, drop your file into `public/media/` **with the same name** and it shows up. No code changes needed.

| File | Where it shows | Suggested size |
| --- | --- | --- |
| `hero-3d.png` | Hero 3D object (transparent PNG) | ~1100px wide |
| `hero-bg.jpg` | Hero backdrop | 1920×1080 |
| `footer-3d.png` | Footer 3D object (transparent PNG) | ~900px wide |
| `founder.jpg` | Hero and FAQ "talk to us" cards | 400×400 |
| `menu-feature.jpg` | Services mega-menu feature card | 600×600 |
| `product-01..03.jpg` | Products section | 1200×900 |
| `service-01..04.jpg` | Services stack | 900×900 |
| `showreel-poster.jpg` | Showreel poster | 1920×1080 |
| `showreel.mp4` | Showreel video (until it exists, the button says "coming soon") | 1080p H.264 |
| `work-01..03.jpg` | Case studies | 1200×900 |
| `process-01..03.jpg` | Process steps | 900×700 |
| `avatar-01..03.jpg` | Testimonials | 200×200 |

**3D videos:** put `hero-3d.mp4` / `footer-3d.mp4` (or `.webm` with alpha) in `public/media`, then set `hero3dVideo` / `footer3dVideo` in `src/config/media.ts`.

The brand mark used in the navbar, favicon and menus is `public/brand/enuvor-mark-96.png` / `-256.png`. The original logo files are in `_source-logos/`.

## Editing copy

All text (menus, services, products, case studies, stats, FAQ, contact details) is in `src/data/site.ts`.

## Design tokens

Colors and fonts are defined in `src/index.css` under `@theme`:

- Display: **Archivo** (variable width) · Body: **Inter Tight** · Labels: **JetBrains Mono**
- Graphite surfaces from the dark half of the mark, `amber` (#F59A23) and `volt` (#2A6BFF) from the arch and pillar, used sparingly as accents.
