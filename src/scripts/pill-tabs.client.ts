import { bindTabIndicator, positionTabIndicator } from './tab-indicator';

const STORAGE_KEY = 'kujera-shop-category';

export function initPillTabsLinkMode() {
  document.querySelectorAll('[data-pill-tabs][data-pill-tabs-mode="link"]').forEach((tabsRoot) => {
    if (!(tabsRoot instanceof HTMLElement) || tabsRoot.dataset.initialized === 'true') return;
    tabsRoot.dataset.initialized = 'true';

    const indicator = tabsRoot.querySelector('.pill-tabs__indicator') as HTMLElement | null;
    const tabs = [...tabsRoot.querySelectorAll('[data-pill-tab]')] as HTMLElement[];
    if (!indicator || tabs.length === 0) return;

    const activeCategory = tabsRoot.dataset.activeCategory ?? tabsRoot.dataset.activeId ?? 'all';
    const activeTab =
      tabs.find((tab) => tab.classList.contains('is-active')) ??
      tabs.find((tab) => tab.dataset.pillTab === activeCategory) ??
      tabs[0];

    const prevCategory = sessionStorage.getItem(STORAGE_KEY);
    const prevTab = prevCategory
      ? tabs.find((tab) => tab.dataset.pillTab === prevCategory)
      : null;

    if (prevTab && prevTab !== activeTab) {
      positionTabIndicator(indicator, prevTab, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => positionTabIndicator(indicator, activeTab, true));
      });
    } else {
      positionTabIndicator(indicator, activeTab, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => positionTabIndicator(indicator, activeTab, false));
      });
    }

    sessionStorage.setItem(STORAGE_KEY, activeCategory);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.pillTab ?? 'all';
        sessionStorage.setItem(STORAGE_KEY, id);
      });
    });

    const update = () => {
      const current = tabs.find((tab) => tab.classList.contains('is-active')) ?? activeTab;
      positionTabIndicator(indicator, current, false);
    };

    window.addEventListener('resize', update);
    window.addEventListener('load', update, { once: true });

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(update);
      observer.observe(tabsRoot);
    }
  });
}

export function initPillTabsButtonMode(root: HTMLElement) {
  const tabs = [...root.querySelectorAll('.pill-tab')] as HTMLButtonElement[];
  const bound = bindTabIndicator(root, {
    indicatorSelector: '.pill-tabs__indicator',
    tabSelector: '.pill-tab',
  });
  if (!bound) return null;

  const { indicator } = bound;

  function setActive(category: string) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.category === category;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      if (isActive) positionTabIndicator(indicator, tab, true);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.category) setActive(tab.dataset.category);
    });
  });

  return { setActive, tabs, indicator };
}

export function initStandalonePillTabsButtonMode() {
  document.querySelectorAll('[data-pill-tabs][data-pill-tabs-mode="button"]').forEach((root) => {
    if (!(root instanceof HTMLElement)) return;
    if (root.closest('[data-best-selling]')) return;
    if (root.dataset.pillTabsInit === 'true') return;
    root.dataset.pillTabsInit = 'true';
    initPillTabsButtonMode(root);
  });
}
