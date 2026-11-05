<script lang="ts">
	import { goto } from '$app/navigation';
	import { civic } from '#lib/store';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	if (typeof window !== 'undefined' && !civic.user) goto('/login');
</script>

<div class="app-shell">
	<aside class="sidebar">
		<a class="brand" href="/"><span class="brand-mark">C</span>CivicFlow</a>
		<nav aria-label="Dashboard">
			<a href="/dashboard">Overview</a><a href="/dashboard/requests">My Requests</a><a
				href="/dashboard/documents">Document Guide</a
			><a href="/dashboard/inbox">Inbox {civic.unreadCount ? `(${civic.unreadCount})` : ''}</a><a
				href="/dashboard/profile">Profile</a
			>{#if civic.user?.role === 'admin'}<a href="/admin">Administration</a>{/if}
		</nav>
		<button
			class="logout"
			onclick={() => {
				civic.logout();
				goto('/');
			}}>Sign out</button
		>
	</aside>
	<main class="app-main">{@render children()}</main>
</div>
