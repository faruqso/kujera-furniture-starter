# Customization guide

Fork **Kujera Furniture Starter** and make it your own furniture or lifestyle storefront.

## 1. Fork and clone

```bash
git clone https://github.com/faruqso/kujera-furniture-starter.git
cd kujera-furniture-starter
npm install
npm run dev
```

Update `package.json` → `repository.url` with your fork's URL.

## 2. Rebrand with design tokens

All visual values live in **`src/styles/tokens.css`**. Edit:

- Brand colors (`--color-brand`, `--color-accent`, etc.)
- Typography (`--font-display`, `--font-body`, size scale)
- Spacing, radii, shadows, commerce tokens

Every component reads from these tokens — change one file, rebrand the whole site.

## 3. Replace images

Static assets live under `public/assets/`:

| Folder | Use for |
|--------|---------|
| `hero-image.png` | Home hero |
| `products/` | Product photography |
| `about/` | About page imagery |
| `cta/` | CTA band backgrounds |
| `uploads/` | CMS-uploaded media (Decap) |

Update paths in content files or via `/admin`.

## 4. Edit site settings

Open **`/admin`** → **Site settings**, or edit `src/content/site/settings.json`:

- Brand name, tagline, logo
- Navigation and footer links
- Currency symbol and code
- SEO title template, default description, OG image

### Social link preview

Set **`ogImage`** in site settings (recommended: 1200×630 JPG/PNG under `public/assets/`).

Set your production domain so canonical and OG URLs are absolute:

- Vercel env var: `SITE_URL=https://your-domain.com`
- Or update `site` in `astro.config.mjs`

## 5. Edit page content

Marketing pages live in `src/content/pages/*.md` as frontmatter with a `sections` array.

Use `/admin` to add, reorder, or edit sections visually, or edit the Markdown files directly.

Available section types: `hero`, `whyChoosingUs`, `bestSellingProducts`, `experiences`, `materials`, `testimonials`, `cta`, `contact`, `richText`, `aboutHero`, `parallaxSection`, `aboutSplit`, `aboutGallery`.

## 6. Products and collections

| Content | Path |
|---------|------|
| Products | `src/content/products/{slug}.json` |
| Collections | `src/content/collections/{slug}.json` |

Each product needs `slug`, `collection`, `title`, `price`, `images`, and optional `variants`. Routes are generated automatically at `/shop/{collection}/{slug}`.

## 7. UI strings

Cart labels, sort options, and other chrome strings are in `src/i18n/ui.ts`.

## 8. Deploy

### Vercel (recommended)

1. Push your fork to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Astro** (auto-detected)
4. Build command: `npm run build` · Output: `dist`
5. Add env var `SITE_URL` = your production URL
6. Deploy

### Other static hosts

Run `npm run build` and upload the `dist/` folder to Netlify, Cloudflare Pages, or any static host.

## 9. CMS on production

The `/admin` UI ships with the site. To enable **saving** on a live deployment, connect Decap to your GitHub repo — see [decap-setup.md](decap-setup.md).
