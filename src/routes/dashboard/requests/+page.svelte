<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { STATUS_META, type RequestStatus } from '#lib/types';
	import { formatDate, isOverdue } from '../../../lib/utils';

	let query = $state(page.url.searchParams.get('q') ?? '');
	let status = $state<'all' | RequestStatus>('all');
	let sort = $state<'updated' | 'submitted' | 'target'>('updated');
	let requests = $state<
		{
			id: string;
			title: string;
			status: RequestStatus;
			assignedDepartment: string;
			updatedAt: string | Date;
			createdAt: string | Date;
			targetCompletionAt: string | Date;
		}[]
	>([]);
	let error = $state('');
	onMount(async () => {
		const response = await fetch('/api/warga/requests');
		if (!response.ok) {
			error = 'Pengajuan belum dapat dimuat. Pastikan koneksi server tersedia.';
			return;
		}
		requests = await response.json();
	});
	const filteredRequests = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return requests
			.filter((request) => {
				const matchesQuery =
					!needle || `${request.id} ${request.title}`.toLowerCase().includes(needle);
				return matchesQuery && (status === 'all' || request.status === status);
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

<header class="app-header">
	<div>
		<p class="eyebrow">Berkas kamu</p>
		<h1>Pengajuan saya</h1>
		<p class="muted">Riwayat pengajuan dan tahapan prosesnya.</p>
	</div>
	<a class="link-button" href="/dashboard/requests/new">+ Pengajuan baru</a>
</header>
{#if error}<p class="error" role="alert">{error}</p>{/if}
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
							>{formatDate(new Date(request.updatedAt).toISOString())}{isOverdue(new Date(request.targetCompletionAt).toISOString(), request.status)
								? ' · Melewati estimasi'
								: ''}</small
						>
					</div>
					<span class={`pill ${request.status}`}>{STATUS_META[request.status].label}</span>
				</a>
			</div>{:else}<p class="muted">Tidak ada pengajuan yang sesuai filter.</p>{/each}
	</div>
</section>
