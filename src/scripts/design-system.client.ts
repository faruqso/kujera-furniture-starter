function normalize(value: string) {
  return value.toLowerCase().trim();
}

function initDesignSystem() {
  const root = document.querySelector('[data-design-system]');
  if (!(root instanceof HTMLElement)) return;

  const searchInput = root.querySelector('[data-ds-search]') as HTMLInputElement | null;
  const emptyState = root.querySelector('[data-ds-empty]');
  const panels = [...root.querySelectorAll('[data-ds-panel]')] as HTMLElement[];
  const navLinks = [...root.querySelectorAll('[data-ds-nav]')] as HTMLAnchorElement[];

  if (!searchInput || panels.length === 0) return;

  function setActiveNav(id: string) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.dsNav === id);
    });
  }

  function filterPanels(query: string) {
    const q = normalize(query);
    let visibleCount = 0;

    panels.forEach((panel) => {
      const haystack = normalize(panel.dataset.dsKeywords ?? panel.textContent ?? '');
      const match = !q || haystack.includes(q);
      panel.classList.toggle('is-hidden', !match);
      if (match) visibleCount += 1;
    });

    navLinks.forEach((link) => {
      const haystack = normalize(`${link.dataset.dsKeywords ?? ''} ${link.textContent ?? ''}`);
      const match = !q || haystack.includes(q);
      link.classList.toggle('is-hidden', !match);
    });

    emptyState?.classList.toggle('is-visible', visibleCount === 0);
  }

  searchInput.addEventListener('input', () => filterPanels(searchInput.value));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.id) {
          setActiveNav(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 0.25, 0.5],
      },
    );

    panels.forEach((panel) => {
      if (panel.id) observer.observe(panel);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href')?.replace('#', '');
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveNav(id);
    });
  });

  filterPanels('');
}

initDesignSystem();
document.addEventListener('astro:page-load', initDesignSystem);
