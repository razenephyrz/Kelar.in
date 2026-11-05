<script lang="ts">
	const metrics = [
		{ label: 'Pengajuan selesai tepat waktu', value: '86%' },
		{ label: 'Rata-rata waktu penyelesaian', value: '4,2 hari' },
		{ label: 'Kepuasan warga', value: '4,6 / 5' },
		{ label: 'Pengajuan terlambat', value: '8' }
	];
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Kinerja layanan</p>
		<h1>Transparansi</h1>
		<p class="muted">Lihat kinerja layanan berdasarkan ketepatan waktu dan penilaian warga.</p>
	</div>
</header>
<div class="metrics">
	{#each metrics as metric}<div class="metric"><b>{metric.value}</b><span>{metric.label}</span></div>{/each}
</div>
<section class="surface">
	<h2 class="section-title">Penilaian penyelenggara layanan</h2>
	<div class="request-list">
		<div class="request-row"><div><strong>Petugas Kelurahan</strong><small>Kecepatan dan ketepatan proses</small></div><span class="pill approved">4,7 / 5</span></div>
		<div class="request-row"><div><strong>Lurah</strong><small>Persetujuan dan tanda tangan</small></div><span class="pill approved">4,6 / 5</span></div>
		<div class="request-row"><div><strong>RT/RW</strong><small>Verifikasi pengantar warga</small></div><span class="pill approved">4,5 / 5</span></div>
	</div>
</section>
