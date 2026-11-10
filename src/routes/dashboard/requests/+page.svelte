<script lang="ts">
	import { page } from '$app/state';
	import { STATUS_META, type RequestStatus } from '#lib/types';
	import { formatDate, isOverdue } from '../../../lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state(page.url.searchParams.get('q') ?? '');
	let status = $state<'all' | RequestStatus>('all');
	let typeFilter = $state('all');
	let sort = $state<'updated' | 'submitted' | 'target'>('updated');

	const statusFilters: Array<'all' | RequestStatus> = [
		'all',
		'draft',
		'submitted',
		'under_review',
		'action_required',
		'approved',
		'completed',
		'rejected'
	];
	const requestTypes = $derived([
		'all',
		...new Set(data.requests.map((request) => request.documentType))
	]);
	const filteredRequests = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return data.requests
			.filter((request) => {
				const matchesQuery =
					!needle || `${request.id} ${request.title}`.toLowerCase().includes(needle);
				return (
					matchesQuery &&
					(status === 'all' || request.status === status) &&
					(typeFilter === 'all' || request.documentType === typeFilter)
				);
			})
			.sort((a, b) => {
				const first =
					sort === 'target'
						? new Date(a.targetCompletionAt).toISOString()
						: sort === 'submitted'
							? new Date(a.createdAt).toISOString()
							: new Date(a.updatedAt).toISOString();
				const second =
					sort === 'target'
						? new Date(b.targetCompletionAt).toISOString()
						: sort === 'submitted'
							? new Date(b.createdAt).toISOString()
							: new Date(b.updatedAt).toISOString();
				return +new Date(second) - +new Date(first);
			});
	});
</script>

<svelte:head><title>Pengajuan saya — Kelar.in</title></svelte:head>

<div class="requests-page">
	<section class="requests-hero" aria-labelledby="requests-title">
		<div>
			<p class="requests-kicker">Ruang layanan warga</p>
			<h1 id="requests-title">Pengajuan saya</h1>
			<p>Kelola pengajuan, lihat statusnya, dan lengkapi berkas yang masih diperlukan.</p>
			<a class="hero-new-request" href="/dashboard/requests/new"
				><span>+</span> Ajukan layanan baru</a
			>
		</div>
		<div class="requests-hero-note">
			<strong>{data.requests.length}</strong>
			<span>Total pengajuan</span>
			<small>Data tersimpan di ruang layanan kamu.</small>
		</div>
	</section>

	<section class="surface requests-panel" aria-labelledby="filter-title">
		<div class="requests-panel-heading">
			<div>
				<p class="requests-kicker">Temukan berkas</p>
				<h2 id="filter-title">Daftar pengajuan</h2>
			</div>
			<p class="result-count">
				<strong>{filteredRequests.length}</strong> dari {data.requests.length} pengajuan tampil
			</p>
		</div>

		<div class="request-filters">
			<label class="field">
				<span>Cari pengajuan</span>
				<input bind:value={query} placeholder="Cari ID atau judul" />
			</label>
			<label class="field">
				<span>Jenis layanan</span>
				<select bind:value={typeFilter}>
					<option value="all">Semua jenis layanan</option>
					{#each requestTypes.slice(1) as type}<option value={type}>{type}</option>{/each}
				</select>
			</label>
			<label class="field">
				<span>Urutkan berdasarkan</span>
				<select bind:value={sort}>
					<option value="updated">Pembaruan terakhir</option>
					<option value="submitted">Tanggal pengajuan</option>
					<option value="target">Tanggal target</option>
				</select>
			</label>
		</div>

		<div class="status-filters" aria-label="Saring berdasarkan status">
			{#each statusFilters as filter}
				<button
					class:status-filter-active={status === filter}
					type="button"
					onclick={() => (status = filter)}
				>
					{filter === 'all' ? 'Semua' : STATUS_META[filter].label}
				</button>
			{/each}
		</div>

		<div class="requests-table-wrap">
			<table class="requests-table">
				<thead>
					<tr>
						<th>Pengajuan</th>
						<th>Status</th>
						<th>Diperbarui</th>
						<th>Target</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredRequests as request}
						<tr>
							<td>
								<a class="table-request" href={`/dashboard/requests/${request.id}`}>
									<strong>{request.id}</strong>
									<b>{request.title}</b>
									<small>{request.documentType}</small>
								</a>
							</td>
							<td>
								<span class={`pill ${request.status}`}>{STATUS_META[request.status].label}</span>
							</td>
							<td>
								<small>{formatDate(request.updatedAt)}</small>
							</td>
							<td>
								<small class:date-overdue={isOverdue(request.targetCompletionAt, request.status)}>
									{formatDate(request.targetCompletionAt)}
									{isOverdue(request.targetCompletionAt, request.status)
										? ' · Melewati estimasi'
										: ''}
								</small>
							</td>
							<td>
								<a class="table-action" href={`/dashboard/requests/${request.id}`}>Buka</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td class="empty-table" colspan="5">
								<strong>Tidak ada pengajuan yang sesuai.</strong>
								<span>Coba ubah kata kunci atau filter yang digunakan.</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	.field {
		display: grid;
		gap: 7px;
		color: var(--muted);
		font-size: 11px;
		font-weight: 600;
	}

	.field input,
	.field select {
		width: 100%;
		min-height: 42px;
		padding: 0 12px;
		border: 1px solid var(--line);
		border-radius: 0;
		background: #fff;
		color: var(--ink);
		font-size: 12px;
		outline: 0;
	}

	.field input:focus,
	.field select:focus {
		border-color: var(--blue);
		box-shadow: 0 0 0 3px rgba(96, 150, 186, 0.14);
	}

	.requests-table td {
		height: 78px;
	}

	.requests-table td > small {
		white-space: normal;
	}

	.date-overdue {
		color: #8e4444 !important;
		font-weight: 700;
	}

	.table-action {
		color: var(--navy);
		font-size: 11px;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.empty-table {
		display: grid;
		gap: 5px;
		padding: 35px 20px !important;
		color: var(--muted);
		text-align: center;
	}

	.empty-table strong {
		color: var(--ink);
		font-size: 13px;
	}

	.empty-table span {
		font-size: 11px;
	}

</style>
