// Content for /privacy, /terms and /cookies. This is a starting draft, not legal advice:
// have it reviewed for your business and jurisdiction before going live.

export type LegalDoc = {
  slug: 'privacy' | 'terms' | 'cookies'
  title: string
  intro: string
  updated: string
  sections: { id: string; heading: string; body: string[] }[]
}

const contact = 'hello@enuvor.com'

export const legalDocs: LegalDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: 'How ENUVOR collects, uses and protects personal information when you use our website, products and services.',
    updated: '22 October 2026',
    sections: [
      {
        id: 'who-we-are',
        heading: 'Who we are',
        body: [
          'ENUVOR is a software studio and product company based in Dhaka, Bangladesh. In this policy, "we", "us" and "our" mean ENUVOR and the companies it owns, including SoftuneBD.',
          `If you have any question about this policy, email us at ${contact}.`,
        ],
      },
      {
        id: 'what-we-collect',
        heading: 'Information we collect',
        body: [
          'Information you give us: your name, email, company, budget and message when you contact us, subscribe to updates or apply for a role.',
          'Information collected automatically: device and browser details, pages visited and approximate location, through cookies and similar technologies. See our Cookie Policy for details.',
          'Information from clients: when we build or run systems for a client, we may process data on their behalf under a separate agreement.',
        ],
      },
      {
        id: 'how-we-use',
        heading: 'How we use information',
        body: [
          'To reply to enquiries, prepare proposals and deliver the work you ask for.',
          'To run, secure and improve our website and products.',
          'To send product news you have subscribed to. You can unsubscribe at any time.',
          'To meet legal, tax and accounting obligations.',
        ],
      },
      {
        id: 'sharing',
        heading: 'Sharing',
        body: [
          'We do not sell personal information. We share it only with service providers who help us run the business, such as hosting, email and analytics, under contracts that protect it.',
          'We may disclose information if the law requires it or to protect our rights and users.',
        ],
      },
      {
        id: 'retention',
        heading: 'Retention and security',
        body: [
          'We keep personal information only as long as needed for the purposes above or as the law requires, then delete or anonymise it.',
          'We use access controls, encryption in transit and regular reviews to protect data. No system is perfectly secure, but we work to keep risks low.',
        ],
      },
      {
        id: 'your-rights',
        heading: 'Your rights',
        body: [
          'Depending on where you live, you may have the right to access, correct, delete or export your data, and to object to or limit how we use it.',
          `To make a request, email ${contact}. We reply within 30 days.`,
        ],
      },
      {
        id: 'changes',
        heading: 'Changes to this policy',
        body: ['We may update this policy from time to time. The date at the top shows the latest version. Significant changes will be announced on this page.'],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    intro: 'The rules for using the ENUVOR website and our products. Client projects are also covered by their own written agreement.',
    updated: '22 October 2026',
    sections: [
      {
        id: 'acceptance',
        heading: 'Accepting these terms',
        body: ['By using this website or our products, you agree to these terms. If you do not agree, please do not use them.'],
      },
      {
        id: 'use',
        heading: 'Using the website',
        body: [
          'You may browse and share our content for personal, non-commercial use.',
          'You must not misuse the site, including trying to break its security, overload it or copy it at scale.',
        ],
      },
      {
        id: 'projects',
        heading: 'Client projects',
        body: [
          'Proposals and estimates on this site are not binding. Each project is governed by a signed agreement that sets scope, price, timeline and ownership.',
          'Unless the agreement says otherwise, clients own the code and assets created for them once paid in full.',
        ],
      },
      {
        id: 'products',
        heading: 'Our products',
        body: ['Products such as SoftuneBD may have their own terms and plans. Where they do, those terms apply alongside these.'],
      },
      {
        id: 'ip',
        heading: 'Intellectual property',
        body: ['The ENUVOR name, logo, design and content on this site belong to ENUVOR or its licensors. Do not use them without our written permission.'],
      },
      {
        id: 'liability',
        heading: 'Liability',
        body: [
          'The website is provided "as is". We work to keep it accurate and available but cannot promise it will always be error free.',
          'To the extent the law allows, we are not liable for indirect or consequential losses arising from use of the site.',
        ],
      },
      {
        id: 'law',
        heading: 'Governing law',
        body: [`These terms are governed by the laws of Bangladesh. Questions? Email ${contact}.`],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    intro: 'What cookies are, which ones we use and how you can control them.',
    updated: '22 October 2026',
    sections: [
      {
        id: 'what',
        heading: 'What cookies are',
        body: ['Cookies are small text files stored on your device when you visit a website. They help the site work and tell us how it is used.'],
      },
      {
        id: 'essential',
        heading: 'Essential cookies',
        body: ['Needed for the site to work, such as remembering your cookie choice. They cannot be switched off.'],
      },
      {
        id: 'analytics',
        heading: 'Analytics cookies',
        body: ['Help us understand which pages are visited and how people move through the site, so we can improve it. Used only if you allow them.'],
      },
      {
        id: 'marketing',
        heading: 'Marketing cookies',
        body: ['Used to measure campaigns and show relevant ads on other platforms. Used only if you allow them.'],
      },
      {
        id: 'control',
        heading: 'Managing your choice',
        body: [
          'You can change your choice at any time with the "Cookie settings" button on this page, or block cookies in your browser settings.',
          'Blocking essential cookies may stop parts of the site from working.',
        ],
      },
    ],
  },
]

export const legalBySlug = (slug: string) => legalDocs.find((d) => d.slug === slug)
