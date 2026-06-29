export interface UiLabels {
  cart: string;
  cartEmpty: string;
  cartSubtotal: string;
  checkout: string;
  checkoutDemo: string;
  addToCart: string;
  addedToCart: string;
  remove: string;
  quantity: string;
  inStock: string;
  outOfStock: string;
  shopAll: string;
  viewCollection: string;
  sortBy: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  filterAll: string;
  productsCount: string;
  sale: string;
  featured: string;
  close: string;
  designSystem: string;
  selectVariant: string;
  continueShopping: string;
  youMightAlsoLike: string;
}

export const ui: UiLabels = {
  cart: 'Cart',
  cartEmpty: 'Your cart is empty',
  cartSubtotal: 'Subtotal',
  checkout: 'Checkout',
  checkoutDemo: 'Checkout is demo-only — no payment processed',
  addToCart: 'Add to cart',
  addedToCart: 'Added to cart',
  remove: 'Remove',
  quantity: 'Qty',
  inStock: 'In stock',
  outOfStock: 'Out of stock',
  shopAll: 'Shop all',
  viewCollection: 'View collection',
  sortBy: 'Sort by',
  sortFeatured: 'Featured',
  sortPriceAsc: 'Price: low to high',
  sortPriceDesc: 'Price: high to low',
  filterAll: 'All',
  productsCount: '{count} products',
  sale: 'Sale',
  featured: 'Featured',
  close: 'Close',
  designSystem: 'Design system',
  selectVariant: 'Select size',
  continueShopping: 'Continue shopping',
  youMightAlsoLike: 'You might also like',
};

/** @deprecated Use `ui` directly */
export function getUiLabels(): UiLabels {
  return ui;
}

export function formatUiString(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}
