// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel';

/** Recursively list files for Decap browse-only API on Vercel serverless */
function listContentFiles(dir = 'src/content', root = process.cwd()) {
  const absDir = join(root, dir);
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(absDir)) {
    const absPath = join(absDir, entry);
    if (statSync(absPath).isDirectory()) {
      files.push(...listContentFiles(join(dir, entry), root));
    } else {
      files.push('./' + relative(root, absPath));
    }
  }
  return files;
}

function listUploadFiles(dir = 'public/assets/uploads', root = process.cwd()) {
  const absDir = join(root, dir);
  /** @type {string[]} */
  const files = [];
  try {
    for (const entry of readdirSync(absDir)) {
      const absPath = join(absDir, entry);
      if (statSync(absPath).isFile()) {
        files.push('./' + relative(root, absPath));
      }
    }
  } catch {
    // uploads folder may be empty
  }
  return files;
}

const contentFiles = listContentFiles();
const uploadFiles = listUploadFiles();

const siteUrl = process.env.SITE_URL ?? 'https://kujera-furniture-starter.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: 'static',
  adapter: vercel({
    // Decap browse-only API reads content/ at runtime on Vercel
    includeFiles: [...contentFiles, ...uploadFiles, './src/cms/decap-collections.yml'],
  }),
  integrations: [preact()],
});
