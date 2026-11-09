import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { user } from '#lib/server/db/schema.ts';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	const [account] = await db
		.select({ role: user.role, status: user.status })
		.from(user)
		.where(eq(user.id, locals.user.id))
		.limit(1);

	return {
		user: locals.user,
		role: account?.role ?? 'warga',
		status: account?.status ?? 'aktif'
	};
};
