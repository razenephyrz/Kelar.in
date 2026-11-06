import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { APIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { auth } from '#lib/server/auth.ts';
import { db } from '#lib/server/db/index.ts';
import { profilPegawai, profilRtrw, profilWarga, user } from '#lib/server/db/schema.ts';
import { encryptNik, hashNik, newProfileId, normalisasiHp, validasiNik, validasiNipd } from '#lib/server/auth-validation.ts';
import { addLocalProfile, hasLocalNik, hasLocalNipd, setLocalAccount } from '#lib/server/local-auth-store.ts';
import { AUTH_STORAGE } from '$app/env/private';

function text(data: FormData, key: string) {
	return String(data.get(key) ?? '').trim();
}

export const actions: Actions = {
	register: async (event) => {
		const data = await event.request.formData();
		const kind = text(data, 'kind');
		const name = text(data, 'name');
		const nik = text(data, 'nik');
		const email = text(data, 'email').toLowerCase();
		const password = String(data.get('password') ?? '');
		const confirmPassword = String(data.get('confirmPassword') ?? '');
		const phoneValue = text(data, 'phone');
		const kelurahanId = text(data, 'kelurahanId');
		const rt = text(data, 'rt');
		const rw = text(data, 'rw');
		const nipd = text(data, 'nipd');
		const staffRole = text(data, 'staffRole');

		if (kind !== 'warga' && kind !== 'petugas') return fail(400, { error: 'Jenis akun tidak valid.' });
		if (name.length < 2 || !email || password.length < 8 || password !== confirmPassword)
			return fail(400, { error: 'Periksa nama, email, dan kata sandi kamu.' });
		if (!validasiNik(nik)) return fail(400, { error: 'NIK harus 16 digit dengan tanggal lahir yang valid.' });
		if (phoneValue && !normalisasiHp(phoneValue)) return fail(400, { error: 'Format nomor HP tidak valid.' });
		if (!kelurahanId || !/^\d{1,3}$/.test(rt) || !/^\d{1,3}$/.test(rw))
			return fail(400, { error: 'Kelurahan, RT, dan RW wajib diisi.' });
		if (kind === 'petugas' && (!validasiNipd(nipd) || !['pegawai', 'rtrw'].includes(staffRole)))
			return fail(400, { error: 'Data petugas tidak valid.' });

		let createdUserId: string | undefined;
		try {
			const nikHash = hashNik(nik);
			if (AUTH_STORAGE === 'memory') {
				if (hasLocalNik(nikHash)) return fail(409, { error: 'NIK sudah terdaftar.' });
				if (kind === 'petugas' && hasLocalNipd(nipd)) return fail(409, { error: 'NIPD sudah terdaftar.' });
			}
			if (AUTH_STORAGE !== 'memory') {
				const [wargaByNik, pegawaiByNik, rtrwByNik] = await Promise.all([
					db.select({ id: profilWarga.id }).from(profilWarga).where(eq(profilWarga.nikHash, nikHash)).limit(1),
					db.select({ id: profilPegawai.id }).from(profilPegawai).where(eq(profilPegawai.nikHash, nikHash)).limit(1),
					db.select({ id: profilRtrw.id }).from(profilRtrw).where(eq(profilRtrw.nikHash, nikHash)).limit(1)
				]);
				if (wargaByNik.length || pegawaiByNik.length || rtrwByNik.length) return fail(409, { error: 'NIK sudah terdaftar.' });
				if (kind === 'petugas') {
					const [pegawaiByNipd, rtrwByNipd] = await Promise.all([
						db.select({ id: profilPegawai.id }).from(profilPegawai).where(eq(profilPegawai.nipd, nipd)).limit(1),
						db.select({ id: profilRtrw.id }).from(profilRtrw).where(eq(profilRtrw.nipd, nipd)).limit(1)
					]);
					if (pegawaiByNipd.length || rtrwByNipd.length) return fail(409, { error: 'NIPD sudah terdaftar.' });
				}
			}

			const result = await auth.api.signUpEmail({
				body: { name, email, password, ...(kind === 'petugas' ? { username: nipd } : {}) },
				headers: event.request.headers
			});
			createdUserId = result.user.id;
			const role = kind === 'warga' ? 'warga' : staffRole;
			const status = kind === 'warga' ? 'aktif' : 'pending';
			if (AUTH_STORAGE === 'memory') {
				setLocalAccount(createdUserId, role, status);
				addLocalProfile({ userId: createdUserId, name, email, kind: role === 'warga' ? 'warga' : role === 'rtrw' ? 'rtrw' : 'pegawai', status, kelurahanId, rt: rt.padStart(3, '0'), rw: rw.padStart(3, '0'), nipd: kind === 'petugas' ? nipd : undefined, nikHash });
			} else {
				await db.update(user).set({ role, status }).where(eq(user.id, createdUserId));
			}
			const common = { id: newProfileId(), userId: createdUserId, nikHash, nikEncrypted: encryptNik(nik), phone: phoneValue ? normalisasiHp(phoneValue) : null, kelurahanId, createdAt: new Date() };
			if (AUTH_STORAGE !== 'memory') {
				if (kind === 'warga') await db.insert(profilWarga).values({ ...common, rt: rt.padStart(3, '0'), rw: rw.padStart(3, '0') });
				else if (role === 'rtrw') await db.insert(profilRtrw).values({ ...common, nipd, rt: rt.padStart(3, '0'), rw: rw.padStart(3, '0') });
				else await db.insert(profilPegawai).values({ ...common, nipd });
			}
		} catch (error) {
			if (createdUserId) await db.delete(user).where(eq(user.id, createdUserId));
			if (error instanceof Error && /BETTER_AUTH_NIK_KEY|DATABASE_URL|profil_warga|profil_pegawai|profil_rtrw/i.test(error.message)) {
				console.error('Konfigurasi registrasi belum siap:', error.message);
				return fail(503, { error: 'Pendaftaran sedang belum tersedia. Hubungi administrator.' });
			}
			if (error instanceof APIError && /exist|duplicate|already/i.test(error.message)) return fail(409, { error: 'Email atau NIPD sudah terdaftar.' });
			if (error instanceof APIError) return fail(400, { error: 'Data pendaftaran belum valid. Periksa kembali isian kamu.' });
			console.error('Registrasi gagal:', error instanceof Error ? error.message : JSON.stringify(error));
			return fail(500, { error: 'Pendaftaran belum berhasil. Coba lagi.' });
		}
		throw redirect(303, '/cek-email');
	}
};
