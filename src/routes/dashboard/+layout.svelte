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
			<a class="brand" href="/"><span class="brand-mark">K</span><span>Kelar.in</span></a>
			<p>Pelacakan layanan kelurahan</p>
		</div>
		{#if civic.user?.role === 'warga'}<a class="sidebar-new-request" href="/dashboard/requests/new"><span>+</span> Pengajuan baru</a>{/if}
		<nav aria-label="Dasbor">
			<a class:nav-active={page.url.pathname === '/dashboard'} href="/dashboard"><span class="nav-glyph">▦</span>Ringkasan</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/requests')} href="/dashboard/requests"><span class="nav-glyph">▤</span>{civic.user?.role === 'warga' ? 'Pengajuan Saya' : 'Antrean Pengajuan'}</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/documents')} href="/dashboard/documents"><span class="nav-glyph">▥</span>Panduan Layanan</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/inbox')} href="/dashboard/inbox"><span class="nav-glyph">⌂</span>Kotak Masuk {#if civic.unreadCount}<span class="nav-count">{civic.unreadCount}</span>{/if}</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/transparansi')} href="/dashboard/transparansi"><span class="nav-glyph">◌</span>Transparansi</a>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/profile')} href="/dashboard/profile"><span class="nav-glyph">⌘</span>Profil</a>
			{#if civic.user?.role !== 'warga'}<a class:nav-active={page.url.pathname.startsWith('/admin')} href="/admin"><span class="nav-glyph">≡</span>Operasional</a>{/if}
		</nav>
		<div class="sidebar-account">
			<div class="avatar">{civic.user?.name.slice(0, 1)}</div>
			<div><strong>{civic.user?.name}</strong><small>{civic.user?.role?.replace('_', ' ')} · Sesi Demo</small></div>
			<button class="logout" aria-label="Sign out" onclick={() => { civic.logout(); goto('/'); }}>↪</button>
		</div>
	</aside>
	<main class="app-main">
		<header class="dashboard-topbar">
			<form class="dashboard-search" onsubmit={submitSearch} role="search">
				<span aria-hidden="true">⌕</span><input bind:value={search} placeholder="Cari ID atau judul pengajuan..." aria-label="Cari pengajuan" />
			</form>
			<div class="topbar-actions">
				<a class="notification-button" href="/dashboard/inbox" aria-label="Open inbox">♧{#if civic.unreadCount}<b>{civic.unreadCount}</b>{/if}</a>
				<a class="profile-chip" href="/dashboard/profile"><span class="avatar avatar-small">{civic.user?.name.slice(0, 1)}</span><span>{civic.user?.name.split(' ')[0]}</span></a>
			</div>
		</header>
		{@render children()}
	</main>
</div>
