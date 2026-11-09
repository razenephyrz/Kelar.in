<svelte:head>
	<title>Menunggu persetujuan — Kelar.in</title>
	<meta name="description" content="Akun petugas sedang menunggu persetujuan dari lurah." />
</svelte:head>

<main class="waiting-page">
	<section class="waiting-card" aria-labelledby="waiting-title">
		<p class="eyebrow">Kelar.in</p>
		<h1 id="waiting-title">Menunggu persetujuan</h1>
		<p>
			Akun petugas kamu sedang diperiksa oleh lurah. Kami akan membuka akses layanan setelah akun
			disetujui.
		</p>
		<div class="waiting-animation" aria-hidden="true">
			<span class="waiting-orbit"></span>
			<span class="waiting-dot waiting-dot-one"></span>
			<span class="waiting-dot waiting-dot-two"></span>
			<span class="waiting-dot waiting-dot-three"></span>
		</div>
		<div class="waiting-status" role="status">
			<span></span>
			<span></span>
			<span></span>
			Sedang menunggu
		</div>
		<a class="text-link waiting-login" href="/login">Kembali ke halaman masuk <span>→</span></a>
	</section>
</main>
