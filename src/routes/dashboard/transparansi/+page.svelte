<script lang="ts">
	import { onMount } from 'svelte';
	let data = $state<{ completed: number; ratings: Record<string, { average: number; total: number }> } | null>(null);
	let error = $state('');
	onMount(async () => {
		const response = await fetch('/api/warga/transparansi');
		if (!response.ok) {
			error = 'Data transparansi belum dapat dimuat.';
			return;
		}
		data = await response.json();
	});
	const metrics = [
		{ label: 'Pengajuan selesai', value: () => data?.completed ?? '—' },
		{ label: 'Rata-rata waktu penyelesaian', value: () => '—' },
		{ label: 'Kepuasan warga', value: () => data?.ratings.petugas?.average?.toFixed(1) ?? '—' },
		{ label: 'Pengajuan terlambat', value: () => '—' }
	];
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Kinerja layanan</p>
		<h1>Transparansi</h1>
		<p class="muted">Lihat kinerja layanan berdasarkan ketepatan waktu dan penilaian warga.</p>
	</div>
</header>
{#if error}<p class="error" role="alert">{error}</p>{/if}
<div class="metrics">
	{#each metrics as metric}<div class="metric"><b>{metric.value()}</b><span>{metric.label}</span></div>{/each}
</div>
<section class="surface">
	<h2 class="section-title">Penilaian penyelenggara layanan</h2>
	<div class="request-list">
		<div class="request-row"><div><strong>Petugas Kelurahan</strong><small>Kecepatan dan ketepatan proses</small></div><span class="pill approved">{data?.ratings.petugas?.average?.toFixed(1) ?? '—'} / 5</span></div>
		<div class="request-row"><div><strong>Lurah</strong><small>Persetujuan dan tanda tangan</small></div><span class="pill approved">{data?.ratings.lurah?.average?.toFixed(1) ?? '—'} / 5</span></div>
		<div class="request-row"><div><strong>RT/RW</strong><small>Verifikasi pengantar warga</small></div><span class="pill approved">{data?.ratings.rt_rw?.average?.toFixed(1) ?? '—'} / 5</span></div>
	</div>
</section>
