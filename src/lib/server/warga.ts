import { error, redirect } from '@sveltejs/kit';
import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import {
	notification,
	requestChecklist,
	requestHistory,
	requestRating,
	service,
	serviceApproval,
	serviceChecklist,
	serviceRequest
} from '#lib/server/db/schema.ts';
import type { RequestEvent } from '@sveltejs/kit';
import { AUTH_STORAGE } from '$app/env/private';
import { getCatalogServices } from './service-catalog';

export function requireAuthenticatedUser(event: RequestEvent) {
	if (!event.locals.user) {
		throw redirect(303, '/login');
	}
	return event.locals.user;
}

export async function listServices() {
	if (AUTH_STORAGE === 'memory') return getCatalogServices();

	try {
		const services = await db
			.select()
			.from(service)
			.where(eq(service.active, true))
			.orderBy(asc(service.name));
		const checklists = await db
			.select()
			.from(serviceChecklist)
			.orderBy(asc(serviceChecklist.position));
		const approvals = await db
			.select()
			.from(serviceApproval)
			.orderBy(asc(serviceApproval.position));

		return services.map((item) => ({
			...item,
			checklist: checklists.filter((entry) => entry.serviceId === item.id),
			approvals: approvals.filter((entry) => entry.serviceId === item.id)
		}));
	} catch (error) {
		console.error('Gagal memuat layanan dari database, memakai katalog bawaan:', error);
		return getCatalogServices();
	}
}

export async function listCitizenRequests(userId: string) {
	return db
		.select({
			id: serviceRequest.id,
			serviceId: serviceRequest.serviceId,
			serviceName: service.name,
			title: serviceRequest.title,
			description: serviceRequest.description,
			status: serviceRequest.status,
			targetCompletionAt: serviceRequest.targetCompletionAt,
			assignedDepartment: serviceRequest.assignedDepartment,
			delayReason: serviceRequest.delayReason,
			createdAt: serviceRequest.createdAt,
			updatedAt: serviceRequest.updatedAt
		})
		.from(serviceRequest)
		.innerJoin(service, eq(serviceRequest.serviceId, service.id))
		.where(eq(serviceRequest.ownerId, userId))
		.orderBy(desc(serviceRequest.updatedAt));
}

export async function getCitizenRequest(userId: string, requestId: string) {
	const rows = await db
		.select({
			request: serviceRequest,
			service
		})
		.from(serviceRequest)
		.innerJoin(service, eq(serviceRequest.serviceId, service.id))
		.where(and(eq(serviceRequest.id, requestId), eq(serviceRequest.ownerId, userId)))
		.limit(1);

	if (!rows.length) throw error(404, 'Pengajuan tidak ditemukan');

	const first = rows[0];
	const [checklist, history] = await Promise.all([
		db
			.select()
			.from(requestChecklist)
			.where(eq(requestChecklist.requestId, requestId))
			.orderBy(asc(requestChecklist.position)),
		db
			.select()
			.from(requestHistory)
			.where(eq(requestHistory.requestId, requestId))
			.orderBy(desc(requestHistory.createdAt))
	]);

	return {
		...first.request,
		service: first.service,
		checklist,
		history
	};
}

export async function listCitizenNotifications(userId: string) {
	return db
		.select()
		.from(notification)
		.where(eq(notification.recipientId, userId))
		.orderBy(desc(notification.createdAt));
}

export async function markNotificationRead(userId: string, notificationId: number) {
	const result = await db
		.update(notification)
		.set({ isRead: true })
		.where(and(eq(notification.id, notificationId), eq(notification.recipientId, userId)));
	if (!result[0].affectedRows) throw error(404, 'Notifikasi tidak ditemukan');
}

export async function createCitizenRating(
	userId: string,
	input: { requestId: string; targetRole: string; score: number; comment?: string }
) {
	if (!Number.isInteger(input.score) || input.score < 1 || input.score > 5) {
		throw error(400, 'Nilai rating harus berada di antara 1 dan 5');
	}
	const request = await db
		.select({ id: serviceRequest.id, status: serviceRequest.status })
		.from(serviceRequest)
		.where(and(eq(serviceRequest.id, input.requestId), eq(serviceRequest.ownerId, userId)))
		.limit(1);
	if (!request[0]) throw error(404, 'Pengajuan tidak ditemukan');
	if (request[0].status !== 'completed')
		throw error(409, 'Rating tersedia setelah pengajuan selesai');

	await db.insert(requestRating).values({
		requestId: input.requestId,
		raterId: userId,
		targetRole: input.targetRole,
		score: input.score,
		comment: input.comment?.trim() || null
	});
}
