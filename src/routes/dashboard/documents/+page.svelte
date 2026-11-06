<script lang="ts">
	import { civic } from '#lib/store';

	let query = $state('');
	let category = $state('Semua kategori');
	const categories = $derived([
		'Semua kategori',
		...new Set(civic.procedures.map((procedure) => procedure.category))
	]);
	const visibleProcedures = $derived(
		civic.procedures.filter((procedure) => {
			const needle = query.trim().toLowerCase();
			const matchesQuery =
				!needle ||
				`${procedure.name} ${procedure.description}`.toLowerCase().includes(needle);
			return matchesQuery && (category === 'Semua kategori' || procedure.category === category);
		})
	);
</script>

<svelte:head><title>Panduan dokumen — Kelar.in</title></svelte:head>

<section class="documents-hero" aria-labelledby="documents-title">
	<div>
		<p class="documents-kicker">Panduan layanan</p>
		<h1 id="documents-title">Prosedur dalam bahasa sederhana</h1>
		<p>
			Temukan persyaratan, langkah pengurusan, dan perkiraan waktu untuk setiap layanan kelurahan.
		</p>
	</div>
</section>

<div class="demo-banner">
	<span aria-hidden="true">✓</span>
	<p>
		<strong>Data demonstrasi.</strong> Persyaratan, tanggal, dan target waktu di halaman ini adalah
		contoh dan bukan standar layanan resmi.
		<a href="/help">Pelajari cara memverifikasi informasi.</a>
	</p>
</div>

<section class="documents-browser" aria-labelledby="browse-title">
	<h2 id="browse-title" class="visually-hidden">Cari panduan layanan</h2>
	<label class="documents-search">
		<span aria-hidden="true">⌕</span>
		<input bind:value={query} placeholder="Cari nama layanan atau kata kunci..." aria-label="Cari panduan layanan" />
	</label>
	<div class="category-filters" aria-label="Saring berdasarkan kategori">
		{#each categories as item}
			<button
				class:category-active={category === item}
				type="button"
				onclick={() => (category = item)}
			>
				{item}
			</button>
		{/each}
	</div>
</section>

<section class="procedure-grid" aria-labelledby="procedure-list-title">
	<h2 id="procedure-list-title" class="visually-hidden">Daftar panduan layanan</h2>
	{#each visibleProcedures as procedure}
		<a class="procedure-card" href={`/dashboard/documents/${procedure.id}`}>
			<div class="procedure-card-top">
				<span class="procedure-icon" aria-hidden="true">▣</span>
				<span class="procedure-category">{procedure.category}</span>
				<small>
					Diverifikasi {Math.max(
						1,
						Math.ceil((Date.now() - new Date(procedure.lastVerifiedAt).getTime()) / 86400000)
					)} hari lalu
				</small>
			</div>
			<h2>{procedure.name}</h2>
			<p>{procedure.description}</p>
			<div class="procedure-meta">
				<span>{procedure.requiredDocuments.length} dokumen</span>
				<span>{procedure.procedureSteps.length} langkah</span>
			</div>
			<strong class="procedure-target">Target contoh: {procedure.processingTarget}</strong>
			<span class="procedure-link">Baca panduan <span aria-hidden="true">→</span></span>
		</a>
	{:else}
		<p class="muted">Tidak ada panduan yang sesuai dengan pencarian atau kategori ini.</p>
	{/each}
</section>

<style>
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
