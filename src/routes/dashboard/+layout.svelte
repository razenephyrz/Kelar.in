<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { civic } from '#lib/store';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let search = $state('');
	if (typeof window !== 'undefined' && !civic.user) goto('/login');

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		if (search.trim()) goto(`/dashboard/requests?q=${encodeURIComponent(search.trim())}`);
	}
</script>

<div class="app-shell">
	<aside class="sidebar">
		<div class="sidebar-brand-wrap">
			<a class="brand" href="/"><span class="brand-mark">C</span><span>CivicFlow</span></a>
			<p>Public administration tracking</p>
		</div>
		<a class="sidebar-new-request" href="/dashboard/requests/new"><span>+</span> New request</a>
		<nav aria-label="Dashboard">
			<a class:nav-active={page.url.pathname === '/dashboard'} href="/dashboard"><span class="nav-glyph">▦</span>Overview</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/requests')} href="/dashboard/requests"><span class="nav-glyph">▤</span>My Requests</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/documents')} href="/dashboard/documents"><span class="nav-glyph">▥</span>Document Guide</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/inbox')} href="/dashboard/inbox"><span class="nav-glyph">⌂</span>Inbox {#if civic.unreadCount}<span class="nav-count">{civic.unreadCount}</span>{/if}</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/profile')} href="/dashboard/profile"><span class="nav-glyph">⌘</span>Profile</a>
			{#if civic.user?.role === 'admin'}<a class:nav-active={page.url.pathname.startsWith('/admin')} href="/admin"><span class="nav-glyph">≡</span>Administration</a>{/if}
		</nav>
		<div class="sidebar-account">
			<div class="avatar">{civic.user?.name.slice(0, 1)}</div>
			<div><strong>{civic.user?.name}</strong><small>{civic.user?.role === 'admin' ? 'Administrator' : 'Citizen'} · Demo Session</small></div>
			<button class="logout" aria-label="Sign out" onclick={() => { civic.logout(); goto('/'); }}>↪</button>
		</div>
	</aside>
	<main class="app-main">
		<header class="dashboard-topbar">
			<form class="dashboard-search" onsubmit={submitSearch} role="search">
				<span aria-hidden="true">⌕</span><input bind:value={search} placeholder="Search by request ID or title..." aria-label="Search requests" />
			</form>
			<div class="topbar-actions">
				<a class="notification-button" href="/dashboard/inbox" aria-label="Open inbox">♧{#if civic.unreadCount}<b>{civic.unreadCount}</b>{/if}</a>
				<a class="profile-chip" href="/dashboard/profile"><span class="avatar avatar-small">{civic.user?.name.slice(0, 1)}</span><span>{civic.user?.name.split(' ')[0]}</span></a>
			</div>
		</header>
		{@render children()}
	</main>
</div>
