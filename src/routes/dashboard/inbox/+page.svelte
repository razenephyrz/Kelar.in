<script lang="ts">
	import { onMount } from 'svelte';
	let notifications = $state<{ id: number; title: string; message: string; isRead: boolean }[]>([]);
	let error = $state('');
	const unreadCount = $derived(notifications.filter((notification) => !notification.isRead).length);

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
		await Promise.all(
			notifications.filter((item) => !item.isRead).map((item) => markRead(item.id))
		);
	}
</script>

<div class="requests-page">
	<section class="requests-hero" aria-labelledby="inbox-title">
		<div>
			<p class="requests-kicker">Pembaruan</p>
			<h1 id="inbox-title">Kotak masuk</h1>
			<p>Perubahan status dan pengingat pengajuan kamu.</p>
			<button
				class="hero-new-request inbox-mark-all"
				type="button"
				onclick={markAllRead}
				disabled={!unreadCount}
			>
				Tandai semua dibaca
			</button>
		</div>
		<div class="requests-hero-note">
			<strong>{notifications.length}</strong>
			<span>Pesan masuk</span>
			<small>{unreadCount} belum dibaca</small>
		</div>
	</section>

	{#if error}<p class="error" role="alert">{error}</p>{/if}

	<section class="surface requests-panel" aria-labelledby="inbox-list-title">
		<div class="requests-panel-heading">
			<div>
				<p class="requests-kicker">Pembaruan akun</p>
				<h2 id="inbox-list-title">Daftar pesan</h2>
			</div>
			<p class="result-count"><strong>{unreadCount}</strong> pesan belum dibaca</p>
		</div>

		<div class="stack inbox-list">
			{#each notifications as notification}
				<button
					class="inbox-message"
					class:inbox-message-read={notification.isRead}
					type="button"
					onclick={() => markRead(notification.id)}
				>
					<span class="inbox-message-copy">
						<strong>{notification.title}</strong>
						<span class="inbox-message-text">{notification.message}</span>
					</span>
					<span class="inbox-message-status" class:inbox-message-unread={!notification.isRead}>
						{notification.isRead ? 'Sudah dibaca' : 'Baru'}
					</span>
				</button>
			{:else}
				<p class="inbox-empty">Belum ada pesan.</p>
			{/each}
		</div>
	</section>
</div>
