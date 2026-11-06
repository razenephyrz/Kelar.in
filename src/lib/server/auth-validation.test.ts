import { describe, expect, it } from 'vitest';
import { normalisasiHp, validasiNik, validasiNipd } from './auth-validation';

describe('validasiNik', () => {
	it('accepts a valid male birth date', () => expect(validasiNik('3201010101900001')).toBe(true));
	it('accepts a valid female birth date encoded with +40', () => expect(validasiNik('3201014101900001')).toBe(true));
	it('rejects invalid dates and non-numeric values', () => {
		expect(validasiNik('3201010001900001')).toBe(false);
		expect(validasiNik('320101010290000A')).toBe(false);
	});
});

describe('auth input normalization', () => {
	it('normalizes Indonesian phone numbers', () => expect(normalisasiHp('0812 3456 7890')).toBe('6281234567890'));
	it('validates NIPD format', () => {
		expect(validasiNipd('NIPD_2026_01')).toBe(true);
		expect(validasiNipd('NIPD-2026-01')).toBe(false);
		expect(validasiNipd('x')).toBe(false);
	});
});
