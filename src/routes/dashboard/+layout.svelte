<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { civic } from '#lib/store';
	import { ROLE_META } from '#lib/types';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	let search = $state('');
	let collapsed = $state(false);
	let openMenu = $state<'tracking' | 'education' | 'accountability' | null>('tracking');
	if (typeof window !== 'undefined' && !civic.user) goto('/login');

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		if (search.trim()) goto(`/dashboard/requests?q=${encodeURIComponent(search.trim())}`);
	}
</script>

<div class="app-shell" class:sidebar-collapsed={collapsed}>
	<aside class="sidebar">
		<div class="sidebar-brand-wrap">
			<a class="brand" href="/"><span class="brand-mark">K</span><span>Kelar.in</span></a>
			<p>Pelacakan layanan kelurahan</p>
		</div>
		{#if civic.can('request:create')}<a class="sidebar-new-request" href="/dashboard/requests/new" aria-label="Pengajuan baru"
			><span>+</span>{#if !collapsed}
				Pengajuan baru{/if}</a
		>{/if}
		<nav aria-label="Navigasi dashboard">
			<div class="nav-group">
				<button class:nav-group-active={openMenu === 'tracking'} class="nav-group-toggle" type="button" onclick={() => (openMenu = openMenu === 'tracking' ? null : 'tracking')}>
					<span class="nav-glyph">▦</span>{#if !collapsed}<span>Tracking</span><span class="nav-chevron">{openMenu === 'tracking' ? '⌃' : '⌄'}</span>{/if}
				</button>
				{#if openMenu === 'tracking' && !collapsed}<div class="nav-submenu">
					<a class:nav-active={page.url.pathname === '/dashboard'} href="/dashboard">Ringkasan</a>
					{#if civic.can('request:create')}<a class:nav-active={page.url.pathname.startsWith('/dashboard/requests')} href="/dashboard/requests">Pengajuan saya</a>{/if}
					<a class:nav-active={page.url.pathname.startsWith('/dashboard/inbox')} href="/dashboard/inbox">Kotak masuk {#if civic.unreadCount}<span class="nav-count">{civic.unreadCount}</span>{/if}</a>
				</div>{/if}
			</div>
			<div class="nav-group">
				<button class:nav-group-active={openMenu === 'education'} class="nav-group-toggle" type="button" onclick={() => (openMenu = openMenu === 'education' ? null : 'education')}>
					<span class="nav-glyph">▥</span>{#if !collapsed}<span>Education</span><span class="nav-chevron">{openMenu === 'education' ? '⌃' : '⌄'}</span>{/if}
				</button>
				{#if openMenu === 'education' && !collapsed}<div class="nav-submenu">
					<a class:nav-active={page.url.pathname.startsWith('/dashboard/documents')} href="/dashboard/documents">Panduan dokumen</a>
					{#if civic.can('content:education')}<a class:nav-active={page.url.pathname.startsWith('/help')} href="/help">Edukasi layanan</a>{/if}
				</div>{/if}
			</div>
			<div class="nav-group">
				<button class:nav-group-active={openMenu === 'accountability'} class="nav-group-toggle" type="button" onclick={() => (openMenu = openMenu === 'accountability' ? null : 'accountability')}>
					<span class="nav-glyph">◌</span>{#if !collapsed}<span>Accountability</span><span class="nav-chevron">{openMenu === 'accountability' ? '⌃' : '⌄'}</span>{/if}
				</button>
				{#if openMenu === 'accountability' && !collapsed}<div class="nav-submenu">
					{#if civic.can('content:transparency')}<a class:nav-active={page.url.pathname.startsWith('/dashboard/transparansi')} href="/dashboard/transparansi">Transparansi</a>{/if}
					<a class:nav-active={page.url.pathname.startsWith('/dashboard/profile')} href="/dashboard/profile">Profil & dokumen</a>
					{#if civic.can('system:manage') || civic.can('request:approve') || civic.can('request:accept')}<a class:nav-active={page.url.pathname.startsWith('/admin')} href="/admin">Administrasi</a>{/if}
				</div>{/if}
			</div>
		</nav>
		<div class="sidebar-account" class:sidebar-account-collapsed={collapsed}>
			<div class="avatar">{civic.user?.name.slice(0, 1)}</div>
			{#if !collapsed}<div>
					<strong>{civic.user?.name}</strong><small
						>{civic.user ? ROLE_META[civic.user.role].label : ''} · Sesi demo</small
					>
				</div>{/if}
			<button
				class="logout"
				aria-label="Keluar"
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
			aria-label={collapsed ? 'Buka bilah samping' : 'Ciutkan bilah samping'}>{collapsed ? '›' : '‹'}</button
		>
	</aside>
	<main class="app-main">
		<header class="dashboard-topbar">
			<form class="dashboard-search" onsubmit={submitSearch} role="search">
				<span aria-hidden="true">⌕</span><input
					bind:value={search}
					placeholder="Cari ID atau judul pengajuan..."
					aria-label="Cari pengajuan"
				/>
			</form>
			<div class="topbar-actions">
				<a class="notification-button" href="/dashboard/inbox" aria-label="Buka kotak masuk"
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
