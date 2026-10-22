// Every image/video on the landing page is referenced from here.
// To swap a placeholder, drop your file into /public/media with the SAME name - no code change needed.
// To use a video instead of a still, put the .mp4 in /public/media and set the matching `*Video` path.

export const media = {
  hero3d: '/media/hero-3d.png', // single-image fallback / video poster for the mark
  heroPart1: '/media/part-1.png', // the arch, transparent PNG on a 1100×1100 canvas
  heroPart2: '/media/part-2.png', // the pillar, same canvas and alignment so the two stack into the full mark
  heroBg: '/media/hero-bg.jpg', // atmospheric backdrop, 1920×1080 (film grain sits on top)
  footerBg: '/media/footer-bg.webp', // call-to-action backdrop above the footer, ~2200px wide
  hero3dVideo: '', // e.g. '/media/hero-3d.mp4' (transparent .webm also works)
  footer3d: '/media/footer-3d.png',
  footer3dVideo: '', // e.g. '/media/footer-3d.mp4'
  founder: '/media/founder.jpg',
  clarissa: '/media/clarissa-contact.png',
  menuFeature: '/media/menu-feature.jpg',
  menuServices: '/media/menu-services.jpg', // right-hand image in the Services dropdown, ~480×640
  showreel: '/media/showreel.mp4',
  showreelPoster: '/media/showreel-poster.jpg',
  products: ['/media/product-01.jpg', '/media/product-02.jpg', '/media/product-03.jpg'],
  work: ['/media/work-01.jpg', '/media/work-02.jpg', '/media/work-03.jpg'],
  services: ['/media/service-01.png', '/media/service-02.png', '/media/service-03.png', '/media/service-04.png'],
  serviceComponents: [
    '/media/service-components/engineering.png',
    '/media/service-components/commerce.png',
    '/media/service-components/automation.png',
    '/media/service-components/motion-marketing.png',
  ],
  process: [
    '/media/process-discover.png',
    '/media/process-design-build.png',
    '/media/process-launch-grow.png',
  ],
  avatars: [
    '/media/testimonial-client-01.png',
    '/media/testimonial-client-02.png',
    '/media/testimonial-client-03.png',
  ],
  mark: '/brand/enuvor-mark-96.png',
  markLarge: '/brand/enuvor-mark-256.png',
}
