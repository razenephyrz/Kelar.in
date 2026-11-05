<script lang="ts">
	import { goto } from '$app/navigation';
	import { civic } from '#lib/store';
	let title = $state('');
	let type = $state('Certificate of Residence');
	let description = $state('');
	let error = $state('');
	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!title.trim()) {
			error = 'Add a short title for your request.';
			return;
		}
		const request = civic.createRequest({
			documentType: type,
			title,
			description,
			metadata: {},
			assignedDepartment: 'Civil Registry — Residency Unit',
			targetDays: 7
		});
		if (!request) {
			error = 'Your session has expired. Please sign in again.';
			return;
		}
		goto(`/dashboard/requests/${request.id}`);
	}
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">New file</p>
		<h1>Start a request</h1>
		<p class="muted">Give the front office enough context to route it correctly.</p>
	</div>
</header>
<form class="surface form" onsubmit={submit}>
	<label class="field"
		>Document type<select bind:value={type}
			><option>Certificate of Residence</option><option>Family Card Update</option><option
				>Birth Certificate Application</option
			><option>Business Registration Inquiry</option></select
		></label
	><label class="field"
		>Request title<input bind:value={title} placeholder="What do you need?" required /></label
	><label class="field"
		>Description<textarea bind:value={description} rows="5" placeholder="Add any useful context"
		></textarea></label
	>{#if error}<p class="error">{error}</p>{/if}<button class="link-button" type="submit"
		>Submit request →</button
	>
</form>
