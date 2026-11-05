<script lang="ts">
	import { civic } from '#lib/store';
</script>

<svelte:head><title>Overview — CivicFlow</title></svelte:head>
<header class="app-header">
	<div>
		<p class="eyebrow">Your workspace</p>
		<h1>{civic.user ? `Good day, ${civic.user.name.split(' ')[0]}.` : 'Overview'}</h1>
		<p class="muted">Every request has a place, a status, and a next step.</p>
	</div>
	<a class="link-button" href="/dashboard/requests/new">+ New request</a>
</header>
<div class="metrics">
	<div class="metric"><b>{civic.myRequests.length}</b><span>Total requests</span></div>
	<div class="metric">
		<b>{civic.myRequests.filter((r) => ['submitted', 'under_review'].includes(r.status)).length}</b
		><span>In progress</span>
	</div>
	<div class="metric">
		<b>{civic.myRequests.filter((r) => r.status === 'action_required').length}</b><span
			>Need your action</span
		>
	</div>
	<div class="metric">
		<b>{civic.myRequests.filter((r) => ['approved', 'completed'].includes(r.status)).length}</b
		><span>Completed</span>
	</div>
</div>
<section class="surface">
	<div class="app-header" style="margin-bottom:10px">
		<h2 class="section-title">Recent requests</h2>
		<a class="text-link" href="/dashboard/requests">View all →</a>
	</div>
	<div class="request-list">
		{#each civic.myRequests.slice(0, 5) as request}<a
				class="request-row"
				href={`/dashboard/requests/${request.id}`}
				><div>
					<strong>{request.title}</strong><small>{request.id} · {request.documentType}</small>
				</div>
				<span class={`pill ${request.status}`}>{request.status.replace('_', ' ')}</span></a
			>{:else}<p class="muted">
				No requests yet. Create your first request to start tracking progress.
			</p>{/each}
	</div>
</section>
