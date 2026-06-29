import { getCollection } from 'astro:content';
import { siteDefaults } from '../config/site-defaults';
import type { SiteSettings } from '../types/site';

export async function getSiteSettings(): Promise<SiteSettings> {
  const entries = await getCollection('site');
  const match = entries.find((e) => e.id === 'settings') ?? entries[0];

  if (!match?.data) return siteDefaults;

  const data = match.data;
  return {
    ...siteDefaults,
    ...data,
    currency: { ...siteDefaults.currency, ...data.currency },
    seo: { ...siteDefaults.seo, ...data.seo },
    navLinks: data.navLinks ?? siteDefaults.navLinks,
    footerColumns: data.footerColumns ?? siteDefaults.footerColumns,
  };
}
