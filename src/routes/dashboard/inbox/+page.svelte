<script lang="ts">
	import { civic } from '#lib/store';
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Updates</p>
		<h1>Inbox</h1>
		<p class="muted">Status changes and reminders for your requests.</p>
	</div>
	<button class="link-button" onclick={() => civic.markAllRead()}>Mark all read</button>
</header>
<section class="surface">
	<div class="stack">
		{#each civic.myNotifications as notification}<button
				style="text-align:left;background:none;border:0;border-bottom:1px solid var(--line);padding:14px 0;cursor:pointer"
				onclick={() => civic.markRead(notification.id)}
				><strong>{notification.title}</strong>
				<p class="muted">{notification.message}</p>
				{#if !notification.isRead}<span class="pill">New</span>{/if}</button
			>{:else}<p class="muted">Your inbox is clear.</p>{/each}
	</div>
</section>
