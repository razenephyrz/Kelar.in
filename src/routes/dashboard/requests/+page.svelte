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
		<p class="eyebrow">Your files</p>
		<h1>My requests</h1>
		<p class="muted">A complete history of what you filed and what happens next.</p>
	</div>
	<a class="link-button" href="/dashboard/requests/new">+ New request</a>
</header>
<section class="surface">
	<div class="request-filters">
		<label class="field">Search<input bind:value={query} placeholder="Search ID or title" /></label>
		<label class="field"
			>Status<select bind:value={status}
				><option value="all">All statuses</option>{#each Object.keys(STATUS_META) as value}<option
						{value}>{STATUS_META[value as RequestStatus].label}</option
					>{/each}</select
			></label
		>
		<label class="field"
			>Sort<select bind:value={sort}
				><option value="updated">Last updated</option><option value="submitted"
					>Submission date</option
				><option value="target">Target date</option></select
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
								? ' · Past sample target'
								: ''}</small
						>
					</div>
					<span class={`pill ${request.status}`}>{STATUS_META[request.status].label}</span>
				</a>
				{#if ['draft', 'submitted', 'action_required'].includes(request.status)}<button
						class="delete-button"
						onclick={() => civic.deleteRequest(request.id)}
						aria-label={`Delete ${request.id}`}>Delete</button
					>{/if}
			</div>{:else}<p class="muted">No requests match these filters.</p>{/each}
	</div>
</section>
