<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Verifikasi akun — Kelar.in</title></svelte:head>
<main class="page-wrap">
	<section class="documents-hero">
		<p class="documents-kicker">Panel lurah</p>
		<h1>Verifikasi akun petugas</h1>
		<p>Periksa pendaftar petugas yang menunggu persetujuan sebelum mereka dapat mengakses layanan.</p>
	</section>
	<section class="surface" style="margin-top:20px">
		{#if form?.success}<p class="success" role="status">{form.success}</p>{/if}
		{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
		{#if data.applicants.length === 0}
			<p class="muted">Belum ada akun petugas yang menunggu persetujuan.</p>
		{:else}
			<div class="approval-list">
				{#each data.applicants as applicant}
					<article class="approval-item">
						<div><strong>{applicant.name}</strong><p class="muted">{applicant.email} · {applicant.role}</p></div>
						<div class="approval-actions">
							<form method="POST" action="?/approve" use:enhance><input type="hidden" name="userId" value={applicant.id} /><button class="button primary" type="submit">Setujui</button></form>
							<form method="POST" action="?/reject" use:enhance><input type="hidden" name="userId" value={applicant.id} /><button class="button secondary" type="submit">Tolak</button></form>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>
</main>
