import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { requestChecklist, serviceRequest } from '#lib/server/db/schema.ts';
import { getCitizenRequest, requireAuthenticatedUser } from '#lib/server/warga.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const user = requireAuthenticatedUser(event);
	return json(await getCitizenRequest(user.id, event.params.id));
};

export const PATCH: RequestHandler = async (event) => {
	const user = requireAuthenticatedUser(event);
	const body = await event.request.json().catch(() => null);
	if (!body || typeof body.checklistId !== 'number' || typeof body.completed !== 'boolean') {
		return json({ message: 'Data checklist tidak valid' }, { status: 400 });
	}

	const owned = await db
		.select({ id: requestChecklist.id })
		.from(requestChecklist)
		.innerJoin(serviceRequest, eq(requestChecklist.requestId, serviceRequest.id))
		.where(and(eq(requestChecklist.id, body.checklistId), eq(serviceRequest.ownerId, user.id)))
		.limit(1);
	if (!owned[0]) return json({ message: 'Checklist tidak ditemukan' }, { status: 404 });

	await db
		.update(requestChecklist)
		.set({ completed: body.completed })
		.where(eq(requestChecklist.id, body.checklistId));
	return json({ ok: true });
};
