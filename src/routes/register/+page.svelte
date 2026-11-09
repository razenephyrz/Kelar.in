<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
	let kind = $state<'warga' | 'petugas'>('warga');
	let staffRole = $state<'pegawai' | 'rtrw'>('pegawai');
</script>

<svelte:head><title>Daftar akun — Kelar.in</title></svelte:head>
<main class="auth-page">
	<section class="auth-main">
		<div class="form-card register-card">
			<a class="text-link" href="/">← Kembali ke Kelar.in</a>
			<h1>Buat akun</h1>
			<p class="muted">Pilih jenis akun untuk memulai layanan.</p>
			<div class="auth-tabs" role="tablist">
				<button class:active={kind === 'warga'} type="button" onclick={() => (kind = 'warga')}>Warga</button>
				<button class:active={kind === 'petugas'} type="button" onclick={() => (kind = 'petugas')}>Petugas</button>
			</div>
			<form class="form" method="POST" action="?/register" use:enhance>
				<input type="hidden" name="kind" value={kind} />
				<label class="field">Nama lengkap<input name="name" autocomplete="name" required /></label>
				<label class="field">NIK<input name="nik" inputmode="numeric" minlength="16" maxlength="16" required /></label>
				<label class="field">Alamat email<input name="email" type="email" autocomplete="email" required /></label>
				<label class="field">No. HP <span class="hint">opsional, untuk notifikasi status berkas</span>
					<input name="phone" type="tel" inputmode="tel" placeholder="0812..." />
				</label>
				{#if kind === 'petugas'}
					<label class="field">Jenis petugas
						<select name="staffRole" bind:value={staffRole}>
							<option value="pegawai">Pegawai kelurahan</option>
							<option value="rtrw">RT/RW</option>
						</select>
					</label>
					{#if staffRole === 'pegawai'}
						<label class="field">NIPD<input name="nipd" required /></label>
					{/if}
				{/if}
				<label class="field">Kelurahan<select name="kelurahanId" required><option value="">Pilih kelurahan</option><option value="kelurahan-contoh">Kelurahan Contoh</option></select></label>
				<div class="split-fields">
					<label class="field">RT<input name="rt" inputmode="numeric" maxlength="3" placeholder="003" required /></label>
					<label class="field">RW<input name="rw" inputmode="numeric" maxlength="3" placeholder="005" required /></label>
				</div>
				<label class="field">Kata sandi<input name="password" type="password" minlength="8" autocomplete="new-password" required /></label>
				<label class="field">Konfirmasi kata sandi<input name="confirmPassword" type="password" minlength="8" autocomplete="new-password" required /></label>
				<label class="consent"><input name="consent" type="checkbox" required /> Saya menyetujui pemrosesan data pribadi untuk layanan Kelar.in.</label>
				{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
				<button class="button primary" type="submit">Buat akun <span>→</span></button>
				<p class="muted" style="text-align:center">Sudah punya akun? <a class="text-link" href="/login">Masuk</a></p>
			</form>
		</div>
	</section>
	<section class="auth-side" style="background:var(--blue)">
		<a class="brand" href="/" style="color:white"><span class="brand-mark" style="background:white;color:var(--navy)">K</span>Kelar.in</a>
		<div><p class="eyebrow" style="color:white">Lebih jelas, lebih dekat</p><h1>Urusan kelurahan, tanpa antrean informasi.</h1><p>Setelah mendaftar, cek email kamu untuk mengaktifkan akun.</p></div>
		<small style="color:#ffffffaa">NIK ditampilkan tersamarkan dan tidak pernah masuk URL atau log.</small>
	</section>
</main>
