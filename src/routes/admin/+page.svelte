<script lang="ts">
	import { civic } from '#lib/store';
	import { ROLE_META, STATUS_META } from '#lib/types';
	import { goto } from '$app/navigation';

	let message = $state('');
	let showOfflineForm = $state(false);
	let offlineOwner = $state('u_citizen');
	let offlineTitle = $state('');

	function runAction(action: () => boolean, success: string) {
		if (action()) message = success;
	}

	function addOfflineRequest(event: SubmitEvent) {
		event.preventDefault();
		const request = civic.createOfflineRequest({
			ownerId: offlineOwner,
			documentType: 'Surat Domisili',
			title: offlineTitle,
			description: 'Pengajuan dicatat petugas dari layanan tatap muka.',
			targetDays: 7
		});
		if (request) {
			message = `${request.id} berhasil dicatat dari layanan offline.`;
			offlineTitle = '';
			showOfflineForm = false;
		}
	}
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Operasional</p>
		<h1>Antrean layanan</h1>
		<p class="muted">{civic.user ? ROLE_META[civic.user.role].description : ''}</p>
	</div>
	{#if civic.can('request:create_offline')}<button class="link-button" type="button" onclick={() => (showOfflineForm = !showOfflineForm)}
		>+ Catat pengajuan offline</button
	>{/if}
</header>
<div class="metrics">
	<div class="metric"><b>{civic.requests.length}</b><span>Semua pengajuan</span></div>
	<div class="metric">
		<b>{civic.requests.filter((r) => r.status === 'under_review').length}</b><span
			>Perlu diverifikasi</span
		>
	</div>
	<div class="metric">
		<b>{civic.requests.filter((r) => r.escalationFlag).length}</b><span>Terlambat</span>
	</div>
	<div class="metric"><b>{civic.users.length}</b><span>Akun</span></div>
</div>
<section class="surface">
	<h2 class="section-title">Antrean pengajuan</h2>
	<p class="muted">
		{#if civic.user?.role === 'rt_rw'}
			Periksa pengajuan Surat Domisili yang membutuhkan acc RT/RW.
		{:else if civic.user?.role === 'lurah'}
			Tanda tangani pengajuan yang mensyaratkan persetujuan lurah.
		{:else if civic.user?.role === 'petugas'}
			Verifikasi kelengkapan berkas dan teruskan pengajuan sesuai SOP.
		{:else}
			Akses super admin untuk mengatur peran akun, layanan, dan SOP.
		{/if}
	</p>
	<div class="request-list">
		{#each civic.requests as request}<div class="request-row">
				<div>
					<strong>{request.title}</strong><small
						>{request.id} · pemohon: {civic.users.find((u) => u.id === request.ownerId)?.name ??
							'Tidak diketahui'}</small
					>
				</div>
				<div style="display:flex;align-items:center;gap:10px">
					<span class={`pill ${request.status}`}>{STATUS_META[request.status].label}</span>
					{#if civic.can('request:accept') && ['submitted', 'action_required'].includes(request.status)}
						<button class="link-button" type="button" onclick={() => runAction(() => civic.acceptRequest(request.id), 'Pengajuan diterima petugas.')}>Terima</button>
					{:else if civic.can('request:approve') && !['approved', 'completed'].includes(request.status)}
						<button class="link-button" type="button" onclick={() => runAction(() => civic.approveRequest(request.id), 'Persetujuan dan tanda tangan dicatat.')}>Setujui & tanda tangani</button>
					{:else if civic.can('system:manage')}<a class="link-button" href="/dashboard/profile">Kelola role</a>
					{:else}<span class="muted">Menunggu tindakan</span>{/if}
				</div>
			</div>{/each}
	</div>
</section>
{#if showOfflineForm}<form class="surface form" onsubmit={addOfflineRequest}>
	<h2 class="section-title">Catat pengajuan dari loket</h2>
	<label class="field">Pemohon<select bind:value={offlineOwner}>
		{#each civic.users.filter((user) => user.role === 'warga') as user}<option value={user.id}>{user.name}</option>{/each}
	</select></label>
	<label class="field">Judul pengajuan<input bind:value={offlineTitle} required placeholder="Contoh: Surat domisili untuk sekolah" /></label>
	<button class="link-button" type="submit">Simpan pengajuan offline</button>
</form>{/if}
{#if message}<p class="demo-banner">{message}</p>{/if}
