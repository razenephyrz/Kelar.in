<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { STATUS_META, statusToStageIndex, PIPELINE_STAGES } from '#lib/types';
	import { formatDateTime, isOverdue, progressForStatus } from '../../../../lib/utils';
	let request = $state<{
		id: string;
		title: string;
		documentType?: string;
		description: string;
		status: keyof typeof STATUS_META;
		assignedDepartment: string;
		targetCompletionAt: string | Date;
		checklist: { id: number; label: string; completed: boolean }[];
		history: { newStatus: keyof typeof STATUS_META; explanation: string; actorName: string; createdAt: string | Date }[];
	} | null>(null);
	let loadError = $state('');
	onMount(async () => {
		const response = await fetch(`/api/warga/requests/${page.params.id}`);
		if (!response.ok) {
			loadError = 'Pengajuan tidak dapat dimuat.';
			return;
		}
		const data = await response.json();
		request = {
			...data,
			documentType: data.service?.name,
			checklist: data.checklist ?? [],
			history: data.history ?? []
		};
	});
	let note = $state('');
	let message = $state('');
	let rating = $state(0);
	let ratingComment = $state('');
	let ratingMessage = $state('');
	async function submitRating() {
		if (!rating) {
			ratingMessage = 'Pilih nilai 1 sampai 5 terlebih dahulu.';
			return;
		}
		const response = await fetch('/api/warga/requests', {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				requestId: request?.id,
				targetRole: 'petugas',
				score: rating,
				comment: ratingComment
			})
		});
		ratingMessage = response.ok ? 'Terima kasih, penilaian kamu sudah tersimpan.' : 'Penilaian belum dapat disimpan.';
	}
</script>

{#if loadError}<p class="error" role="alert">{loadError}</p>{:else if request}<header class="app-header">
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
			Tahap {statusToStageIndex(request.status) + 1} dari 5 · Estimasi {formatDateTime(
				new Date(request.targetCompletionAt).toISOString()
			)}{isOverdue(new Date(request.targetCompletionAt).toISOString(), request.status) ? ' · Melewati estimasi' : ''}
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
			<h2 class="section-title">Berkas yang perlu dilengkapi</h2>
			<ul>
				{#each request.checklist.filter((item) => !item.completed) as action}<li>{action.label}</li>{/each}
			</ul>
			<label class="field"
				>Catatan perbaikan<textarea
					bind:value={note}
					rows="4"
					placeholder="Jelaskan berkas yang sudah kamu lengkapi"></textarea></label
			>
			{#if message}<p class="error">{message}</p>{/if}
			<button
				class="link-button"
				onclick={() => {
					if (note.trim().length < 8) {
						message = 'Tambahkan minimal 8 karakter agar petugas memahami perubahannya.';
						return;
					}
					message = 'Catatan tersimpan sebagai draft untuk petugas.';
				}}>Kirim catatan perbaikan</button
			>
		</section>{/if}
	<section class="surface">
		<h2 class="section-title">Status history</h2>
		<div class="stack">
			{#each request.history as entry}<div class="history-entry">
					<strong>{STATUS_META[entry.newStatus].label}</strong><span>{entry.explanation}</span
					><small>{entry.actorName} · {formatDateTime(new Date(entry.createdAt).toISOString())}</small>
				</div>{/each}
		</div>
	</section>
	{#if request.status === 'completed'}<section class="surface">
			<h2 class="section-title">Nilai layanan ini</h2>
			<p class="muted">Berikan penilaian setelah pengajuan selesai.</p>
			<div style="display:flex;gap:8px;margin:12px 0">
				{#each [1, 2, 3, 4, 5] as score}<button class="link-button" class:primary={rating === score} type="button" onclick={() => (rating = score)}>{score}</button>{/each}
			</div>
			<label class="field">Masukan<textarea bind:value={ratingComment} rows="3" placeholder="Ceritakan pengalaman kamu"></textarea></label>
			{#if ratingMessage}<p class="muted">{ratingMessage}</p>{/if}
			<button class="link-button" type="button" onclick={submitRating}>Kirim penilaian</button>
		</section>{/if}
{:else}<h1>Request not found</h1>
	<a class="text-link" href="/dashboard/requests">Back to requests</a>{/if}
