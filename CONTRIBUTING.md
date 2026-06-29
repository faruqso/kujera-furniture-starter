# Contributing

Thank you for helping improve **Kujera Furniture Starter**!

## Development setup

1. Fork and clone [kujera-furniture-starter](https://github.com/faruqso/kujera-furniture-starter)
2. Run `npm install`
3. Run `npm run dev` to start the dev server
4. For CMS editing locally, run `npm run cms` in a second terminal and open `/admin` — see [docs/decap-setup.md](docs/decap-setup.md)
5. Run `npm run build` before submitting a PR to verify the build passes

## Where to make changes

| Goal | Location |
|------|----------|
| Rebrand colors, fonts, spacing | `src/styles/tokens.css` |
| UI primitives (Button, PillTabs, etc.) | `src/components/ui/` |
| Page sections (Hero, Testimonials, etc.) | `src/components/sections/` |
| Site-wide nav, footer, SEO defaults | `src/content/site/settings.json` or `/admin` |
| Page content | `src/content/pages/*.md` or `/admin` |
| Products & collections | `src/content/products/`, `src/content/collections/` |
| Static images | `public/assets/` |

## Pull request guidelines

- Keep changes focused — one feature or fix per PR
- Match existing code style and conventions
- Use design tokens instead of hardcoded colors or spacing
- Update docs if you add new section types or change the content schema

## Adding a new section type

1. Add the schema in `src/content.config.ts`
2. Add the TypeScript type in `src/types/sections.ts`
3. Create the component in `src/components/sections/`
4. Register it in `src/components/SectionRenderer.astro`
5. Document it in `docs/customization.md`

## Questions?

Open an issue on GitHub — we're happy to help.
