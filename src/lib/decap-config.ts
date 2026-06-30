import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDecapRepo, isDecapEditEnabled } from './decap-public';

const COLLECTIONS_PATH = join(process.cwd(), 'src/cms/decap-collections.yml');

function getSiteUrl(): string {
  return (import.meta.env.SITE ?? 'https://kujera-furniture-starter.vercel.app').replace(/\/$/, '');
}

function getSiteHost(): string {
  return new URL(getSiteUrl()).host;
}

function loadCollectionsYaml(): string {
  return readFileSync(COLLECTIONS_PATH, 'utf8');
}

function patchCreateFlags(yaml: string, allowCreate: boolean): string {
  if (allowCreate) return yaml;
  return yaml.replace(/^(\s*)create:\s*true\s*$/gm, '$1create: false');
}

function buildBackendSection(editEnabled: boolean, isDev: boolean): string {
  if (editEnabled) {
    return `# Production editing — requires GitHub OAuth (see docs/decap-setup.md)
backend:
  name: github
  repo: ${getDecapRepo()}
  branch: main
`;
  }

  const localUrl = isDev
    ? 'http://localhost:8081/api/v1'
    : `${getSiteUrl()}/api/decap/api/v1`;

  const allowedHosts = isDev
    ? ['localhost:4321', '127.0.0.1:4321']
    : [getSiteHost(), 'localhost:4321', '127.0.0.1:4321'];

  return `# Browse-only demo — reads content via local proxy; saves require your own fork
backend:
  name: git-gateway
  branch: main

local_backend:
  url: ${localUrl}
  allowed_hosts: [${allowedHosts.map((host) => `'${host}'`).join(', ')}]
`;
}

/** Build the full Decap config.yml served at /admin/config.yml */
export function buildDecapConfigYaml(): string {
  const editEnabled = isDecapEditEnabled();
  const isDev = import.meta.env.DEV;
  const header = `# Decap CMS — git-based content editor for Kujera
# Docs: https://decapcms.org/docs/intro/
#
# Local editing: run \`npm run cms\` in one terminal and \`npm run dev\` in another,
# then open http://localhost:4321/admin

${buildBackendSection(editEnabled, isDev)}

media_folder: public/assets/uploads
public_folder: /assets/uploads

slug:
  encoding: "ascii"
  clean_accents: true

`;

  const collections = patchCreateFlags(loadCollectionsYaml(), editEnabled || isDev);
  return `${header}${collections}`;
}
