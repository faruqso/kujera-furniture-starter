/** @deprecated Use direct paths — kept as a thin alias during de-i18n */
export function localizeHref(href: string): string {
  if (href.startsWith('http') || href.startsWith('#')) return href;
  return href.startsWith('/') ? href : `/${href}`;
}

export function formatPrice(amount: number, symbol: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}
