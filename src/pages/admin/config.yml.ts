import type { APIRoute } from 'astro';
import { buildDecapConfigYaml } from '../../lib/decap-config';

export const prerender = false;

export const GET: APIRoute = () => {
  return new Response(buildDecapConfigYaml(), {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};
