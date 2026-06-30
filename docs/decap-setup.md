# Decap CMS setup

Kujera uses [Decap CMS](https://decapcms.org/) (formerly Netlify CMS) for git-based content editing.

Each person who forks this template connects Decap to **their own GitHub repo**. You do not share credentials with the original template author.

## Browse-only demo (default on live sites)

Out of the box, `/admin` on a deployed site is **browse-only**:

- A yellow banner explains that saving requires your own fork
- You can browse all collections and open any entry
- Save, publish, and delete actions redirect to `/admin/get-started` with setup instructions

The live demo reads content through a read-only file API — no GitHub login required to explore.

When **you** are ready to save from the browser on your own fork:

1. Update `PUBLIC_DECAP_REPO` to your `username/repo` (or edit `getDecapRepo()` in `src/lib/decap-public.ts`)
2. Configure GitHub OAuth on your host (see below)
3. Set `PUBLIC_DECAP_EDIT_ENABLED=true` in `.env` and on your host (Vercel, etc.)

Without `PUBLIC_DECAP_EDIT_ENABLED=true`, even valid GitHub credentials stay in browse-only mode.

## Local editing (no auth)

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run cms

# Open
http://localhost:4321/admin
```

`npm run cms` starts the Decap file-system proxy on port **8081**. Saves write directly to `src/content/` and `public/assets/uploads/`.

## Production editing

The admin UI at `/admin` loads on any deployment, but **saves require a GitHub backend** and `PUBLIC_DECAP_EDIT_ENABLED=true`.

### 1. Point Decap at your repo

Set the env var on your host:

```bash
PUBLIC_DECAP_REPO=your-username/your-fork
```

### 2. Choose an auth method

Decap needs OAuth to write to GitHub. Common options:

| Host | Auth |
|------|------|
| Netlify | [Netlify Identity + Git Gateway](https://decapcms.org/docs/git-gateway-backend/) |
| Vercel | Custom OAuth server or [Cloudflare Access](https://decapcms.org/docs/open-authoring/) |
| Any | Self-hosted [decap-cms-github-oauth-provider](https://github.com/vencaxair/decap-cms-github-oauth-provider) |

See [Decap backends overview](https://decapcms.org/docs/backends-overview/).

### 3. Enable saves

Add to your host environment variables:

```bash
PUBLIC_DECAP_EDIT_ENABLED=true
```

Redeploy after changing env vars so `/admin/config.yml` serves the GitHub backend instead of the browse-only proxy.

### 4. Collections

Collections are defined in `src/cms/decap-collections.yml` and served dynamically at `/admin/config.yml`:

- **Pages** — `src/content/pages/*.md`
- **Site settings** — `src/content/site/settings.json`
- **Products** — `src/content/products/*.json`
- **Collections** — `src/content/collections/*.json`

Media uploads go to `public/assets/uploads/`.

## Tips

- After CMS edits in production, your host rebuilds from the new git commit (enable auto-deploy on push).
- For team workflows, use branch previews or restrict `/admin` behind auth at the CDN level.
- Collection schemas live in `src/cms/decap-collections.yml`; backend settings are generated in `src/lib/decap-config.ts`.
