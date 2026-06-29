import type { SiteSettings } from '../types/site';

export const siteDefaults: SiteSettings = {
  brandName: 'kujera',
  tagline: 'Sleek, modern furniture for contemporary living',
  currency: { code: 'USD', symbol: '$' },
  navLinks: [
    { label: 'Shop', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footerColumns: [
    {
      title: 'Categories',
      links: [
        { label: 'Chairs', href: '/shop/chair' },
        { label: 'Beds', href: '/shop/beds' },
        { label: 'Furnishings', href: '/shop/soft-furnishings' },
        { label: 'Accents', href: '/shop/accents' },
      ],
    },
  ],
  seo: {
    titleTemplate: '%s · Kujera',
    defaultDescription: 'Transform your space with sleek, modern furniture from Kujera.',
    ogImage: '/assets/hero-image.png',
  },
  copyright: 'Copyright © 2023',
};
