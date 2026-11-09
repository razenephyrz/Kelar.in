<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let title = $state('');
	let type = $state('');
	let description = $state('');
	let targetDays = $state('');
	let error = $state('');
	type Service = { id: string; name: string; processingDays: number; processingTarget: string; description: string };
	let services = $state<Service[]>([]);
	let selected = $derived(services.find((service) => service.id === type));
	onMount(async () => {
		const response = await fetch('/api/warga/services');
		if (!response.ok) {
			error = 'Daftar layanan belum dapat dimuat. Pastikan koneksi server tersedia.';
			return;
		}
		services = await response.json();
		type = services[0]?.id ?? '';
	});
	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!title.trim()) {
			error = 'Masukkan judul singkat untuk pengajuan.';
			return;
		}
		const response = await fetch('/api/warga/requests', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				serviceId: type,
				title: title.trim(),
				description: description.trim()
			})
		});
		if (!response.ok) {
			const result = await response.json().catch(() => null);
			error = result?.message ?? 'Pengajuan belum dapat disimpan.';
			return;
		}
		const result = await response.json();
		goto(`/dashboard/requests/${result.id}`);
	}
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Pengajuan baru</p>
		<h1>Buat pengajuan</h1>
		<p class="muted">Lengkapi informasi agar petugas dapat memproses layanan dengan tepat.</p>
	</div>
</header>
<form class="surface form" onsubmit={submit}>
	<label class="field"
		>Jenis layanan<select bind:value={type} required
			>{#each services as service}<option value={service.id}>{service.name}</option>{/each}</select
		></label
	><label class="field"
		>Judul pengajuan<input bind:value={title} placeholder="Layanan yang dibutuhkan" required /></label
	><label class="field"
		>Keterangan<textarea bind:value={description} rows="5" placeholder="Tambahkan keterangan jika diperlukan"
		></textarea></label
	><label class="field"
		>Waktu pengerjaan yang diharapkan <span class="muted">(opsional)</span><input
			bind:value={targetDays}
			type="number"
			min="1"
			max="30"
			placeholder="Contoh: 5 hari kerja"
		/></label
	>{#if error}<p class="error">{error}</p>{/if}<button class="link-button" type="submit"
		>Ajukan sekarang →</button
	>
</form>
