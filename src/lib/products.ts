import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export interface ResolvedProduct {
  slug: string;
  sku: string;
  collection: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants?: { id: string; label: string }[];
  tags: string[];
  inStock: boolean;
  featured: boolean;
  highlights?: string[];
  href: string;
}

export interface ResolvedCollection {
  slug: string;
  name: string;
  description: string;
  image?: string;
  featuredProductSlugs?: string[];
  href: string;
}

function buildProductHref(collection: string, slug: string): string {
  return `/shop/${collection}/${slug}`;
}

function buildCollectionHref(slug: string): string {
  return `/shop/${slug}`;
}

export function resolveProduct(master: CollectionEntry<'products'>): ResolvedProduct {
  const { slug, collection, sku, price, compareAtPrice, images, variants, tags, inStock, featured, title, description, highlights } =
    master.data;

  return {
    slug,
    sku,
    collection,
    title,
    description,
    price,
    compareAtPrice,
    images,
    variants,
    tags,
    inStock,
    featured,
    highlights,
    href: buildProductHref(collection, slug),
  };
}

export function resolveCollection(master: CollectionEntry<'shopCollections'>): ResolvedCollection {
  return {
    slug: master.data.slug,
    name: master.data.name,
    description: master.data.description,
    image: master.data.image,
    featuredProductSlugs: master.data.featuredProductSlugs,
    href: buildCollectionHref(master.data.slug),
  };
}

export async function getAllProducts(): Promise<ResolvedProduct[]> {
  const products = await getCollection('products');
  return products.map(resolveProduct);
}

export async function getProductBySlug(slug: string): Promise<ResolvedProduct | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export async function getAllCollections(): Promise<ResolvedCollection[]> {
  const collections = await getCollection('shopCollections');
  return collections.map(resolveCollection);
}

export async function getCollectionBySlug(slug: string): Promise<ResolvedCollection | undefined> {
  const collections = await getAllCollections();
  return collections.find((c) => c.slug === slug);
}

export async function getProductsForCollection(collectionSlug: string): Promise<ResolvedProduct[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.collection === collectionSlug);
}

export async function getRelatedProducts(product: ResolvedProduct, limit = 4): Promise<ResolvedProduct[]> {
  const all = await getAllProducts();
  const others = all.filter((p) => p.slug !== product.slug);

  const sameCollection = others.filter((p) => p.collection === product.collection);
  const rest = others.filter((p) => p.collection !== product.collection);
  const featuredRest = rest.filter((p) => p.featured);
  const otherRest = rest.filter((p) => !p.featured);

  return [...sameCollection, ...featuredRest, ...otherRest].slice(0, limit);
}

export async function getAllPages() {
  return getCollection('pages');
}

export async function getPageBySlug(slug: string) {
  const pages = await getAllPages();
  return pages.find((p) => p.data.slug === slug);
}
