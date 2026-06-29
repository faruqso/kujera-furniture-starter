import { useEffect, useState, useCallback } from 'preact/hooks';
import { ui } from '../../i18n/ui';
import { formatPrice } from '../../lib/i18n';
import {
  type CartItem,
  loadCart,
  saveCart,
  getCartCount,
  getCartSubtotal,
  addToCart,
  updateQuantity,
  removeFromCart,
  syncCartBadge,
} from '../../lib/cart-store';

interface Props {
  currencySymbol: string;
}

export default function CartRoot({ currencySymbol }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback((next: CartItem[]) => {
    setItems(next);
    saveCart(next);
    syncCartBadge(getCartCount(next));
  }, []);

  useEffect(() => {
    const initial = loadCart();
    setItems(initial);
    syncCartBadge(getCartCount(initial));

    const onAdd = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      refresh(addToCart(loadCart(), detail));
      setOpen(true);
    };

    const onOpen = () => setOpen(true);

    window.addEventListener('cart:add', onAdd);
    document.querySelectorAll('[data-cart-open]').forEach((el) => {
      el.addEventListener('click', onOpen);
    });

    return () => {
      window.removeEventListener('cart:add', onAdd);
    };
  }, [refresh]);

  const subtotal = getCartSubtotal(items);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <div
        class={`cart-overlay ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside class={`cart-drawer ${open ? 'is-open' : ''}`} aria-label={ui.cart} aria-hidden={!open}>
        <div class="cart-drawer__header">
          <h2>{ui.cart}</h2>
          <button type="button" class="cart-drawer__close" onClick={() => setOpen(false)} aria-label={ui.close}>
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p class="cart-drawer__empty">{ui.cartEmpty}</p>
        ) : (
          <>
            <ul class="cart-drawer__items">
              {items.map((item) => (
                <li key={`${item.slug}:${item.variantId}`} class="cart-item">
                  <img src={item.image} alt="" class="cart-item__image" />
                  <div class="cart-item__info">
                    <div class="cart-item__title">{item.title}</div>
                    <div class="cart-item__price">
                      {formatPrice(item.price, currencySymbol)}
                    </div>
                    <div class="cart-item__qty">
                      <span class="cart-item__qty-label">{ui.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          refresh(updateQuantity(loadCart(), item.slug, item.variantId, item.quantity - 1))
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          refresh(updateQuantity(loadCart(), item.slug, item.variantId, item.quantity + 1))
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      class="cart-item__remove"
                      onClick={() => refresh(removeFromCart(loadCart(), item.slug, item.variantId))}
                    >
                      {ui.remove}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div class="cart-drawer__footer">
              <div class="cart-drawer__subtotal">
                <span>{ui.cartSubtotal}</span>
                <span>{formatPrice(subtotal, currencySymbol)}</span>
              </div>
              <button
                type="button"
                class="btn btn--primary btn--md cart-drawer__checkout"
                onClick={() => {
                  showToast(ui.checkoutDemo);
                }}
              >
                {ui.checkout}
              </button>
            </div>
          </>
        )}
      </aside>

      {toast && <div class="cart-toast" role="status">{toast}</div>}

      <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: var(--color-surface-overlay);
          z-index: calc(var(--z-drawer) - 1);
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--duration-normal) var(--ease-default);
        }
        .cart-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }
        .cart-drawer {
          position: fixed;
          top: 0;
          inset-inline-end: 0;
          width: min(24rem, 100vw);
          height: 100vh;
          background: var(--color-surface);
          z-index: var(--z-drawer);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform var(--duration-normal) var(--ease-default);
          box-shadow: var(--shadow-lg);
        }
        .cart-drawer.is-open {
          transform: translateX(0);
        }
        .cart-drawer__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .cart-drawer__header h2 {
          font-size: var(--text-xl);
        }
        .cart-drawer__close {
          font-size: var(--text-2xl);
          line-height: 1;
          padding: var(--space-2);
        }
        .cart-drawer__empty {
          padding: var(--space-8);
          color: var(--color-text-muted);
          text-align: center;
        }
        .cart-drawer__items {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4);
        }
        .cart-item {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--color-border);
        }
        .cart-item__image {
          width: 4rem;
          height: 4rem;
          object-fit: cover;
          border-radius: var(--radius-md);
        }
        .cart-item__title {
          font-weight: var(--weight-medium);
          margin-bottom: var(--space-1);
        }
        .cart-item__price {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--space-2);
        }
        .cart-item__qty {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
        }
        .cart-item__qty button {
          width: 1.75rem;
          height: 1.75rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .cart-item__remove {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: var(--space-2);
          text-decoration: underline;
        }
        .cart-drawer__footer {
          padding: var(--space-6);
          border-top: 1px solid var(--color-border);
        }
        .cart-drawer__subtotal {
          display: flex;
          justify-content: space-between;
          font-weight: var(--weight-semibold);
          margin-bottom: var(--space-4);
        }
        .cart-drawer__checkout {
          width: 100%;
        }
        .cart-toast {
          position: fixed;
          bottom: var(--space-6);
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-surface-dark);
          color: var(--color-text-inverse);
          padding: var(--space-3) var(--space-6);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          z-index: var(--z-toast);
        }
      `}</style>
    </>
  );
}
