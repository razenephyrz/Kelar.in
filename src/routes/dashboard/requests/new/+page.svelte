<script lang="ts">
	import { goto } from '$app/navigation';
	import { civic } from '#lib/store';
	let title = $state('');
	let type = $state('Surat Domisili');
	let description = $state('');
	let targetDays = $state('');
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
			assignedDepartment: 'Petugas Kelurahan',
			targetDays: targetDays ? Number(targetDays) : undefined
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
		<p class="eyebrow">Pengajuan baru</p>
		<h1>Buat pengajuan</h1>
		<p class="muted">Lengkapi informasi agar petugas dapat memproses layanan dengan tepat.</p>
	</div>
</header>
<form class="surface form" onsubmit={submit}>
	<label class="field"
		>Jenis layanan<select bind:value={type}
			><option>Surat Domisili</option><option>KTP</option><option>Akta Kematian</option><option
				>Slip Gaji</option><option>Surat Keterangan Belum Menikah</option></select
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
