import { createCipheriv, createHmac, randomBytes, randomUUID } from 'node:crypto';
import { BETTER_AUTH_NIK_KEY } from '$app/env/private';

const NIK_KEY = BETTER_AUTH_NIK_KEY;

export function validasiNik(nik: string): boolean {
	if (!/^\d{16}$/.test(nik)) return false;
	const day = Number(nik.slice(6, 8)) % 40;
	const month = Number(nik.slice(8, 10));
	const year = Number(nik.slice(10, 12));
	if (day < 1 || day > 31 || month < 1 || month > 12) return false;
	const fullYear = year + (year <= new Date().getFullYear() % 100 ? 2000 : 1900);
	const date = new Date(fullYear, month - 1, day);
	return date.getFullYear() === fullYear && date.getMonth() === month - 1 && date.getDate() === day;
}

export function validasiNipd(nipd: string): boolean {
	return /^[A-Za-z0-9_.]{5,32}$/.test(nipd.trim());
}

export function normalisasiHp(phone: string): string | null {
	const digits = phone.replace(/[^\d+]/g, '');
	if (!digits) return null;
	let normalized = digits.replace(/^\+/, '');
	if (normalized.startsWith('0')) normalized = `62${normalized.slice(1)}`;
	if (!normalized.startsWith('62') || !/^62\d{8,13}$/.test(normalized)) return null;
	return normalized;
}

export function hashNik(nik: string): string {
	if (!NIK_KEY) throw new Error('BETTER_AUTH_NIK_KEY is not configured');
	return createHmac('sha256', NIK_KEY).update(nik).digest('hex');
}

export function encryptNik(nik: string): string {
	if (!NIK_KEY) throw new Error('BETTER_AUTH_NIK_KEY is not configured');
	if (!/^[\da-f]{64}$/i.test(NIK_KEY)) throw new Error('BETTER_AUTH_NIK_KEY must contain 32 bytes in hex');
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', Buffer.from(NIK_KEY, 'hex'), iv);
	const encrypted = Buffer.concat([cipher.update(nik, 'utf8'), cipher.final()]);
	return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

export function maskNik(nik: string): string {
	return `${nik.slice(0, 4)}••••••••${nik.slice(-4)}`;
}

export function newProfileId(): string {
	return randomUUID();
}
