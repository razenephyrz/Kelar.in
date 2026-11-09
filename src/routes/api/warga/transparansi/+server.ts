import { json } from '@sveltejs/kit';
import { avg, count, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { requestRating, serviceRequest } from '#lib/server/db/schema.ts';
import { requireAuthenticatedUser } from '#lib/server/warga.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	requireAuthenticatedUser(event);
	const [completed, ratings] = await Promise.all([
		db.select({ total: count() }).from(serviceRequest).where(eq(serviceRequest.status, 'completed')),
		db.select({ targetRole: requestRating.targetRole, average: avg(requestRating.score), total: count() }).from(requestRating).groupBy(requestRating.targetRole)
	]);
	const ratingMap = Object.fromEntries(
		ratings.map((rating) => [
			rating.targetRole,
			{ average: Number(rating.average ?? 0), total: Number(rating.total) }
		])
	);
	return json({
		completed: Number(completed[0]?.total ?? 0),
		ratings: ratingMap
	});
};
