function closeCustomSelect(root: HTMLElement) {
  const trigger = root.querySelector('.custom-select__trigger');
  const menu = root.querySelector('.custom-select__menu');
  if (!trigger || !menu) return;
  menu.setAttribute('hidden', '');
  trigger.setAttribute('aria-expanded', 'false');
  root.classList.remove('is-open');
}

function openCustomSelect(root: HTMLElement) {
  document.querySelectorAll('[data-custom-select].is-open').forEach((openRoot) => {
    if (openRoot !== root) closeCustomSelect(openRoot as HTMLElement);
  });

  const trigger = root.querySelector('.custom-select__trigger');
  const menu = root.querySelector('.custom-select__menu');
  if (!trigger || !menu) return;
  menu.removeAttribute('hidden');
  trigger.setAttribute('aria-expanded', 'true');
  root.classList.add('is-open');
}

function selectOption(root: HTMLElement, option: HTMLElement) {
  const value = option.dataset.customSelectOption ?? '';
  const label = option.querySelector('span:last-child')?.textContent ?? '';
  const hiddenInput = root.querySelector('[data-custom-select-input]') as HTMLInputElement | null;
  const valueEl = root.querySelector('[data-custom-select-label]');
  const previous = root.dataset.customSelectValue;

  root.dataset.customSelectValue = value;
  if (valueEl) {
    valueEl.textContent = label;
    valueEl.classList.remove('custom-select__value--placeholder');
  }
  if (hiddenInput) {
    hiddenInput.value = value;
    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  root.querySelectorAll('[data-custom-select-option]').forEach((el) => {
    const isSelected = el === option;
    el.classList.toggle('is-selected', isSelected);
    el.setAttribute('aria-selected', String(isSelected));
    const check = el.querySelector('.custom-select__check');
    if (check) check.textContent = isSelected ? '✓' : '';
  });

  closeCustomSelect(root);

  if (previous !== value) {
    root.dispatchEvent(
      new CustomEvent('customselect:change', {
        bubbles: true,
        detail: { value, label },
      }),
    );
  }
}

function initCustomSelect(root: HTMLElement) {
  if (root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const trigger = root.querySelector('.custom-select__trigger');
  const menu = root.querySelector('.custom-select__menu');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', () => {
    if (root.classList.contains('is-open')) closeCustomSelect(root);
    else openCustomSelect(root);
  });

  root.querySelectorAll('[data-custom-select-option]').forEach((option) => {
    option.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectOption(root, option as HTMLElement);
    });
  });

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCustomSelect(root);
    }
  });

  menu.addEventListener('keydown', (event) => {
    const options = [...root.querySelectorAll('[data-custom-select-option]')] as HTMLElement[];
    const currentIndex = options.findIndex((option) => option.classList.contains('is-selected'));

    if (event.key === 'Escape') {
      closeCustomSelect(root);
      trigger.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = options[Math.min(currentIndex + 1, options.length - 1)];
      if (next) selectOption(root, next);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = options[Math.max(currentIndex - 1, 0)];
      if (prev) selectOption(root, prev);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const active = options[currentIndex];
      if (active) selectOption(root, active);
    }
  });
}

function initCustomSelects() {
  document.querySelectorAll('[data-custom-select]').forEach((root) => {
    if (root instanceof HTMLElement) initCustomSelect(root);
  });
}

document.addEventListener('click', (event) => {
  const target = event.target as Node;
  document.querySelectorAll('[data-custom-select].is-open').forEach((root) => {
    if (!root.contains(target)) closeCustomSelect(root as HTMLElement);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('[data-custom-select].is-open').forEach((root) => {
      closeCustomSelect(root as HTMLElement);
    });
  }
});

initCustomSelects();
document.addEventListener('astro:page-load', initCustomSelects);

export function initShopSort() {
  document.querySelectorAll('[data-shop-sort-root]').forEach((root) => {
    if (!(root instanceof HTMLElement) || root.dataset.sortInit === 'true') return;
    root.dataset.sortInit = 'true';

    const grid = document.querySelector('[data-product-grid]');
    const select = root.querySelector('[data-custom-select]');
    if (!grid || !select) return;

    const items = [...grid.children] as HTMLElement[];

    select.addEventListener('customselect:change', (event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail;
      const sort = detail.value;
      const sorted = [...items].sort((a, b) => {
        if (sort === 'featured') return Number(b.dataset.featured) - Number(a.dataset.featured);
        const pa = Number(a.dataset.price);
        const pb = Number(b.dataset.price);
        return sort === 'price-asc' ? pa - pb : pb - pa;
      });
      sorted.forEach((el) => grid.appendChild(el));
    });
  });
}

initShopSort();
document.addEventListener('astro:page-load', initShopSort);
