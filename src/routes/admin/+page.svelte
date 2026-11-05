<script lang="ts">
	import { civic } from '#lib/store';
	import { STATUS_META } from '#lib/types';
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Operasional</p>
		<h1>Antrean layanan</h1>
		<p class="muted">Kelola pengajuan warga sesuai alur SOP layanan.</p>
	</div>
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
					{#if civic.user?.role === 'petugas'}<button class="link-button" type="button">Verifikasi</button>
					{:else if civic.user?.role === 'rt_rw'}<button class="link-button" type="button">Acc RT/RW</button>
					{:else if civic.user?.role === 'lurah'}<button class="link-button" type="button">Tanda tangan</button>
					{:else}<button class="link-button" type="button">Kelola</button>{/if}
				</div>
			</div>{/each}
	</div>
</section>
