export interface CartItem {
  slug: string;
  title: string;
  price: number;
  image: string;
  variantId: string;
  quantity: number;
}

const STORAGE_KEY = 'meridian-cart';

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addToCart(items: CartItem[], incoming: Omit<CartItem, 'quantity'> & { quantity?: number }): CartItem[] {
  const qty = incoming.quantity ?? 1;
  const key = `${incoming.slug}:${incoming.variantId}`;
  const existing = items.find((i) => `${i.slug}:${i.variantId}` === key);

  if (existing) {
    return items.map((i) =>
      `${i.slug}:${i.variantId}` === key ? { ...i, quantity: i.quantity + qty } : i,
    );
  }

  return [...items, { ...incoming, quantity: qty }];
}

export function updateQuantity(items: CartItem[], slug: string, variantId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeFromCart(items, slug, variantId);
  return items.map((i) =>
    i.slug === slug && i.variantId === variantId ? { ...i, quantity } : i,
  );
}

export function removeFromCart(items: CartItem[], slug: string, variantId: string): CartItem[] {
  return items.filter((i) => !(i.slug === slug && i.variantId === variantId));
}

export function syncCartBadge(count: number) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
    if (count > 0) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  });
}
