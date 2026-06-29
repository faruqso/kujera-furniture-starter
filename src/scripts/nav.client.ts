let headerScrollHandler: (() => void) | null = null;
let headerRafId = 0;
let headerPillActive = false;
let lastScrollY = 0;

/** Always show full header at the very top */
const TOP_SNAP_Y = 4;
/** Scrolling down: collapse into pill after this point */
const PILL_ON_Y = 32;
/** Scrolling up: expand back to full header before the top */
const PILL_OFF_Y = 120;
/** Ignore tiny scroll jitter (Lenis / trackpad) */
const MIN_DELTA_Y = 8;

function resolveHeaderPillState(y: number, delta: number, current: boolean): boolean {
  if (y <= TOP_SNAP_Y) return false;
  if (y >= PILL_OFF_Y) return true;
  if (y <= PILL_ON_Y) return false;

  if (Math.abs(delta) < MIN_DELTA_Y) return current;
  return delta > 0;
}

function updateHeaderScroll(header: Element) {
  const y = window.scrollY;
  const delta = y - lastScrollY;
  const next = resolveHeaderPillState(y, delta, headerPillActive);

  lastScrollY = y;

  if (next === headerPillActive) return;

  headerPillActive = next;
  header.classList.toggle('is-scrolled', headerPillActive);
}

function scheduleHeaderScrollUpdate(header: Element) {
  if (headerRafId) return;

  headerRafId = requestAnimationFrame(() => {
    headerRafId = 0;
    updateHeaderScroll(header);
  });
}

function initHeaderScroll() {
  const header = document.querySelector('[data-site-header]');

  if (headerScrollHandler) {
    window.removeEventListener('scroll', headerScrollHandler);
    window.removeEventListener('resize', headerScrollHandler);
    document.removeEventListener('app:scroll', headerScrollHandler);
    headerScrollHandler = null;
  }

  if (headerRafId) {
    cancelAnimationFrame(headerRafId);
    headerRafId = 0;
  }

  if (!header) return;

  lastScrollY = window.scrollY;
  headerPillActive = lastScrollY > PILL_ON_Y;
  header.classList.toggle('is-scrolled', headerPillActive);

  headerScrollHandler = () => scheduleHeaderScrollUpdate(header);

  headerScrollHandler();
  window.addEventListener('scroll', headerScrollHandler, { passive: true });
  window.addEventListener('resize', headerScrollHandler, { passive: true });
  document.addEventListener('app:scroll', headerScrollHandler, { passive: true });
}

function initMobileNav() {
  const toggle = document.querySelector('[data-mobile-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu || menu.dataset.initialized === 'true') return;
  menu.dataset.initialized = 'true';

  const closeEls = menu.querySelectorAll('[data-mobile-menu-close]');
  const links = menu.querySelectorAll('.mobile-menu__link');

  const openMenu = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mobile-menu-open');
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-menu-open');
  };

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  closeEls.forEach((el) => el.addEventListener('click', closeMenu));
  links.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
}

function initNav() {
  initMobileNav();
  initHeaderScroll();
}

initNav();
document.addEventListener('astro:page-load', initNav);
