<script lang="ts">
	import { civic } from '#lib/store';
	let selected = $state(civic.procedures[0]);
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Know before you file</p>
		<h1>Document guide</h1>
		<p class="muted">Plain-language procedures, requirements, and common pitfalls.</p>
	</div>
</header>
<div class="stack">
	<div class="surface">
		{#each civic.procedures as procedure}<button
				class="request-row"
				style="width:100%;text-align:left;background:none;border:0;cursor:pointer"
				onclick={() => (selected = procedure)}
				><div>
					<strong>{procedure.name}</strong><small
						>{procedure.category} · {procedure.processingTarget}</small
					>
				</div>
				<span>→</span></button
			>{/each}
	</div>
	{#if selected}<article class="surface">
			<p class="eyebrow">{selected.category}</p>
			<h2 class="section-title">{selected.name}</h2>
			<p class="muted">{selected.description}</p>
			<h3>What you need</h3>
			<ul>
				{#each selected.requiredDocuments as item}<li>{item}</li>{/each}
			</ul>
			<h3>Common pitfalls</h3>
			<ul>
				{#each selected.commonPitfalls as item}<li>{item}</li>{/each}
			</ul>
		</article>{/if}
</div>
