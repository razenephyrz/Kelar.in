import { json } from '@sveltejs/kit';
import { listServices, requireAuthenticatedUser } from '#lib/server/warga.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	requireAuthenticatedUser(event);
	return json(await listServices());
};
