import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const u = new URL(process.env.DATABASE_URL);

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'mysql',
	dbCredentials: {
		host: u.hostname,
		port: Number(u.port || 3306),
		user: decodeURIComponent(u.username),
		password: decodeURIComponent(u.password),
		database: u.pathname.slice(1),
		ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
	},
	verbose: true,
	strict: true
});