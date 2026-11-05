<script lang="ts">
	import { goto } from '$app/navigation';
	import { civic, DEMO_PASSWORD } from '#lib/store';
	let email = $state('warga@example.com');
	let password = $state(DEMO_PASSWORD);
	let error = $state('');
	function submit(event: SubmitEvent) {
		event.preventDefault();
		const result = civic.login(email, password);
		if (!result.ok) {
			error = result.error ?? 'Sign-in failed.';
			return;
		}
		goto('/dashboard');
	}
</script>

<svelte:head><title>Masuk — Kelar.in</title></svelte:head>
<main class="auth-page">
	<section class="auth-side">
		<a class="brand" href="/" style="color:white"
			><span class="brand-mark" style="background:white;color:var(--navy)">K</span>Kelar.in</a
		>
		<div>
			<p class="eyebrow" style="color:#a3cef1">Selamat datang kembali</p>
			<h1>Lanjutkan proses layanan kamu.</h1>
			<p>Satu tempat untuk setiap pengajuan, proses, dan tahapan berikutnya.</p>
		</div>
		<small style="color:#ffffff99">Prototype only — demo credentials stay in your browser.</small>
	</section>
	<section class="auth-main">
		<div class="form-card">
			<a class="text-link" href="/">← Kembali ke Kelar.in</a>
			<h1>Masuk</h1>
			<p class="muted">Akses dasbor, pengajuan, dan kotak masuk.</p>
			<div class="demo-box">
				<b>Kata sandi demo: civic1234</b><br /><button
					type="button"
					onclick={() => (email = 'warga@example.com')}>warga@example.com</button
				><button type="button" onclick={() => (email = 'admin@example.com')}
					>admin@example.com</button
				><button type="button" onclick={() => (email = 'maya@example.com')}
					>maya@example.com (petugas)</button
				><button type="button" onclick={() => (email = 'lurah@example.com')}
					>lurah@example.com (lurah)</button
				><button type="button" onclick={() => (email = 'rtrw@example.com')}
					>rtrw@example.com (RT/RW)</button
				>
			</div>
			<form class="form" onsubmit={submit}>
				<label class="field">Alamat email<input type="email" bind:value={email} required /></label
				><label class="field"
					>Kata sandi<input type="password" bind:value={password} required /></label
				>{#if error}<p class="error" role="alert">{error}</p>{/if}<button
					class="link-button"
					type="submit">Masuk →</button
				>
				<p class="muted" style="text-align:center">
					Belum memiliki akun? <a class="text-link" href="/register">Buat akun</a>
				</p>
			</form>
		</div>
	</section>
</main>
