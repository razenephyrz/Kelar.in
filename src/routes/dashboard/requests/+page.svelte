<script lang="ts">
	import { page } from '$app/state';
	import { civic } from '#lib/store';
	import { STATUS_META, type RequestStatus } from '#lib/types';
	import { formatDate, isOverdue } from '../../../lib/utils';

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
		...new Set(civic.myRequests.map((request) => request.documentType))
	]);
	const filteredRequests = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return civic.myRequests
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

	function cycleSort() {
		sort = sort === 'updated' ? 'submitted' : sort === 'submitted' ? 'target' : 'updated';
	}
</script>

<section class="requests-hero" aria-labelledby="requests-title">
	<div>
		<p class="requests-kicker">Request management</p>
		<h1 id="requests-title">My requests</h1>
		<p>Search, filter, and open any file. All counts update live from your stored records.</p>
		<a class="hero-new-request" href="/dashboard/requests/new"><span>+</span> New<br />request</a>
	</div>
</section>

<section class="requests-panel" aria-label="Request filters and results">
	<div class="requests-toolbar">
		<label class="request-search"
			><span aria-hidden="true">⌕</span><input
				bind:value={query}
				placeholder="Search by ID or title..."
				aria-label="Search by request ID or title"
			/></label
		>
		<label class="request-select"
			><select bind:value={typeFilter} aria-label="Filter by document type"
				><option value="all">All types</option>{#each requestTypes.slice(1) as type}<option
						value={type}>{type}</option
					>{/each}</select
			></label
		>
		<button class="sort-button" type="button" onclick={cycleSort} aria-label="Change request sort"
			>↕ <span
				>{sort === 'updated'
					? 'Last updated'
					: sort === 'submitted'
						? 'Submission date'
						: 'Target date'}</span
			></button
		>
	</div>
	<div class="status-filters" aria-label="Filter by status">
		{#each statusFilters as filter}<button
				class:status-filter-active={status === filter}
				type="button"
				onclick={() => (status = filter)}
				>{filter === 'all' ? 'All' : STATUS_META[filter].label}</button
			>{/each}
	</div>
	<p class="result-count">
		Showing <strong>{filteredRequests.length}</strong> of {civic.myRequests.length} requests · {civic
			.procedures.length} procedure guides available
	</p>
	<div class="requests-table-wrap">
		<table class="requests-table">
			<thead
				><tr
					><th>Request</th><th>Status</th><th>Submitted</th><th>Target<br />(sample)</th><th
						>Actions</th
					></tr
				></thead
			>
			<tbody>
				{#each filteredRequests as request}
					<tr>
						<td
							><a class="table-request" href={`/dashboard/requests/${request.id}`}
								><strong>{request.id}</strong><b>{request.title}</b><small
									>{request.documentType}</small
								></a
							></td
						>
						<td
							><span class={`request-status ${request.status}`}
								><i></i>{STATUS_META[request.status].label}</span
							>{#if isOverdue(request.targetCompletionAt, request.status)}<span class="overdue-flag"
									>Past sample<br />target</span
								>{/if}</td
						>
						<td
							><span class="table-date">{formatDate(request.createdAt)}</span><small
								>{formatDate(request.updatedAt)} update</small
							></td
						>
						<td><span class="table-date">{formatDate(request.targetCompletionAt)}</span></td>
						<td
							><div class="table-actions">
								<a href={`/dashboard/requests/${request.id}`}>Open</a
								>{#if ['draft', 'submitted', 'action_required'].includes(request.status)}<button
										type="button"
										onclick={() => civic.deleteRequest(request.id)}
										aria-label={`Delete ${request.id}`}>⌫</button
									>{/if}
							</div></td
						>
					</tr>
				{:else}
					<tr><td colspan="5"><p class="muted">No requests match these filters.</p></td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
