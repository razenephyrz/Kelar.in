<script lang="ts">
	import { civic } from '#lib/store';

	let query = $state('');
	let category = $state('All categories');
	const categories = $derived([
		'All categories',
		...new Set(civic.procedures.map((procedure) => procedure.category))
	]);
	const visibleProcedures = $derived(
		civic.procedures.filter((procedure) => {
			const matchesQuery =
				!query.trim() ||
				`${procedure.name} ${procedure.description}`
					.toLowerCase()
					.includes(query.trim().toLowerCase());
			return matchesQuery && (category === 'All categories' || procedure.category === category);
		})
	);
</script>

<svelte:head><title>Document Guide — CivicFlow</title></svelte:head>

<section class="documents-hero" aria-labelledby="documents-title">
	<div>
		<p class="documents-kicker">Document guide</p>
		<h1 id="documents-title">Procedures, in plain language</h1>
		<p>
			Illustrative mock entries — eligibility, checklists, steps, and sample targets. Always labeled
			as demonstration content.
		</p>
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

<section class="documents-browser" aria-label="Browse procedures">
	<label class="documents-search"
		><span aria-hidden="true">⌕</span><input
			bind:value={query}
			placeholder="Search procedures..."
			aria-label="Search procedures"
		/></label
	>
	<div class="category-filters" aria-label="Filter by category">
		{#each categories as item}<button
				class:category-active={category === item}
				type="button"
				onclick={() => (category = item)}>{item}</button
			>{/each}
	</div>
</section>

<section class="procedure-grid" aria-label="Procedure guides">
	{#each visibleProcedures as procedure}
		<a class="procedure-card" href={`/dashboard/documents/${procedure.id}`}>
			<div class="procedure-card-top">
				<span class="procedure-icon">▣</span><span class="procedure-category"
					>{procedure.category}</span
				><small
					>Verified {Math.max(
						1,
						Math.ceil((Date.now() - new Date(procedure.lastVerifiedAt).getTime()) / 86400000)
					)}d ago</small
				>
			</div>
			<h2>{procedure.name}</h2>
			<p>{procedure.description}</p>
			<div class="procedure-meta">
				<span>{procedure.requiredDocuments.length} documents</span><span
					>{procedure.procedureSteps.length} steps</span
				>
			</div>
			<strong class="procedure-target">Sample target: {procedure.processingTarget}</strong>
			<span class="procedure-link">Read procedure <span>→</span></span>
		</a>
	{:else}<p class="muted">No procedure guides match your search.</p>{/each}
</section>
