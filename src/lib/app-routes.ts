import {
  getAllPages,
  getAllProducts,
  getAllCollections,
  getProductBySlug,
  getCollectionBySlug,
} from './products';
import type { CollectionEntry } from 'astro:content';
import type { ResolvedProduct } from './products';

export type RouteKind =
  | { type: 'page'; page: CollectionEntry<'pages'> }
  | { type: 'shop-index' }
  | { type: 'collection'; collection: NonNullable<Awaited<ReturnType<typeof getCollectionBySlug>>> }
  | { type: 'product'; product: ResolvedProduct };

const cmsSlugsToSkip = new Set(['home']);

export async function getAllAppPaths() {
  const paths: Array<{ params: { slug?: string }; props: RouteKind }> = [];
  const pages = await getAllPages();

  for (const page of pages) {
    if (page.data.slug === 'home') continue;
    if (cmsSlugsToSkip.has(page.data.slug)) continue;

    paths.push({
      params: { slug: page.data.slug },
      props: { type: 'page', page },
    });
  }

  paths.push({
    params: { slug: 'shop' },
    props: { type: 'shop-index' },
  });

  const collections = await getAllCollections();
  for (const collection of collections) {
    paths.push({
      params: { slug: `shop/${collection.slug}` },
      props: { type: 'collection', collection },
    });

    const products = await getAllProducts();
    for (const product of products.filter((p) => p.collection === collection.slug)) {
      paths.push({
        params: { slug: `shop/${collection.slug}/${product.slug}` },
        props: { type: 'product', product },
      });
    }
  }

  return paths;
}
