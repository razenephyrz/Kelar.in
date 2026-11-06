<script lang="ts">
	import { onMount } from 'svelte';
	import { civic } from '#lib/store';
	import { formatDate } from '../../lib/utils';

	type CitizenRequest = {
		id: string;
		title: string;
		status: string;
		updatedAt: string | Date;
	};
	let citizenRequests = $state<CitizenRequest[]>([]);
	let citizenError = $state('');
	onMount(async () => {
		if (civic.user?.role !== 'warga') return;
		const response = await fetch('/api/warga/requests');
		if (!response.ok) {
			citizenError = 'Data pengajuan belum dapat dimuat. Pastikan koneksi server tersedia.';
			return;
		}
		citizenRequests = await response.json();
	});

	const total = $derived(citizenRequests.length);
	const inProgress = $derived(citizenRequests.filter((request) => ['submitted', 'under_review'].includes(request.status)).length);
	const actionRequired = $derived(citizenRequests.filter((request) => request.status === 'action_required').length);
	const done = $derived(citizenRequests.filter((request) => ['approved', 'completed'].includes(request.status)).length);
	const today = new Date();
</script>

<svelte:head><title>Dashboard — Kelar.in</title></svelte:head>

{#if civic.user?.role === 'warga'}
	<section class="overview-hero" aria-labelledby="overview-title">
		<div class="overview-copy">
			<p class="overview-date">{today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
			<h1 id="overview-title">Selamat datang,<br />{civic.user.name.split(' ')[0]}.</h1>
			<p class="overview-summary">Kamu memiliki {total} pengajuan · {inProgress} sedang diproses · {actionRequired} perlu perhatian.</p>
			<div class="overview-actions">
				<a class="hero-new-request" href="/dashboard/requests/new"><span>+</span> Pengajuan<br />baru</a>
				<a class="hero-view-all" href="/dashboard/requests">Lihat<br />semua <span>→</span></a>
			</div>
		</div>
		<div class="overview-metrics" aria-label="Ringkasan pengajuan">
			<div><b>{total}</b><span>Total</span></div><div><b>{inProgress}</b><span>Diproses</span></div>
			<div><b>{actionRequired}</b><span>Perlu tindakan</span></div><div><b>{done}</b><span>Selesai</span></div>
		</div>
	</section>
	{#if citizenError}<p class="error" role="alert">{citizenError}</p>{/if}
	<section class="overview-lower">
		<div class="overview-section-heading"><div><p class="eyebrow">Pantau terus</p><h2 class="section-title">Pengajuan terbaru</h2></div><a class="text-link" href="/dashboard/requests">Lihat semua →</a></div>
		<div class="overview-request-list">
			{#each citizenRequests.slice(0, 4) as request}
				<a class="overview-request" href={`/dashboard/requests/${request.id}`}><span class="request-mark">{request.title.slice(0, 1)}</span><span class="overview-request-copy"><strong>{request.title}</strong><small>{request.id} · Diperbarui {formatDate(new Date(request.updatedAt).toISOString())}</small></span><span class={`pill ${request.status}`}>{request.status.replace('_', ' ')}</span><span class="overview-arrow">→</span></a>
			{:else}<p class="muted">Belum ada pengajuan. Buat pengajuan pertama untuk mulai melacak proses.</p>{/each}
		</div>
	</section>
{:else if civic.user?.role === 'petugas'}
	<header class="app-header"><div><p class="eyebrow">Meja kerja petugas</p><h1>Verifikasi pengajuan</h1><p class="muted">Terima pengajuan warga, periksa kelengkapan berkas, dan teruskan sesuai SOP.</p></div><a class="link-button" href="/admin">Buka antrean →</a></header>
	<div class="metrics">
		<div class="metric"><b>{civic.requests.filter((r) => r.status === 'submitted').length}</b><span>Menunggu verifikasi</span></div>
		<div class="metric"><b>{civic.requests.filter((r) => r.status === 'under_review').length}</b><span>Sedang diproses</span></div>
		<div class="metric"><b>{civic.requests.filter((r) => r.status === 'action_required').length}</b><span>Perlu perbaikan</span></div>
		<div class="metric"><b>{civic.requests.filter((r) => r.escalationFlag).length}</b><span>Melewati estimasi</span></div>
	</div>
	<section class="surface"><h2 class="section-title">Tugas petugas</h2><div class="request-list">
		<div class="request-row"><div><strong>Verifikasi berkas warga</strong><small>Pastikan identitas dan dokumen pendukung sesuai checklist.</small></div><span class="pill under_review">Mulai</span></div>
		<div class="request-row"><div><strong>Tambahkan pengajuan offline</strong><small>Catat pengajuan warga yang datang langsung ke kelurahan.</small></div><span class="pill submitted">Buka</span></div>
		<div class="request-row"><div><strong>Perbarui status melalui inbox</strong><small>Kirim informasi proses dan permintaan perbaikan kepada warga.</small></div><span class="pill approved">Kelola</span></div>
	</div></section>
{:else if civic.user?.role === 'rt_rw'}
	<header class="app-header"><div><p class="eyebrow">Persetujuan wilayah</p><h1>Antrean acc RT/RW</h1><p class="muted">Periksa pengantar dan berikan persetujuan untuk pengajuan Surat Domisili warga.</p></div><a class="link-button" href="/admin">Lihat antrean →</a></header>
	<div class="metrics"><div class="metric"><b>3</b><span>Menunggu acc</span></div><div class="metric"><b>12</b><span>Disetujui bulan ini</span></div><div class="metric"><b>1</b><span>Perlu dilengkapi</span></div><div class="metric"><b>4,5 / 5</b><span>Rating warga</span></div></div>
	<section class="surface"><h2 class="section-title">Tugas RT/RW</h2><div class="request-list">
		<div class="request-row"><div><strong>Surat Domisili — Andi Pratama</strong><small>Periksa alamat, identitas, dan surat pengantar warga.</small></div><span class="pill under_review">Periksa</span></div>
		<div class="request-row"><div><strong>Berikan acc atau catatan</strong><small>Setujui pengajuan atau kembalikan dengan alasan yang jelas.</small></div><span class="pill approved">Tindakan</span></div>
	</div></section>
{:else if civic.user?.role === 'lurah'}
	<header class="app-header"><div><p class="eyebrow">Persetujuan pimpinan</p><h1>Validasi dan tanda tangan</h1><p class="muted">Tinjau pengajuan yang membutuhkan acc lurah sebelum surat diterbitkan.</p></div><a class="link-button" href="/admin">Lihat pengajuan →</a></header>
	<div class="metrics"><div class="metric"><b>2</b><span>Menunggu tanda tangan</span></div><div class="metric"><b>18</b><span>Disetujui bulan ini</span></div><div class="metric"><b>2</b><span>Dikembalikan</span></div><div class="metric"><b>4,6 / 5</b><span>Rating warga</span></div></div>
	<section class="surface"><h2 class="section-title">Tugas lurah</h2><div class="request-list">
		<div class="request-row"><div><strong>Surat Keterangan Belum Menikah</strong><small>Pastikan hasil verifikasi petugas lengkap sebelum acc.</small></div><span class="pill under_review">Tinjau</span></div>
		<div class="request-row"><div><strong>Surat Domisili</strong><small>Periksa persetujuan RT/RW dan catatan petugas.</small></div><span class="pill approved">Tanda tangan</span></div>
	</div></section>
{:else}
	<header class="app-header"><div><p class="eyebrow">Pengaturan sistem</p><h1>Kelola Kelar.in</h1><p class="muted">Atur akun, layanan, estimasi, dan alur SOP untuk kebutuhan demo lomba.</p></div><a class="link-button" href="/admin">Buka pengaturan →</a></header>
	<div class="metrics"><div class="metric"><b>{civic.users.length}</b><span>Total akun</span></div><div class="metric"><b>{civic.procedures.length}</b><span>Layanan aktif</span></div><div class="metric"><b>{civic.requests.length}</b><span>Data pengajuan</span></div><div class="metric"><b>5</b><span>Role sistem</span></div></div>
	<section class="surface"><h2 class="section-title">Yang dapat dikelola</h2><div class="request-list">
		<div class="request-row"><div><strong>Peran akun</strong><small>Atur akses warga, petugas, lurah, dan RT/RW.</small></div><span class="pill approved">Kelola</span></div>
		<div class="request-row"><div><strong>Layanan dan checklist</strong><small>Atur persyaratan KTP, Akta Kematian, Slip Gaji, Domisili, dan SKBM.</small></div><span class="pill approved">Kelola</span></div>
		<div class="request-row"><div><strong>SOP dan estimasi</strong><small>Tentukan apakah layanan memerlukan acc RT/RW atau lurah.</small></div><span class="pill approved">Kelola</span></div>
	</div></section>
{/if}
