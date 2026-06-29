# Decap CMS setup

Kujera uses [Decap CMS](https://decapcms.org/) (formerly Netlify CMS) for git-based content editing.

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

The admin UI at `/admin` loads on any deployment, but **saves require a GitHub backend**.

### 1. Update `public/admin/config.yml`

Replace the placeholder backend with your fork:

```yaml
backend:
  name: github
  repo: your-username/your-fork
  branch: main

# Remove or comment out local_backend for production
# local_backend: true
```

### 2. Choose an auth method

Decap needs OAuth to write to GitHub. Common options:

| Host | Auth |
|------|------|
| Netlify | [Netlify Identity + Git Gateway](https://decapcms.org/docs/git-gateway-backend/) |
| Vercel | Custom OAuth server or [Cloudflare Access](https://decapcms.org/docs/open-authoring/) |
| Any | Self-hosted [decap-cms-github-oauth-provider](https://github.com/vencaxair/decap-cms-github-oauth-provider) |

See [Decap backends overview](https://decapcms.org/docs/backends-overview/).

### 3. Collections

Collections are pre-configured for:

- **Pages** — `src/content/pages/*.md`
- **Site settings** — `src/content/site/settings.json`
- **Products** — `src/content/products/*.json`
- **Collections** — `src/content/collections/*.json`

Media uploads go to `public/assets/uploads/`.

## Tips

- After CMS edits in production, your host rebuilds from the new git commit (enable auto-deploy on push).
- For team workflows, use branch previews or restrict `/admin` behind auth at the CDN level.
