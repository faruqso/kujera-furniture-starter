# Kujera Furniture Starter

An open-source furniture ecommerce starter built with **Astro**, **Decap CMS**, and a **token-driven design system**. Fork it, rebrand it, and launch your own storefront in minutes.

**Live demo:** [kujera-furniture-starter.vercel.app](https://kujera-furniture-starter.vercel.app)

## Features

- **CMS-driven pages** — edit content at `/admin` (local) or connect GitHub for production saves ([setup guide](docs/decap-setup.md))
- **Product catalog** — collections, PLP, PDP, and a demo cart with localStorage
- **Design system** — rebrand the entire site by editing `src/styles/tokens.css`
- **Composable sections** — Hero, Why Choosing Us, Best Selling, Testimonials, About gallery, and more
- **Fully static** — fast pre-rendered HTML; Preact only for cart and small islands

## Quick start

```bash
git clone https://github.com/faruqso/kujera-furniture-starter.git
cd kujera-furniture-starter
npm install
npm run dev
```

- **Site:** [http://localhost:4321](http://localhost:4321)
- **Design system:** [http://localhost:4321/design-system](http://localhost:4321/design-system)
- **CMS admin:** [http://localhost:4321/admin](http://localhost:4321/admin) — run `npm run cms` in a second terminal for local saves

## Rebrand in 2 files

| File | What it controls |
|------|------------------|
| `src/styles/tokens.css` | Colors, typography, spacing, shadows |
| `src/content/site/settings.json` | Brand name, nav, footer, SEO, currency |

See [docs/customization.md](docs/customization.md) for the full guide.

## Content

| Type | Location |
|------|----------|
| Site settings | `src/content/site/settings.json` |
| Pages | `src/content/pages/{slug}.md` |
| Products | `src/content/products/{slug}.json` |
| Collections | `src/content/collections/{slug}.json` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview production build |
| `npm run cms` | Decap local backend for `/admin` saves |

## Tech stack

- [Astro 7](https://astro.build) — static site generator
- [Decap CMS](https://decapcms.org) — git-based CMS
- [Preact](https://preactjs.com) — cart drawer island
- CSS design tokens — no UI framework on the public site

## Project structure

```
src/
├── components/
│   ├── sections/       # Composable page blocks
│   ├── commerce/       # Shop, product detail, cart
│   └── ui/             # Button, Badge, PillTabs, …
├── content/            # Pages, products, site settings
├── styles/tokens.css   # Design tokens (rebrand here)
└── pages/              # Routes + catch-all shop router
public/
└── admin/              # Decap CMS config
docs/
├── customization.md
└── decap-setup.md
```

## Deploy

Import the repo on [Vercel](https://vercel.com/new). Astro is auto-detected. Set `SITE_URL` to your production domain for canonical and OG tags.

## License

MIT — see [LICENSE](LICENSE). Use freely for personal and commercial projects.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
