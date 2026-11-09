import { json } from '@sveltejs/kit';
import { db } from '#lib/server/db/index.ts';
import {
	notification,
	requestChecklist,
	requestHistory,
	service,
	serviceChecklist,
	serviceRequest
} from '#lib/server/db/schema.ts';
import { createCitizenRating, listCitizenRequests, requireAuthenticatedUser } from '#lib/server/warga.ts';
import { eq } from 'drizzle-orm';
import { generateRequestId } from '../../../../lib/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const user = requireAuthenticatedUser(event);
	return json(await listCitizenRequests(user.id));
};

export const POST: RequestHandler = async (event) => {
	const user = requireAuthenticatedUser(event);
	const body = await event.request.json().catch(() => null);
	if (!body || typeof body.serviceId !== 'string' || typeof body.title !== 'string') {
		return json({ message: 'Layanan dan judul pengajuan wajib diisi' }, { status: 400 });
	}

	const selected = await db.select().from(service).where(eq(service.id, body.serviceId)).limit(1);
	if (!selected[0] || !selected[0].active) return json({ message: 'Layanan tidak tersedia' }, { status: 404 });

	const now = new Date();
	const target = new Date(now);
	target.setDate(target.getDate() + selected[0].processingDays);
	target.setHours(17, 0, 0, 0);
	const id = generateRequestId();

	await db.transaction(async (tx) => {
		await tx.insert(serviceRequest).values({
			id,
			ownerId: user.id,
			serviceId: selected[0].id,
			title: body.title.trim(),
			description: typeof body.description === 'string' ? body.description.trim() : '',
			status: 'submitted',
			targetCompletionAt: target,
			assignedDepartment: selected[0].responsibleDepartment
		});
		const checklist = await tx.select().from(requestChecklist).where(eq(requestChecklist.requestId, id));
		if (!checklist.length) {
			const serviceItems = await tx.select().from(serviceChecklist).where(eq(serviceChecklist.serviceId, selected[0].id));
			if (serviceItems.length) {
				await tx.insert(requestChecklist).values(serviceItems.map((item) => ({
					requestId: id,
					label: item.label,
					position: item.position
				})));
			}
		}
		await tx.insert(requestHistory).values({
			requestId: id,
			previousStatus: null,
			newStatus: 'submitted',
			explanation: 'Pengajuan diterima dan menunggu verifikasi petugas.',
			actorId: user.id,
			actorName: user.name,
			actorRole: 'warga'
		});
		await tx.insert(notification).values({
			recipientId: user.id,
			requestId: id,
			title: 'Pengajuan diterima',
			message: `${id} sudah diterima dan akan diverifikasi petugas.`,
			type: 'request_created'
		});
	});

	return json({ id }, { status: 201 });
};

export const PATCH: RequestHandler = async (event) => {
	const user = requireAuthenticatedUser(event);
	const body = await event.request.json().catch(() => null);
	if (!body || typeof body.requestId !== 'string' || typeof body.targetRole !== 'string') {
		return json({ message: 'Data rating tidak lengkap' }, { status: 400 });
	}
	await createCitizenRating(user.id, body);
	return json({ ok: true });
};
