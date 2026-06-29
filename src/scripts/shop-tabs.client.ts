import { initPillTabsLinkMode, initStandalonePillTabsButtonMode } from './pill-tabs.client';

initPillTabsLinkMode();
initStandalonePillTabsButtonMode();
document.addEventListener('astro:page-load', () => {
  initPillTabsLinkMode();
  initStandalonePillTabsButtonMode();
});
