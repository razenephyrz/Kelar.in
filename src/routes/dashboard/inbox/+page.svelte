<script lang="ts">
	import { onMount } from 'svelte';
	let notifications = $state<{ id: number; title: string; message: string; isRead: boolean }[]>([]);
	let error = $state('');
	onMount(async () => {
		const response = await fetch('/api/warga/inbox');
		if (!response.ok) {
			error = 'Kotak masuk belum dapat dimuat.';
			return;
		}
		notifications = await response.json();
	});
	async function markRead(id: number) {
		const response = await fetch('/api/warga/inbox', {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ notificationId: id })
		});
		if (!response.ok) {
			error = 'Notifikasi belum dapat diperbarui.';
			return;
		}
		notifications = notifications.map((notification) =>
			notification.id === id ? { ...notification, isRead: true } : notification
		);
	}
	async function markAllRead() {
		await Promise.all(notifications.filter((item) => !item.isRead).map((item) => markRead(item.id)));
	}
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Pembaruan</p>
		<h1>Kotak masuk</h1>
		<p class="muted">Perubahan status dan pengingat pengajuan kamu.</p>
	</div>
	<button class="link-button" onclick={markAllRead}>Tandai semua dibaca</button>
</header>
{#if error}<p class="error" role="alert">{error}</p>{/if}
<section class="surface">
	<div class="stack">
		{#each notifications as notification}<button
				style="text-align:left;background:none;border:0;border-bottom:1px solid var(--line);padding:14px 0;cursor:pointer"
				onclick={() => markRead(notification.id)}
				><strong>{notification.title}</strong>
				<p class="muted">{notification.message}</p>
				{#if !notification.isRead}<span class="pill">Baru</span>{/if}</button
			>{:else}<p class="muted">Your inbox is clear.</p>{/each}
	</div>
</section>
