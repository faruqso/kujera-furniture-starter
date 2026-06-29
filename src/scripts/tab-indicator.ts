export function positionTabIndicator(
  indicator: HTMLElement,
  tab: HTMLElement,
  animate = true,
) {
  if (!animate) indicator.style.transition = 'none';
  indicator.style.width = `${tab.offsetWidth}px`;
  indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  if (!animate) {
    indicator.getBoundingClientRect();
    indicator.style.transition = '';
  }
}

export function bindTabIndicator(
  root: HTMLElement,
  options: {
    indicatorSelector: string;
    tabSelector: string;
    getActiveTab?: (tabs: HTMLElement[]) => HTMLElement | undefined;
  },
) {
  const indicator = root.querySelector(options.indicatorSelector) as HTMLElement | null;
  const tabs = [...root.querySelectorAll(options.tabSelector)] as HTMLElement[];
  if (!indicator || tabs.length === 0) return null;

  const resolveActive = () =>
    options.getActiveTab?.(tabs) ??
    tabs.find((tab) => tab.classList.contains('is-active')) ??
    tabs[0];

  const update = (animate = false) => {
    const tab = resolveActive();
    if (tab) positionTabIndicator(indicator, tab, animate);
  };

  update(false);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => update(false));
  });
  window.addEventListener('load', () => update(false), { once: true });
  window.addEventListener('resize', () => update(false));

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => update(false));
    observer.observe(root);
  }

  return { update, indicator, tabs, resolveActive };
}
