import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const buttonSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'secondary', 'ghost']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
});

const sectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('hero'),
    variant: z.enum(['default', 'compact', 'furniture']).optional(),
    eyebrow: z.string().optional(),
    headline: z.string(),
    subheadline: z.string().optional(),
    image: z.string().optional(),
    searchPlaceholder: z.string().optional(),
    buttons: z.array(buttonSchema).optional(),
  }),
  z.object({
    type: z.literal('whyChoosingUs'),
    titleLine1: z.string().optional(),
    titleLine2: z.string().optional(),
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        href: z.string().optional(),
        linkLabel: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal('bestSellingProducts'),
    headline: z.string().optional(),
    categories: z
      .array(z.object({ id: z.string(), label: z.string() }))
      .optional(),
    defaultCategory: z.string().optional(),
    viewAllHref: z.string().optional(),
    products: z.array(
      z.object({
        slug: z.string(),
        category: z.string(),
        label: z.string(),
        name: z.string(),
        price: z.number(),
        rating: z.number().min(0).max(5),
        image: z.string(),
      }),
    ),
  }),
  z.object({
    type: z.literal('experiences'),
    eyebrow: z.string().optional(),
    headline: z.string(),
    description: z.string(),
    href: z.string().optional(),
    linkLabel: z.string().optional(),
  }),
  z.object({
    type: z.literal('materials'),
    eyebrow: z.string().optional(),
    headline: z.string(),
    description: z.string(),
    href: z.string().optional(),
    linkLabel: z.string().optional(),
  }),
  z.object({
    type: z.literal('testimonials'),
    variant: z.literal('furniture').optional(),
    eyebrow: z.string().optional(),
    headline: z.string().optional(),
    items: z.array(
      z.object({
        quote: z.string(),
        author: z.string(),
        role: z.string().optional(),
        image: z.string().optional(),
        avatar: z.string().optional(),
        rating: z.number().min(0).max(5).optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal('cta'),
    eyebrow: z.string().optional(),
    headline: z.string(),
    subheadline: z.string().optional(),
    image: z.string().optional(),
    buttons: z.array(buttonSchema).optional(),
  }),
  z.object({
    type: z.literal('contact'),
    eyebrow: z.string().optional(),
    headline: z.string(),
    subheadline: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    hours: z.string().optional(),
  }),
  z.object({
    type: z.literal('richText'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('aboutHero'),
    eyebrow: z.string().optional(),
    headline: z.string(),
    subheadline: z.string().optional(),
    image: z.string(),
  }),
  z.object({
    type: z.literal('parallaxSection'),
    image: z.string(),
    eyebrow: z.string().optional(),
    headline: z.string(),
    description: z.string(),
    tone: z.enum(['light', 'dark']).optional(),
  }),
  z.object({
    type: z.literal('aboutSplit'),
    layout: z.enum(['image-left', 'image-right']).optional(),
    image: z.string(),
    eyebrow: z.string().optional(),
    headline: z.string(),
    description: z.string(),
    cta: buttonSchema.optional(),
  }),
  z.object({
    type: z.literal('aboutGallery'),
    eyebrow: z.string().optional(),
    headline: z.string(),
    description: z.string().optional(),
    images: z.array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
      }),
    ),
  }),
]);

const site = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site' }),
  schema: z.object({
    brandName: z.string(),
    tagline: z.string(),
    logo: z.string().optional(),
    currency: z.object({
      code: z.enum(['USD', 'EUR']),
      symbol: z.string(),
    }),
    navLinks: z.array(z.object({ label: z.string(), href: z.string() })),
    footerColumns: z.array(
      z.object({
        title: z.string(),
        links: z.array(z.object({ label: z.string(), href: z.string() })),
      }),
    ),
    footerAbout: z.string().optional(),
    footerStayConnectedTitle: z.string().optional(),
    socialLinks: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          icon: z.enum(['facebook', 'twitter', 'instagram']),
        }),
      )
      .optional(),
    legalLinks: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
    announcementBar: z
      .object({
        text: z.string(),
        href: z.string().optional(),
      })
      .optional(),
    seo: z.object({
      titleTemplate: z.string(),
      defaultDescription: z.string(),
      ogImage: z.string(),
    }),
    copyright: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/pages',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    sections: z.array(sectionSchema),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    slug: z.string(),
    sku: z.string(),
    collection: z.string(),
    title: z.string(),
    description: z.string(),
    price: z.number(),
    compareAtPrice: z.number().optional(),
    images: z.array(z.string()).min(1),
    variants: z
      .array(z.object({ id: z.string(), label: z.string() }))
      .optional(),
    tags: z.array(z.string()).default([]),
    inStock: z.boolean().default(true),
    featured: z.boolean().default(false),
    highlights: z.array(z.string()).optional(),
  }),
});

const shopCollections = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/collections' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string().optional(),
    featuredProductSlugs: z.array(z.string()).optional(),
  }),
});

export const collections = {
  site,
  pages,
  products,
  shopCollections,
};
