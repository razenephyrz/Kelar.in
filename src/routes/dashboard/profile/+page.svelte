<script lang="ts">
	import { civic } from '#lib/store';
	import { ROLE_META, type Role } from '#lib/types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let name = $state('');
	let email = $state('');
	let currentPassword = $state('');
	let newPassword = $state('');
	let message = $state('');
	let error = $state('');

	$effect(() => {
		name = data?.authUser?.name ?? civic.user?.name ?? '';
		email = data?.authUser?.email ?? civic.user?.email ?? '';
	});

	const userRole = $derived<Role>(
		(data?.authUser?.role ?? civic.user?.role) && (data?.authUser?.role ?? civic.user?.role) in ROLE_META
			? ((data?.authUser?.role ?? civic.user?.role) as Role)
			: 'warga'
	);
	const roleMeta = $derived(ROLE_META[userRole] ?? ROLE_META.warga);
	const avatarInitial = $derived((name || civic.user?.name || 'W').trim().slice(0, 1) || 'W');

	const documents = $derived(
		civic.myRequests.reduce((total, request) => total + Object.keys(request.metadata).length, 0)
	);

	function saveProfile(event: SubmitEvent) {
		event.preventDefault();
		const result = civic.updateProfile({ name, email });
		error = result.ok ? '' : result.error ?? 'Profil tidak dapat diperbarui.';
		message = result.ok ? 'Profil berhasil diperbarui.' : '';
	}

	function savePassword(event: SubmitEvent) {
		event.preventDefault();
		const result = civic.changePassword(currentPassword, newPassword);
		error = result.ok ? '' : result.error ?? 'Password tidak dapat diperbarui.';
		message = result.ok ? 'Password berhasil diperbarui.' : '';
		if (result.ok) {
			currentPassword = '';
			newPassword = '';
		}
	}
</script>

<svelte:head><title>Profil & dokumen — Kelar.in</title></svelte:head>

<header class="app-header">
	<div>
		<p class="eyebrow">Accountability</p>
		<h1>Profil & dokumen</h1>
		<p class="muted">Tinjau identitas, kredensial, dan riwayat layanan yang terkait dengan akunmu.</p>
	</div>
</header>

{#if message}<p class="success">{message}</p>{/if}
{#if error}<p class="error">{error}</p>{/if}

<div class="profile-layout">
	<section class="surface profile-summary">
		<div class="profile-identity">
			<div class="profile-avatar">{avatarInitial}</div>
			<div>
				<h2>{name || civic.user?.name || 'Pengguna'}</h2>
				<p class="muted">{roleMeta.label}</p>
			</div>
		</div>
		<p class="muted">{roleMeta.description}</p>
		<div class="profile-stats">
			<div><b>{civic.myRequests.length}</b><span>Pengajuan</span></div>
			<div><b>{civic.myRequests.filter((request) => request.status === 'completed').length}</b><span>Selesai</span></div>
			<div><b>{documents}</b><span>Data dokumen</span></div>
		</div>
	</section>

	<form class="surface form" onsubmit={saveProfile}>
		<div>
			<p class="eyebrow">Informasi dasar</p>
			<h2 class="section-title">Edit profil</h2>
		</div>
		<label class="field">Nama lengkap<input bind:value={name} required /></label>
		<label class="field">Email akun<input bind:value={email} type="email" required /></label>
		<button class="link-button" type="submit">Simpan perubahan</button>
	</form>

	<form class="surface form" onsubmit={savePassword}>
		<div>
			<p class="eyebrow">Keamanan</p>
			<h2 class="section-title">Perbarui kredensial</h2>
		</div>
		<label class="field">Password saat ini<input bind:value={currentPassword} type="password" required /></label>
		<label class="field">Password baru<input bind:value={newPassword} type="password" minlength="8" required /></label>
		<p class="muted">Gunakan minimal 8 karakter. Untuk sesi demo, password awal adalah <strong>civic1234</strong>.</p>
		<button class="link-button" type="submit">Perbarui password</button>
	</form>

	<section class="surface profile-documents">
		<div class="profile-section-heading">
			<div>
				<p class="eyebrow">Jejak layanan</p>
				<h2 class="section-title">Dokumen dan pengajuan</h2>
			</div>
			<a class="text-link" href="/dashboard/requests">Lihat semua →</a>
		</div>
		{#each civic.myRequests.slice(0, 4) as request}
			<a class="profile-document-row" href={`/dashboard/requests/${request.id}`}>
				<span><strong>{request.title}</strong><small>{request.id} · {request.documentType}</small></span>
				<span class={`pill ${request.status}`}>{request.status === 'completed' ? 'Selesai' : 'Berjalan'}</span>
			</a>
		{:else}
			<p class="muted">Belum ada dokumen atau pengajuan yang tercatat.</p>
		{/each}
	</section>
</div>

<style>
	.profile-layout {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
	}
	.profile-summary,
	.profile-documents {
		grid-column: 1 / -1;
	}
	.profile-summary {
		display: grid;
		gap: 22px;
	}
	.profile-identity {
		display: flex;
		align-items: center;
		gap: 15px;
	}
	.profile-identity h2 {
		margin: 0;
		font-size: 24px;
	}
	.profile-avatar {
		display: grid;
		place-items: center;
		width: 58px;
		height: 58px;
		background: var(--navy);
		color: #fff;
		font: 700 24px/1 Fraunces, serif;
	}
	.profile-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-top: 1px solid var(--line);
		padding-top: 18px;
	}
	.profile-stats div {
		display: grid;
		gap: 4px;
	}
	.profile-stats b {
		font: 650 28px/1 Fraunces, serif;
		color: var(--navy);
	}
	.profile-stats span,
	.profile-document-row small {
		color: var(--muted);
		font-size: 12px;
	}
	.profile-section-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 12px;
	}
	.profile-document-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 14px 0;
		border-top: 1px solid var(--line);
	}
	.profile-document-row span:first-child {
		display: grid;
		gap: 4px;
	}
	@media (max-width: 720px) {
		.profile-layout {
			grid-template-columns: 1fr;
		}
		.profile-stats {
			gap: 12px;
		}
		.profile-section-heading,
		.profile-document-row {
			align-items: start;
			flex-direction: column;
		}
	}
</style>
