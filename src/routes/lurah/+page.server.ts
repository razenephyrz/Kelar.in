import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { session, user } from '#lib/server/db/schema.ts';
import { AUTH_STORAGE } from '$app/env/private';
import { ensureLocalLurah } from '#lib/server/auth.ts';
import { getLocalAccount, listLocalPending, updateLocalStatus } from '#lib/server/local-auth-store.ts';

async function requireLurah(userId: string | undefined) {
	await ensureLocalLurah();
	if (!userId) throw redirect(303, '/login');
	if (AUTH_STORAGE === 'memory') {
		if (getLocalAccount(userId)?.role !== 'lurah') throw redirect(303, '/');
		return;
	}
	const [account] = await db.select({ role: user.role }).from(user).where(eq(user.id, userId)).limit(1);
	if (account?.role !== 'lurah') throw redirect(303, '/');
}

export const load: PageServerLoad = async ({ locals }) => {
	await requireLurah(locals.user?.id);
	if (AUTH_STORAGE === 'memory') return { applicants: listLocalPending() };
	const applicants = await db
		.select({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt })
		.from(user)
		.where(and(eq(user.status, 'pending'), inArray(user.role, ['pegawai', 'rtrw'])));
	return { applicants };
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		await requireLurah(locals.user?.id);
		const id = String((await request.formData()).get('userId') ?? '');
		if (!id) return fail(400, { error: 'Akun tidak valid.' });
		if (AUTH_STORAGE === 'memory') {
			updateLocalStatus(id, 'aktif');
			return { success: 'Akun petugas disetujui.' };
		}
		await db.update(user).set({ status: 'aktif' }).where(and(eq(user.id, id), eq(user.status, 'pending')));
		return { success: 'Akun petugas disetujui.' };
	},
	reject: async ({ request, locals }) => {
		await requireLurah(locals.user?.id);
		const id = String((await request.formData()).get('userId') ?? '');
		if (!id) return fail(400, { error: 'Akun tidak valid.' });
		if (AUTH_STORAGE === 'memory') {
			updateLocalStatus(id, 'ditolak');
			return { success: 'Akun petugas ditolak dan sesinya dihapus.' };
		}
		await db.update(user).set({ status: 'ditolak' }).where(and(eq(user.id, id), eq(user.status, 'pending')));
		await db.delete(session).where(eq(session.userId, id));
		return { success: 'Akun petugas ditolak dan sesinya dihapus.' };
	}
};
