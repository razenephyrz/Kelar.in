import { json } from '@sveltejs/kit';
import { listCitizenNotifications, markNotificationRead, requireAuthenticatedUser } from '#lib/server/warga.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const user = requireAuthenticatedUser(event);
	return json(await listCitizenNotifications(user.id));
};

export const PATCH: RequestHandler = async (event) => {
	const user = requireAuthenticatedUser(event);
	const body = await event.request.json().catch(() => null);
	if (!body || typeof body.notificationId !== 'number') {
		return json({ message: 'Notifikasi tidak valid' }, { status: 400 });
	}
	await markNotificationRead(user.id, body.notificationId);
	return json({ ok: true });
};
