<script lang="ts">
	import { page } from '$app/state';
	import { civic } from '#lib/store';
	import { formatDate } from '../../../../lib/utils';

	const procedure = $derived(civic.procedures.find((item) => item.id === page.params.id));
	let openStep = $state(0);
</script>

<svelte:head
	><title
		>{procedure ? `${procedure.name} — Document Guide` : 'Procedure not found — CivicFlow'}</title
	></svelte:head
>

{#if procedure}
	<nav class="document-breadcrumb" aria-label="Breadcrumb">
		<a href="/dashboard">Overview</a><span>/</span><a href="/dashboard/documents">Document guide</a
		><span>/</span><strong>{procedure.name}</strong>
	</nav>
	<section class="procedure-detail-hero">
		<div>
			<div class="detail-badges">
				<span>{procedure.category}</span><span>◉ Illustrative mock entry</span>
			</div>
			<h1>{procedure.name}</h1>
			<p>{procedure.description}</p>
			<div class="detail-facts">
				<span>▥ {procedure.responsibleDepartment}</span><span
					>◷ Sample target: <strong>{procedure.processingTarget}</strong></span
				>
			</div>
			<div class="detail-actions">
				<a class="hero-new-request" href={`/dashboard/requests/new?procedure=${procedure.id}`}
					><span>Start this request</span> →</a
				><a class="detail-back" href="/dashboard/documents">← All procedures</a>
			</div>
		</div>
	</section>
	<div class="demo-banner">
		<span>✓</span>
		<p>
			<strong>Demonstration data.</strong> Records, dates and processing targets on this page are
			illustrative samples — not official service standards.
			<a href="/help">Verify in the procedure guide.</a>
		</p>
	</div>
	<div class="procedure-detail-grid">
		<section class="detail-panel detail-steps">
			<h2>☷ Step-by-step procedure</h2>
			<div class="step-list">
				{#each procedure.procedureSteps as step, index}
					<div class:step-open={openStep === index} class="procedure-step">
						<button
							type="button"
							onclick={() => (openStep = openStep === index ? -1 : index)}
							aria-expanded={openStep === index}
						>
							<span class="step-number">{index + 1}</span><span class="step-copy"
								><strong>{step.title}</strong><small>{step.duration}</small></span
							><span class="step-chevron">{openStep === index ? '⌃' : '⌄'}</span>
						</button>
						{#if openStep === index}<p>{step.detail}</p>{/if}
					</div>
				{/each}
			</div>
		</section>
		<section class="detail-panel required-panel">
			<h2>▧ Required documents</h2>
			<ul>
				{#each procedure.requiredDocuments as document}<li><span>✓</span>{document}</li>{/each}
			</ul>
			<h3>ⓘ Common reasons files stall</h3>
			<ul class="pitfall-list">
				{#each procedure.commonPitfalls as pitfall}<li>{pitfall}</li>{/each}
			</ul>
		</section>
		<section class="eligibility-panel">
			<h2>Eligibility</h2>
			<ul>
				{#each procedure.eligibility as item}<li>{item}</li>{/each}
			</ul>
		</section>
		<section class="detail-panel verification-panel">
			<p class="panel-kicker">Verification</p>
			<dl>
				<div>
					<dt>Source</dt>
					<dd>{procedure.sourceReference}</dd>
				</div>
				<div>
					<dt>Last verified</dt>
					<dd>{formatDate(procedure.lastVerifiedAt)} (sample)</dd>
				</div>
				<div>
					<dt>Department</dt>
					<dd>{procedure.responsibleDepartment}</dd>
				</div>
			</dl>
			<p class="verification-note">
				Treat this page as demonstration content, not verified procedure. Confirm requirements with
				the responsible unit before relying on them.
			</p>
		</section>
	</div>
{:else}
	<section class="surface">
		<h1>Procedure not found</h1>
		<a class="text-link" href="/dashboard/documents">Back to document guide</a>
	</section>
{/if}
