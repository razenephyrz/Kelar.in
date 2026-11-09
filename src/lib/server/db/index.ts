import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { DATABASE_URL } from '$app/env/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const url = new URL(DATABASE_URL);

const client = mysql.createPool({
	host: url.hostname,
	port: Number(url.port) || 4000,
	user: decodeURIComponent(url.username),
	password: decodeURIComponent(url.password),
	database: url.pathname.replace(/^\//, ''),
	ssl: {
		minVersion: 'TLSv1.2',
		rejectUnauthorized: true
	},
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10,
	idleTimeout: 60000,
	enableKeepAlive: true,
	keepAliveInitialDelay: 10000,
	connectTimeout: 20000 // tambahkan ini
});

export const db = drizzle(client, { schema, mode: 'default' });