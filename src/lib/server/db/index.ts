import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { DATABASE_URL } from '$app/env/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const url = new URL(DATABASE_URL);

// Satu pool saja, tidak bocor saat HMR
const g = globalThis as unknown as { __kelarPool?: mysql.Pool };

const client =
	g.__kelarPool ??
	mysql.createPool({
		host: url.hostname,
		port: Number(url.port) || 4000,
		user: decodeURIComponent(url.username),
		password: decodeURIComponent(url.password),
		database: url.pathname.replace(/^\//, ''),
		ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
		waitForConnections: true,
		connectionLimit: 3,
		maxIdle: 3,
		idleTimeout: 30_000,
		enableKeepAlive: true,
		keepAliveInitialDelay: 10_000,
		connectTimeout: 20_000
	});

g.__kelarPool = client;

export const db = drizzle(client, { schema, mode: 'default' });