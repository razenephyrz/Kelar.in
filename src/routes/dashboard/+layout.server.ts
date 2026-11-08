import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { AUTH_STORAGE } from '$app/env/private';
import { db } from '#lib/server/db/index.ts';
import { getLocalAccount } from '#lib/server/local-auth-store.ts';
import { user } from '#lib/server/db/schema.ts';
import { eq } from 'drizzle-orm';

function normalizeRole(role: string | undefined) {
	if (role === 'pegawai') return 'petugas' as const;
	if (role === 'rtrw') return 'rt_rw' as const;
	if (role === 'lurah') return 'lurah' as const;
	if (role === 'super_admin') return 'super_admin' as const;
	return 'warga' as const;
}

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	let role = 'warga';
	let status = 'aktif';
	if (AUTH_STORAGE === 'memory') {
		const account = getLocalAccount(locals.user.id);
		role = account?.role ?? role;
		status = account?.status ?? status;
	} else {
		const [account] = await db
			.select({ role: user.role, status: user.status })
			.from(user)
			.where(eq(user.id, locals.user.id))
			.limit(1);
		role = account?.role ?? role;
		status = account?.status ?? status;
	}

	if (status === 'pending') throw redirect(303, '/menunggu-persetujuan');
	if (status === 'ditolak') throw redirect(303, '/akun-ditolak');

	return {
		authUser: {
			id: locals.user.id,
			name: locals.user.name,
			email: locals.user.email,
			role: normalizeRole(role)
		}
	};
};