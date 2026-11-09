import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { AUTH_STORAGE } from '$app/env/private';
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

	const currentUser = locals.user as {
		id: string;
		name?: string;
		email?: string;
		role?: string;
		status?: string;
	};

	let role = currentUser.role ?? 'warga';
	let status = currentUser.status ?? 'aktif';

	if (AUTH_STORAGE === 'memory') {
		const account = getLocalAccount(currentUser.id);
		role = account?.role ?? role;
		status = account?.status ?? status;
	} else if (!currentUser.role || !currentUser.status) {
		try {
			const { db } = await import('#lib/server/db/index.ts');
			const [account] = await db
				.select({ role: user.role, status: user.status })
				.from(user)
				.where(eq(user.id, currentUser.id))
				.limit(1);
			role = account?.role ?? role;
			status = account?.status ?? status;
		} catch (err) {
			console.error('Error fetching user role/status in dashboard layout:', err);
		}
	}

	if (status === 'pending') throw redirect(303, '/menunggu-persetujuan');
	if (status === 'ditolak') throw redirect(303, '/akun-ditolak');

	return {
		authUser: {
			id: currentUser.id,
			name: currentUser.name || 'Warga',
			email: currentUser.email || '',
			role: normalizeRole(role)
		}
	};
};
