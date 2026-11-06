// Product pages at /products/:slug. Products are named by the job they do.
// `menuName` is the short label for the navbar; `name` is the title used on the landing section and the page.
// Market facts come from public vendor and industry reports; edit any copy here.

export type ProductDetail = {
  slug: string
  /** Old URLs that should still open this product. */
  aliases?: string[]
  name: string
  menuName: string
  /** Placeholder image set in /public/media/products, e.g. 'product-two' for product-two-hero.webp. */
  imageKey: string
  status: string
  category: string
  tagline: string
  /** One line for cards. */
  blurb: string
  /** A few words for the navbar menu. */
  menuDesc: string
  intro: string
  url?: string
  /** What the product is, in plain words. */
  about: string[]
  problem: { title: string; lead: string; points: { title: string; desc: string }[] }
  stats: { value: string; label: string }[]
  features: { title: string; desc: string; icon: string }[]
  pros: string[]
  cons: string[]
  /** Quick facts shown as a table: stage, market, pricing, why now, alternatives. */
  facts: { label: string; value: string }[]
  audience: string[]
  steps: { title: string; desc: string }[]
  faqs: { q: string; a: string }[]
}

export const productsDetail: ProductDetail[] = [
  {
    slug: 'ai-ecommerce-platform',
    aliases: ['softunebd', 'ai-business-suite'],
    name: 'AI E-commerce Platform',
    menuName: 'E-commerce',
    menuDesc: 'Online store platform',
    imageKey: 'softunebd',
    status: 'Live',
    category: 'Online store platform',
    tagline: 'Sell online, built for Bangladesh',
    blurb: 'A complete platform for running an online store: products, orders, payments and delivery.',
    intro:
      'Our first product, live since 2021. A complete platform for running an online store: your storefront, products, orders, payments and delivery, all managed from one place.',
    url: 'https://softunebd.com',
    about: [
      'AI E-commerce Platform gives a business everything it needs to sell online. Customers browse the storefront, place orders and pay. Your team manages products, stock, orders and delivery from a single dashboard.',
      'It is built and run by the ENUVOR team, and has been live since 2021. It is made for how selling online works in Bangladesh, with local payment and delivery options in mind.',
    ],
    problem: {
      title: 'Selling online is harder than it looks',
      lead: 'Many businesses start on social media pages and chat messages, then struggle as orders grow.',
      points: [
        { title: 'Orders scattered across chats', desc: 'Orders arrive in messages and comments, so some get missed and nobody has one clear list of what to ship.' },
        { title: 'Stock and prices out of sync', desc: 'Without one catalog, items are sold that are already out of stock, and prices differ between channels.' },
        { title: 'Payment and delivery by hand', desc: 'Confirming payments and arranging couriers one order at a time takes hours every day.' },
      ],
    },
    stats: [
      { value: '2021', label: 'Launched' },
      { value: 'Live', label: 'In production today' },
      { value: 'BD', label: 'Built for Bangladesh' },
    ],
    features: [
      { title: 'Online storefront', desc: 'A fast, mobile-friendly store where customers browse and order.', icon: 'Store' },
      { title: 'Products and stock', desc: 'One catalog with prices, variants and stock levels that stay in sync.', icon: 'Boxes' },
      { title: 'Orders and checkout', desc: 'A simple checkout, and one list of every order with its status.', icon: 'ShoppingCart' },
      { title: 'Payments and delivery', desc: 'Local payment methods and courier options for getting orders to customers.', icon: 'Truck' },
      { title: 'Customers and offers', desc: 'Customer accounts, order history, discounts and promotions.', icon: 'Users' },
      { title: 'Sales reports', desc: 'See what sells, what is running low and how the store is doing.', icon: 'BarChart3' },
    ],
    pros: [
      'Everything for selling online in one platform',
      'One catalog, so stock and prices stay consistent',
      'Orders, payments and delivery managed in one place',
      'Built and supported by the team that made it',
      'Live and in use since 2021',
    ],
    cons: [
      'Built for online selling, not a full back-office system',
      'Best for stores that sell mainly in Bangladesh',
      'Custom integrations are quoted separately',
    ],
    facts: [
      { label: 'Stage', value: 'Live since 2021' },
      { label: 'Best for', value: 'Businesses that want to sell online with their own store' },
      { label: 'Pricing', value: 'Quoted in writing after a short call about your store' },
      { label: 'Alternatives', value: 'Social media selling, Shopify, WooCommerce, custom-built stores' },
    ],
    audience: ['Online shops', 'Retail brands', 'Fashion and lifestyle sellers', 'Growing home businesses'],
    steps: [
      { title: 'Talk to us', desc: 'A short call about what you sell and how you sell today.' },
      { title: 'Set up', desc: 'We add your products, payments and delivery options.' },
      { title: 'Go live', desc: 'Launch your store with training for your team.' },
      { title: 'Grow', desc: 'Add offers, channels and features as sales grow.' },
    ],
    faqs: [
      { q: 'Is it part of ENUVOR?', a: 'Yes. It is our first product, built and run by ENUVOR.' },
      { q: 'Can I move my existing products over?', a: 'Yes. We can import your product list and customer data when we set up your store.' },
      { q: 'How is it priced?', a: 'You get a written quote after a short call about your store.' },
    ],
  },
]

export const productBySlug = (slug?: string) => productsDetail.find((p) => p.slug === slug || p.aliases?.includes(slug ?? ''))

const productLandingImages: Record<string, string> = {
  softunebd: '/media/product-01.webp',
  'product-two': '/media/product-02.webp',
  'product-three': '/media/product-03.webp',
  'product-four': '/media/product-04.webp',
}

export const productMedia = (key: string) => ({
  hero: productLandingImages[key] ?? `/media/products/${key}-hero.webp`,
  /** Each product has six transparent feature visuals in its own folder. */
  card: (n: number) => `/media/products/${key}/features/${n}.webp`,
})
