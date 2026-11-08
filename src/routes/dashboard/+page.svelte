<script lang="ts">
	import { civic } from '#lib/store';
	import { STATUS_META, PIPELINE_STAGES, statusToStageIndex } from '#lib/types';
	import { daysUntil, formatDate, isOverdue, progressForStatus, timeAgo } from '../../lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const userName = $derived(data?.authUser?.name || civic.user?.name || 'Warga');
	const firstName = $derived(userName.trim().split(' ')[0] || 'Warga');

	const total = $derived(civic.myRequests.length);
	const inProgress = $derived(
		civic.myRequests.filter((request) => ['submitted', 'under_review'].includes(request.status))
			.length
	);
	const actionNeeded = $derived(
		civic.myRequests.filter((request) => request.status === 'action_required').length
	);
	const completed = $derived(
		civic.myRequests.filter((request) => ['approved', 'completed'].includes(request.status)).length
	);
	const latest = $derived(
		civic.myRequests.find((request) => request.status !== 'draft') ?? civic.myRequests[0]
	);
	const actionList = $derived(
		civic.myRequests.filter((request) => request.status === 'action_required')
	);
	const today = new Date();
	const greeting =
		today.getHours() < 12
			? 'Good morning'
			: today.getHours() < 18
				? 'Good afternoon'
				: 'Good evening';
</script>

<svelte:head><title>Overview — CivicFlow</title></svelte:head>

<div class="dashboard-overview">
	<section class="overview-hero" aria-labelledby="overview-title">
		<div class="overview-copy">
			<p class="overview-date">
				{today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
			</p>
			<h1 id="overview-title">{greeting},<br />{firstName}.</h1>
			<p class="overview-summary">
				{total
					? `You have ${total} requests · ${inProgress} in progress${actionNeeded ? ` · ${actionNeeded} needs your attention` : ''}.`
					: 'You have no requests yet — file your first one and watch it move.'}
			</p>
			<div class="overview-actions">
				<a class="hero-new-request" href="/dashboard/requests/new"
					><span>+</span> New<br />request</a
				><a class="hero-view-all" href="/dashboard/requests">View<br />all <span>→</span></a>
			</div>
		</div>
		<div class="overview-metrics" aria-label="Request summary">
			<div><b>{total}</b><span>Total</span></div>
			<div><b>{inProgress}</b><span>In progress</span></div>
			<div><b>{actionNeeded}</b><span>Action</span></div>
			<div><b>{completed}</b><span>Done</span></div>
		</div>
	</section>

	<div class="demo-banner">
		<span>✓</span>
		<p>
			<strong>Demonstration data.</strong> Records, dates and processing targets are illustrative samples
			— not official service standards.
		</p>
	</div>

	<div class="dashboard-content-grid">
		<section class="dashboard-panel recent-panel" aria-label="Recent requests">
			<div class="dashboard-panel-heading">
				<h2>Recent requests</h2>
				<a href="/dashboard/requests">All requests ↗</a>
			</div>
			{#if civic.myRequests.length}<div class="dashboard-request-list">
					{#each civic.myRequests.slice(0, 5) as request}<a
							class="dashboard-request-row"
							href={`/dashboard/requests/${request.id}`}
							><span
								class="request-status-bar"
								style={`background:${STATUS_META[request.status]?.dot ?? '#274C77'}`}
							></span><span class="dashboard-request-copy"
								><span class="dashboard-request-meta"
									><strong>{request.id}</strong><span class={`pill ${request.status}`}
										>{STATUS_META[request.status]?.label ?? request.status}</span
									>{#if isOverdue(request.targetCompletionAt, request.status)}<em
											>Past sample target</em
										>{/if}</span
								><b>{request.title}</b><small
									>{request.documentType} · updated {timeAgo(request.updatedAt)}</small
								></span
							><span class="overview-arrow">→</span></a
						>{/each}
				</div>{:else}<div class="dashboard-empty">
					<b>No requests yet</b>
					<p>
						Create your first administrative request to see tracking, timelines, and reminders here.
					</p>
					<a class="link-button" href="/dashboard/requests/new">+ Create request</a>
				</div>{/if}
		</section>

		<section class="tracking-panel" aria-label="Latest progress">
			<p class="tracking-kicker">Now tracking</p>
			{#if latest && latest.status && STATUS_META[latest.status]}<p class="tracking-id">{latest.id}</p>
				<h2>{latest.title}</h2>
				<div class="tracking-progress">
					<div class="progress-ring" style={`--progress:${progressForStatus(latest.status)}%`}>
						<b>{progressForStatus(latest.status)}%</b><small
							>{STATUS_META[latest.status].label}</small
						>
					</div>
					<div>
						<p>{STATUS_META[latest.status].description}</p>
						<small
							>{isOverdue(latest.targetCompletionAt, latest.status)
								? 'Past sample target — flagged for review'
								: `Sample estimate: ${formatDate(latest.targetCompletionAt)} (${daysUntil(latest.targetCompletionAt)}d)`}</small
						><a href={`/dashboard/requests/${latest.id}`}>Open timeline →</a>
					</div>
				</div>
				<div class="stage-strip">
					{#each PIPELINE_STAGES as stage, index}<span
							class:stage-done={index <= statusToStageIndex(latest.status)}
						></span>{/each}
				</div>
				<div class="stage-labels"><span>Received</span><span>Issuance</span></div>{:else}<p>
					No active file yet.
				</p>{/if}
		</section>
	</div>

	<div class="dashboard-content-grid dashboard-lower-grid">
		<section class="dashboard-panel action-panel" aria-label="Action required">
			<div class="dashboard-panel-heading">
				<div>
					<h2>Action required</h2>
					<small
						>{actionList.length
							? `${actionList.length} file${actionList.length === 1 ? '' : 's'} waiting on you`
							: 'Nothing waiting on you right now'}</small
					>
				</div>
				<span class="panel-symbol">!</span>
			</div>
			{#if actionList.length}{#each actionList as request}<a
						class="action-item"
						href={`/dashboard/requests/${request.id}`}
						><strong>{request.id}</strong><b>{request.title}</b
						>{#each request.requiredActions.slice(0, 2) as action}<small>• {action}</small
							>{/each}<span>Resolve now →</span></a
					>{/each}{:else}<p class="clear-state">
					All clear — no missing documents or confirmations pending.
				</p>{/if}
		</section>

		<section class="dashboard-panel notification-panel" aria-label="Recent notifications">
			<div class="dashboard-panel-heading">
				<div>
					<h2>Recent notifications</h2>
					<small>{civic.unreadCount} unread · prototype messages</small>
				</div>
				<a href="/dashboard/inbox">Inbox ↗</a>
			</div>
			{#each civic.myNotifications.slice(0, 4) as notification}<a
					class="notification-row"
					href={notification.requestId
						? `/dashboard/requests/${notification.requestId}`
						: '/dashboard/inbox'}
					><span class:notification-unread={!notification.isRead}></span><span
						><b>{notification.title}</b><small>{notification.message}</small><em
							>{timeAgo(notification.createdAt)}</em
						></span
					></a
				>{:else}<p class="muted">No messages yet.</p>{/each}
			<div class="completion-progress">
				<div>
					<span style={`width:${total ? Math.round((completed / total) * 100) : 0}%`}></span>
				</div>
				<small
					>{completed} of {total} requests completed or approved · derived live from your files</small
				>
			</div>
		</section>
	</div>
</div>
