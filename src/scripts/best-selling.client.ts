import { initPillTabsButtonMode } from './pill-tabs.client';

function initBestSelling(root: HTMLElement) {
  if (root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const cards = [...root.querySelectorAll('.best-selling__card')] as HTMLElement[];
  const tabsRoot = root.querySelector('[data-pill-tabs]') as HTMLElement | null;
  if (!tabsRoot) return;

  const bound = initPillTabsButtonMode(tabsRoot);
  if (!bound) return;

  bound.tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      if (!category) return;
      cards.forEach((card) => {
        card.hidden = card.dataset.category !== category;
      });
    });
  });
}

export function initBestSellingSections() {
  document.querySelectorAll('[data-best-selling]').forEach((root) => {
    if (root instanceof HTMLElement) initBestSelling(root);
  });
}

initBestSellingSections();
document.addEventListener('astro:page-load', initBestSellingSections);
