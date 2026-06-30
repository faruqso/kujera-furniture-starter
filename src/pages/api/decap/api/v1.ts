import type { APIRoute } from 'astro';
import { handleDecapApiRequest } from '../../../../lib/decap-readonly-api';

export const prerender = false;

export const OPTIONS: APIRoute = async ({ request }) => handleDecapApiRequest(request);

export const POST: APIRoute = async ({ request }) => handleDecapApiRequest(request);
