<script lang="ts">
	import { page } from '$app/state';
	import { civic } from '#lib/store';
	import { STATUS_META, type RequestStatus } from '#lib/types';
	import { formatDate, isOverdue } from '../../../lib/utils';

	let query = $state(page.url.searchParams.get('q') ?? '');
	let status = $state<'all' | RequestStatus>('all');
	let sort = $state<'updated' | 'submitted' | 'target'>('updated');
	const filteredRequests = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return civic.myRequests
			.filter((request) => {
				const matchesQuery =
					!needle || `${request.id} ${request.title}`.toLowerCase().includes(needle);
				return matchesQuery && (status === 'all' || request.status === status);
			})
			.sort((a, b) => {
				const first =
					sort === 'target'
						? a.targetCompletionAt
						: sort === 'submitted'
							? a.createdAt
							: a.updatedAt;
				const second =
					sort === 'target'
						? b.targetCompletionAt
						: sort === 'submitted'
							? b.createdAt
							: b.updatedAt;
				return +new Date(second) - +new Date(first);
			});
	});
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Berkas kamu</p>
		<h1>Pengajuan saya</h1>
		<p class="muted">Riwayat pengajuan dan tahapan prosesnya.</p>
	</div>
	<a class="link-button" href="/dashboard/requests/new">+ Pengajuan baru</a>
</header>
<section class="surface">
	<div class="request-filters">
		<label class="field">Cari<input bind:value={query} placeholder="Cari ID atau judul" /></label>
		<label class="field"
			>Status<select bind:value={status}
				><option value="all">Semua status</option>{#each Object.keys(STATUS_META) as value}<option
						{value}>{STATUS_META[value as RequestStatus].label}</option
					>{/each}</select
			></label
		>
		<label class="field"
			>Sort<select bind:value={sort}
				><option value="updated">Pembaruan terakhir</option><option value="submitted"
					>Tanggal pengajuan</option
				><option value="target">Tanggal target</option></select
			></label
		>
	</div>
	<div class="request-list">
		{#each filteredRequests as request}<div class="request-row">
				<a class="request-row" href={`/dashboard/requests/${request.id}`}
					><div>
						<strong>{request.title}</strong><small
							>{request.id} · {request.assignedDepartment}</small
						>
						<small
							>{formatDate(request.updatedAt)}{isOverdue(request.targetCompletionAt, request.status)
								? ' · Melewati estimasi'
								: ''}</small
						>
					</div>
					<span class={`pill ${request.status}`}>{STATUS_META[request.status].label}</span>
				</a>
				{#if ['draft', 'submitted', 'action_required'].includes(request.status)}<button
						class="delete-button"
						onclick={() => civic.deleteRequest(request.id)}
						aria-label={`Hapus ${request.id}`}>Hapus</button
					>{/if}
			</div>{:else}<p class="muted">Tidak ada pengajuan yang sesuai filter.</p>{/each}
	</div>
</section>
