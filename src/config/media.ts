// Every image/video on the landing page is referenced from here.
// To swap a placeholder, drop your file into /public/media with the SAME name - no code change needed.
// To use a video instead of a still, put the .mp4 in /public/media and set the matching `*Video` path.

export const media = {
  hero3d: '/media/hero-3d.webp', // single-image fallback / video poster for the mark
  heroPart1: '/media/part-1.png', // the arch, transparent PNG on a 1100×1100 canvas
  heroPart2: '/media/part-2.png', // the pillar, same canvas and alignment so the two stack into the full mark
  heroBg: '/media/hero-bg.webp', // atmospheric backdrop, 1920×1080 (film grain sits on top)
  footerBg: '/media/footer-bg.webp', // call-to-action backdrop above the footer, ~2200px wide
  hero3dVideo: '', // e.g. '/media/hero-3d.mp4' (transparent .webm also works)
  footer3d: '/media/footer-3d.webp',
  footer3dVideo: '', // e.g. '/media/footer-3d.mp4'
  founder: '/media/founder.webp',
  clarissa: '/media/clarissa-contact.webp',
  clarissaVideo: '/media/vid-2-upper.mp4',
  menuFeature: '/media/menu-feature.webp',
  menuServices: '/media/menu-services.webp', // right-hand image in the Services dropdown, ~480×640
  showreel: '/media/showreel.mp4',
  showreelPoster: '/media/showreel-poster.webp',
  products: ['/media/product-01.webp', '/media/product-02.webp', '/media/product-03.webp'],
  work: ['/media/work-01.webp', '/media/work-02.webp', '/media/work-03.webp'],
  services: ['/media/service-01.webp', '/media/service-02.webp', '/media/service-03.webp', '/media/service-04.webp'],
  serviceComponents: [
    '/media/service-components/engineering.webp',
    '/media/service-components/commerce.webp',
    '/media/service-components/automation.webp',
    '/media/service-components/motion-marketing.webp',
  ],
  process: [
    '/media/process-discover.webp',
    '/media/process-design-build.webp',
    '/media/process-launch-grow.webp',
  ],
  avatars: [
    '/media/testimonial-client-01.webp',
    '/media/testimonial-client-02.webp',
    '/media/testimonial-client-03.webp',
  ],
  mark: '/brand/enuvor-mark-96.png',
  markLarge: '/brand/enuvor-mark-256.png',
}
