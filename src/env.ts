import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.' },
	ORIGIN: {
		description: 'The app origin (base URL), e.g. `http://localhost:5173`.'
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
	},
	BETTER_AUTH_NIK_KEY: {
		description: 'Hex key for HMAC and encryption of NIK values. Generate with `openssl rand -hex 32`.',
		schema: (value) => value || undefined
	},
	BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION: {
		description: 'Require email verification before allowing password login.',
		schema: (value) => value || undefined
	},
	AUTH_STORAGE: {
		description: 'Use memory for local development only; omit it in production.',
		schema: (value) => value || undefined
	},
	REQUIRE_EMAIL_VERIFICATION: {
		description: 'Require verified email addresses before sign-in. Set to true when email delivery is configured.',
		schema: (value) => value || undefined
	},
	LOCAL_LURAH_EMAIL: {
		description: 'Optional local-only lurah account email.',
		schema: (value) => value || undefined
	},
	LOCAL_LURAH_NAME: {
		description: 'Optional local-only lurah account name.',
		schema: (value) => value || undefined
	},
	LOCAL_LURAH_PASSWORD: {
		description: 'Optional local-only lurah account password.',
		schema: (value) => value || undefined
	}
});
