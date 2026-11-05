<script lang="ts">
	import { page } from '$app/state';
	import { civic } from '#lib/store';
	import { STATUS_META, statusToStageIndex, PIPELINE_STAGES } from '#lib/types';
	import { formatDateTime, isOverdue, progressForStatus } from '../../../../lib/utils';
	const request = $derived(civic.myRequests.find((item) => item.id === page.params.id));
	const requestHistory = $derived(
		civic.history.filter((item) => item.requestId === page.params.id)
	);
	let note = $state('');
	let message = $state('');
</script>

{#if request}<header class="app-header">
		<div>
			<p class="eyebrow">{request.id}</p>
			<h1>{request.title}</h1>
			<p class="muted">{request.documentType} · {request.assignedDepartment}</p>
		</div>
		<span class={`pill ${request.status}`}>{STATUS_META[request.status].label}</span>
	</header>
	<section class="surface">
		<h2 class="section-title">Where it is now</h2>
		<p class="muted">{STATUS_META[request.status].description}</p>
		<div class="progress-track">
			<span style={`width:${progressForStatus(request.status)}%`}></span>
		</div>
		<p class="muted">
			Stage {statusToStageIndex(request.status) + 1} of 5 · Target {formatDateTime(
				request.targetCompletionAt
			)}{isOverdue(request.targetCompletionAt, request.status) ? ' · Past sample target' : ''}
		</p>
		<div class="timeline" style="margin:30px 0 0 15px">
			{#each PIPELINE_STAGES as stage, index}<div
					class:current={index === statusToStageIndex(request.status)}
					class:done={index < statusToStageIndex(request.status)}
				>
					<span
						>{index < statusToStageIndex(request.status)
							? '✓'
							: index === statusToStageIndex(request.status)
								? '•'
								: '○'}</span
					>
					<p><b>{stage.label}</b><small>{stage.hint}</small></p>
				</div>{/each}
		</div>
	</section>
	{#if request.status === 'action_required'}<section class="surface">
			<h2 class="section-title">Missing items</h2>
			<ul>
				{#each request.requiredActions as action}<li>{action}</li>{/each}
			</ul>
			<label class="field"
				>Resubmission note<textarea
					bind:value={note}
					rows="4"
					placeholder="Explain what you have added or corrected"></textarea></label
			>
			{#if message}<p class="error">{message}</p>{/if}
			<button
				class="link-button"
				onclick={() => {
					if (note.trim().length < 8) {
						message = 'Add at least 8 characters so the reviewer knows what changed.';
						return;
					}
					civic.resolveAction(request.id, note);
					message = 'Information resubmitted for review.';
				}}>Resubmit information</button
			>
		</section>{/if}
	<section class="surface">
		<h2 class="section-title">Status history</h2>
		<div class="stack">
			{#each requestHistory as entry}<div class="history-entry">
					<strong>{STATUS_META[entry.newStatus].label}</strong><span>{entry.explanation}</span
					><small>{entry.actorName} · {formatDateTime(entry.timestamp)}</small>
				</div>{/each}
		</div>
	</section>
{:else}<h1>Request not found</h1>
	<a class="text-link" href="/dashboard/requests">Back to requests</a>{/if}
