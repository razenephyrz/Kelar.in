import { json } from '@sveltejs/kit';
import { auth } from '#lib/server/auth.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	await auth.api.signOut({ headers: event.request.headers });
	return json({ ok: true });
};
