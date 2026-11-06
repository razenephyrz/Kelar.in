import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/server/db/schema.ts';
import { user } from '../src/lib/server/db/auth.schema.ts';

const email = process.env.LURAH_EMAIL?.trim().toLowerCase();
const name = process.env.LURAH_NAME?.trim();
const password = process.env.LURAH_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (!email || !name || !password || !databaseUrl || !secret) {
	throw new Error('Set LURAH_EMAIL, LURAH_NAME, LURAH_PASSWORD, DATABASE_URL, and BETTER_AUTH_SECRET');
}

const client = mysql.createPool({
	uri: databaseUrl,
	ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});
const db = drizzle(client, { schema, mode: 'default' });
const auth = betterAuth({
	baseURL: process.env.ORIGIN ?? 'http://localhost:5173',
	secret,
	database: drizzleAdapter(db, { provider: 'mysql' }),
	emailAndPassword: { enabled: true, requireEmailVerification: true }
});

try {
	const result = await auth.api.signUpEmail({ body: { name, email, password } });
	await db.update(user).set({ role: 'lurah', status: 'aktif', emailVerified: true }).where(eq(user.id, result.user.id));
	console.log(`Akun lurah berhasil dibuat: ${email}`);
} finally {
	await client.end();
}
