import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const WRITE_ACTIONS = new Set([
  'persistEntry',
  'persistMedia',
  'deleteFile',
  'deleteFiles',
  'deleteUnpublishedEntry',
  'updateUnpublishedEntryStatus',
  'publishUnpublishedEntry',
]);

function repoRoot(): string {
  return path.resolve(process.env.GIT_REPO_DIRECTORY || process.cwd());
}

function toPosix(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function hashContent(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

async function listRepoFiles(
  root: string,
  folder: string,
  extension: string,
  depth: number,
): Promise<string[]> {
  async function walk(dir: string, remaining: number): Promise<string[]> {
    if (remaining <= 0) return [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const nested = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            return walk(fullPath, remaining - 1);
          }
          return fullPath.endsWith(extension) ? [fullPath] : [];
        }),
      );
      return nested.flat();
    } catch {
      return [];
    }
  }

  const absFolder = path.join(root, folder);
  const files = await walk(absFolder, depth);
  return files.map((file) => file.slice(root.length + 1));
}

async function entriesFromFiles(
  root: string,
  files: Array<{ path: string; label?: string }>,
) {
  return Promise.all(
    files.map(async (file) => {
      try {
        const content = await fs.readFile(path.join(root, file.path));
        return {
          data: content.toString(),
          file: {
            path: toPosix(file.path),
            label: file.label,
            id: hashContent(content),
          },
        };
      } catch {
        return {
          data: null,
          file: {
            path: toPosix(file.path),
            label: file.label,
            id: null,
          },
        };
      }
    }),
  );
}

async function readMediaFile(root: string, mediaPath: string) {
  const encoding = 'base64';
  const content = await fs.readFile(path.join(root, mediaPath));
  return {
    id: hashContent(content),
    content: content.toString(encoding),
    encoding,
    path: toPosix(mediaPath),
    name: path.basename(mediaPath),
  };
}

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function handleAction(root: string, action: string, params: Record<string, unknown>) {
  switch (action) {
    case 'info':
      return { repo: path.basename(root), publish_modes: ['simple'], type: 'local_fs' };
    case 'entriesByFolder': {
      const { folder, extension, depth } = params as {
        folder: string;
        extension: string;
        depth: number;
      };
      const files = await listRepoFiles(root, folder, extension, depth);
      return entriesFromFiles(
        root,
        files.map((filePath) => ({ path: filePath })),
      );
    }
    case 'entriesByFiles': {
      const { files } = params as { files: Array<{ path: string; label?: string }> };
      return entriesFromFiles(root, files);
    }
    case 'getEntry': {
      const { path: entryPath } = params as { path: string };
      const [entry] = await entriesFromFiles(root, [{ path: entryPath }]);
      return entry;
    }
    case 'getMedia': {
      const { mediaFolder } = params as { mediaFolder: string };
      const files = await listRepoFiles(root, mediaFolder, '', 1);
      return Promise.all(files.map((filePath) => readMediaFile(root, filePath)));
    }
    case 'getMediaFile': {
      const { path: mediaPath } = params as { path: string };
      return readMediaFile(root, mediaPath);
    }
    case 'getDeployPreview':
      return null;
    default:
      return Response.json({ error: `Unknown action ${action}` }, { status: 422 });
  }
}

export async function handleDecapApiRequest(request: Request): Promise<Response> {
  const headers = corsHeaders(request);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
  }

  let body: { action?: string; params?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers });
  }

  const { action, params = {} } = body;
  if (!action) {
    return Response.json({ error: 'Missing action' }, { status: 422, headers });
  }

  if (WRITE_ACTIONS.has(action)) {
    return Response.json(
      { error: 'Browse-only demo — fork the repo and connect GitHub to save changes.' },
      { status: 403, headers },
    );
  }

  try {
    const result = await handleAction(repoRoot(), action, params);
    if (result instanceof Response) {
      return new Response(result.body, {
        status: result.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
    return Response.json(result, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500, headers });
  }
}
