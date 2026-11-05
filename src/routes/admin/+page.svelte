<script lang="ts">
	import { civic } from '#lib/store';
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Operations</p>
		<h1>Administration</h1>
		<p class="muted">A shared queue for reviewing citizen requests.</p>
	</div>
</header>
<div class="metrics">
	<div class="metric"><b>{civic.requests.length}</b><span>All requests</span></div>
	<div class="metric">
		<b>{civic.requests.filter((r) => r.status === 'under_review').length}</b><span
			>Under review</span
		>
	</div>
	<div class="metric">
		<b>{civic.requests.filter((r) => r.escalationFlag).length}</b><span>Escalated</span>
	</div>
	<div class="metric"><b>{civic.users.length}</b><span>Accounts</span></div>
</div>
<section class="surface">
	<h2 class="section-title">Review queue</h2>
	<div class="request-list">
		{#each civic.requests as request}<div class="request-row">
				<div>
					<strong>{request.title}</strong><small
						>{request.id} · owned by {civic.users.find((u) => u.id === request.ownerId)?.name ??
							'Unknown'}</small
					>
				</div>
				<span class={`pill ${request.status}`}>{request.status.replace('_', ' ')}</span>
			</div>{/each}
	</div>
</section>
