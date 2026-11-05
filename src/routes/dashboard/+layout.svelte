<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { civic } from '#lib/store';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let search = $state('');
	let collapsed = $state(false);
	if (typeof window !== 'undefined' && !civic.user) goto('/login');

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		if (search.trim()) goto(`/dashboard/requests?q=${encodeURIComponent(search.trim())}`);
	}
</script>

<div class="app-shell" class:sidebar-collapsed={collapsed}>
	<aside class="sidebar">
		<div class="sidebar-brand-wrap">
			<a class="brand" href="/"
				><span class="brand-mark">C</span>{#if !collapsed}<span>CivicFlow</span>{/if}</a
			>
			{#if !collapsed}<p>Public administration tracking</p>{/if}
		</div>
		<a class="sidebar-new-request" href="/dashboard/requests/new" aria-label="New request"
			><span>+</span>{#if !collapsed}
				New request{/if}</a
		>
		<nav aria-label="Dashboard">
			<a class:nav-active={page.url.pathname === '/dashboard'} href="/dashboard"
				><span class="nav-glyph">▦</span>{#if !collapsed}<span>Overview</span>{/if}</a
			>
			<a
				class:nav-active={page.url.pathname.startsWith('/dashboard/requests')}
				href="/dashboard/requests"
				><span class="nav-glyph">▤</span>{#if !collapsed}<span>My Requests</span>{/if}</a
			>
			<a
				class:nav-active={page.url.pathname.startsWith('/dashboard/documents')}
				href="/dashboard/documents"
				><span class="nav-glyph">▥</span>{#if !collapsed}<span>Document Guide</span>{/if}</a
			>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/inbox')} href="/dashboard/inbox"
				><span class="nav-glyph">⌂</span>{#if !collapsed}<span>Inbox</span
					>{/if}{#if civic.unreadCount}<span class="nav-count">{civic.unreadCount}</span>{/if}</a
			>
			<a
				class:nav-active={page.url.pathname.startsWith('/dashboard/profile')}
				href="/dashboard/profile"
				><span class="nav-glyph">⌘</span>{#if !collapsed}<span>Profile</span>{/if}</a
			>
			{#if civic.user?.role === 'admin'}<a
					class:nav-active={page.url.pathname.startsWith('/admin')}
					href="/admin"
					><span class="nav-glyph">≡</span>{#if !collapsed}<span>Administration</span>{/if}</a
				>{/if}
		</nav>
		<div class="sidebar-account" class:sidebar-account-collapsed={collapsed}>
			<div class="avatar">{civic.user?.name.slice(0, 1)}</div>
			{#if !collapsed}<div>
					<strong>{civic.user?.name}</strong><small
						>{civic.user?.role === 'admin' ? 'Administrator' : 'Citizen'} · Demo Session</small
					>
				</div>{/if}
			<button
				class="logout"
				aria-label="Sign out"
				onclick={() => {
					civic.logout();
					goto('/');
				}}>↪</button
			>
		</div>
		<button
			class="sidebar-collapse"
			type="button"
			onclick={() => (collapsed = !collapsed)}
			aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? '›' : '‹'}</button
		>
	</aside>
	<main class="app-main">
		<header class="dashboard-topbar">
			<form class="dashboard-search" onsubmit={submitSearch} role="search">
				<span aria-hidden="true">⌕</span><input
					bind:value={search}
					placeholder="Search by request ID or title..."
					aria-label="Search requests"
				/>
			</form>
			<div class="topbar-actions">
				<a class="notification-button" href="/dashboard/inbox" aria-label="Open inbox"
					>♧{#if civic.unreadCount}<b>{civic.unreadCount}</b>{/if}</a
				>
				<a class="profile-chip" href="/dashboard/profile"
					><span class="avatar avatar-small">{civic.user?.name.slice(0, 1)}</span><span
						>{civic.user?.name.split(' ')[0]}</span
					></a
				>
			</div>
		</header>
		{@render children()}
	</main>
</div>
