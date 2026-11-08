import {
	AUTH_STORAGE,
	BETTER_AUTH_SECRET,
	LOCAL_LURAH_EMAIL,
	LOCAL_LURAH_NAME,
	LOCAL_LURAH_PASSWORD,
	ORIGIN,
	REQUIRE_EMAIL_VERIFICATION
} from '$app/env/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '#lib/server/db/index.ts';
import { username } from 'better-auth/plugins';
import { memoryAdapter } from 'better-auth/adapters/memory';
import { setLocalAccount } from './local-auth-store';

const memoryDatabase = { user: [], session: [], account: [], verification: [] };

export const auth = betterAuth({
	baseURL: ORIGIN,
	secret: BETTER_AUTH_SECRET,
	database: AUTH_STORAGE === 'memory' ? memoryAdapter(memoryDatabase) : drizzleAdapter(db, { provider: 'mysql' }),
	user: {
		additionalFields: {
			role: { type: 'string', input: false, returned: false, defaultValue: 'warga' },
			status: { type: 'string', input: false, returned: false, defaultValue: 'aktif' }
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: REQUIRE_EMAIL_VERIFICATION === 'true'
	},
	plugins: [
		username(),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});

let localLurahReady: Promise<void> | undefined;

export function ensureLocalLurah() {
	if (AUTH_STORAGE !== 'memory' || !LOCAL_LURAH_EMAIL || !LOCAL_LURAH_NAME || !LOCAL_LURAH_PASSWORD) return Promise.resolve();
	localLurahReady ??= (async () => {
		try {
			const result = await auth.api.signUpEmail({
				body: { name: LOCAL_LURAH_NAME, email: LOCAL_LURAH_EMAIL, password: LOCAL_LURAH_PASSWORD }
			});
			setLocalAccount(result.user.id, 'lurah', 'aktif');
		} catch (error) {
			if (!(error instanceof Error && /exist|already|duplicate/i.test(error.message))) throw error;
		}
	})();
	return localLurahReady;
}
