<script lang="ts">
	import { civic } from '#lib/store';
	import { formatDate } from '../../lib/utils';

	const total = $derived(civic.myRequests.length);
	const inProgress = $derived(civic.myRequests.filter((request) => ['submitted', 'under_review'].includes(request.status)).length);
	const actionRequired = $derived(civic.myRequests.filter((request) => request.status === 'action_required').length);
	const done = $derived(civic.myRequests.filter((request) => ['approved', 'completed'].includes(request.status)).length);
	const today = new Date();
</script>

<svelte:head><title>Overview — CivicFlow</title></svelte:head>
<section class="overview-hero" aria-labelledby="overview-title">
	<div class="overview-copy">
		<p class="overview-date">{today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
		<h1 id="overview-title">Good afternoon,<br />{civic.user?.name.split(' ')[0]}.</h1>
		<p class="overview-summary">You have {total} requests · {inProgress} in progress · {actionRequired} needs your attention.</p>
		<div class="overview-actions">
			<a class="hero-new-request" href="/dashboard/requests/new"><span>+</span> New<br />request</a>
			<a class="hero-view-all" href="/dashboard/requests">View<br />all <span>→</span></a>
		</div>
	</div>
	<div class="overview-metrics" aria-label="Request summary">
		<div><b>{total}</b><span>Total</span></div>
		<div><b>{inProgress}</b><span>In progress</span></div>
		<div><b>{actionRequired}</b><span>Action</span></div>
		<div><b>{done}</b><span>Done</span></div>
	</div>
</section>

<section class="overview-lower">
	<div class="overview-section-heading"><div><p class="eyebrow">Keep moving</p><h2 class="section-title">Recent requests</h2></div><a class="text-link" href="/dashboard/requests">View all →</a></div>
	<div class="overview-request-list">
		{#each civic.myRequests.slice(0, 4) as request}
			<a class="overview-request" href={`/dashboard/requests/${request.id}`}><span class="request-mark">{request.title.slice(0, 1)}</span><span class="overview-request-copy"><strong>{request.title}</strong><small>{request.id} · Updated {formatDate(request.updatedAt)}</small></span><span class={`pill ${request.status}`}>{request.status.replace('_', ' ')}</span><span class="overview-arrow">→</span></a>
		{:else}<p class="muted">No requests yet. Create your first request to start tracking progress.</p>{/each}
	</div>
</section>
