import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { auth, ensureLocalLurah } from '#lib/server/auth.ts';
import { APIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { user } from '#lib/server/db/schema.ts';

const genericError = 'Email/NIPD atau password salah.';

export const actions: Actions = {
	signIn: async (event) => {
		const data = await event.request.formData();
		const identifier = String(data.get('identifier') ?? '').trim();
		const password = String(data.get('password') ?? '');
		if (!identifier || !password) return fail(400, { error: genericError });

		try {
			await ensureLocalLurah();
			const result = identifier.includes('@')
				? await auth.api.signInEmail({ body: { email: identifier, password }, headers: event.request.headers })
				: await auth.api.signInUsername({ body: { username: identifier, password }, headers: event.request.headers });
			const localAccount = (await import('#lib/server/local-auth-store.ts')).getLocalAccount(result.user.id);
			const [account] = localAccount
				? [localAccount]
				: await db.select({ role: user.role, status: user.status }).from(user).where(eq(user.id, result.user.id)).limit(1);
			const role = account?.role;
			const status = account?.status;
			if (status === 'pending') throw redirect(303, '/menunggu-persetujuan');
			if (status === 'ditolak') throw redirect(303, '/akun-ditolak');
			throw redirect(
				303,
				role === 'lurah'
					? '/lurah'
					: '/dashboard'
			);
		} catch (error) {
			if (isRedirect(error)) throw error;
			if (error instanceof APIError) return fail(400, { error: genericError });
			console.error('Login gagal:', error instanceof Error ? error.message : JSON.stringify(error));
			return fail(500, { error: 'Layanan sedang bermasalah. Coba lagi.' });
		}
	}
};
