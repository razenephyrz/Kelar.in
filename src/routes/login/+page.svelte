<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Masuk — Kelar.in</title></svelte:head>
<main class="auth-page">
	<section class="auth-side">
		<a class="brand" href="/"><span class="brand-mark" style="background:white;color:var(--navy)">K</span>Kelar.in</a>
		<div>
			<p class="eyebrow" style="color:#a3cef1">Layanan kelurahan yang transparan</p>
			<h1>Satu akun untuk semua urusan kelurahan.</h1>
			<p>Lacak pengajuan, terima pembaruan, dan tahu langkah berikutnya tanpa menebak-nebak.</p>
		</div>
		<small style="color:#ffffff99">Data kamu diproses dengan aman dan transparan.</small>
	</section>
	<section class="auth-main">
		<div class="form-card">
			<a class="text-link" href="/">← Kembali ke Kelar.in</a>
			<h1>Masuk</h1>
			<p class="muted">Gunakan email warga/RT atau NIPD petugas kelurahan.</p>
			<form class="form" method="POST" action="?/signIn" use:enhance>
				<label class="field">Email atau NIPD
					<input name="identifier" autocomplete="username" placeholder="nama@email.com atau NIPD" required />
				</label>
				<label class="field">Kata sandi
					<input name="password" type="password" autocomplete="current-password" required />
				</label>
				{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
				<button class="button primary" type="submit">Masuk <span>→</span></button>
				<p class="muted" style="text-align:center">Belum memiliki akun? <a class="text-link" href="/register">Daftar sekarang</a></p>
			</form>
		</div>
	</section>
</main>
