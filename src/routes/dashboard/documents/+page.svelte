<script lang="ts">
	import { onMount } from 'svelte';
	type Service = {
		id: string;
		name: string;
		category: string;
		description: string;
		processingTarget: string;
		checklist: { label: string }[];
	};
	let services = $state<Service[]>([]);
	let selected = $state<Service | undefined>();
	let error = $state('');
	onMount(async () => {
		const response = await fetch('/api/warga/services');
		if (!response.ok) {
			error = 'Panduan layanan belum dapat dimuat.';
			return;
		}
		services = await response.json();
		selected = services[0];
	});
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Persiapkan sebelum mengajukan</p>
		<h1>Panduan layanan</h1>
		<p class="muted">Prosedur, persyaratan, dan kesalahan umum dengan bahasa sederhana.</p>
	</div>
</header>
{#if error}<p class="error" role="alert">{error}</p>{/if}
<div class="stack">
	<div class="surface">
		{#each services as procedure}<button
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
			<h3>Yang perlu disiapkan</h3>
			<ul>
				{#each selected.checklist as item}<li>{item.label}</li>{/each}
			</ul>
			<h3>Alur persetujuan</h3>
			<p class="muted">Ikuti checklist di atas sebelum mengajukan agar proses tidak tertunda.</p>
		</article>{/if}
</div>
