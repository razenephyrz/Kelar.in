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
			<a class="brand" href="/"><span class="brand-mark">K</span><span>Kelar.in</span></a>
			<p>Pelacakan layanan kelurahan</p>
		</div>
		<a class="sidebar-new-request" href="/dashboard/requests/new" aria-label="Pengajuan baru"
			><span>+</span>{#if !collapsed}
				Pengajuan baru{/if}</a
		>
		<nav aria-label="Navigasi dashboard">
			<a class:nav-active={page.url.pathname === '/dashboard'} href="/dashboard"
				><span class="nav-glyph">▦</span>{#if !collapsed}<span>Ringkasan</span>{/if}</a
			>
			<a
				class:nav-active={page.url.pathname.startsWith('/dashboard/requests')}
				href="/dashboard/requests"
				><span class="nav-glyph">▤</span>{#if !collapsed}<span>Pengajuan saya</span>{/if}</a
			>
			<a
				class:nav-active={page.url.pathname.startsWith('/dashboard/documents')}
				href="/dashboard/documents"
				><span class="nav-glyph">▥</span>{#if !collapsed}<span>Panduan dokumen</span>{/if}</a
			>
			<a class:nav-active={page.url.pathname.startsWith('/dashboard/inbox')} href="/dashboard/inbox"
				><span class="nav-glyph">⌂</span>{#if !collapsed}<span>Kotak masuk</span
					>{/if}{#if civic.unreadCount}<span class="nav-count">{civic.unreadCount}</span>{/if}</a
			>
			<a
				class:nav-active={page.url.pathname.startsWith('/dashboard/profile')}
				href="/dashboard/profile"
				><span class="nav-glyph">⌘</span>{#if !collapsed}<span>Profil</span>{/if}</a
			>
			{#if civic.user?.role === 'admin'}<a
					class:nav-active={page.url.pathname.startsWith('/admin')}
					href="/admin"
					><span class="nav-glyph">≡</span>{#if !collapsed}<span>Administrasi</span>{/if}</a
				>{/if}
		</nav>
		<div class="sidebar-account" class:sidebar-account-collapsed={collapsed}>
			<div class="avatar">{civic.user?.name.slice(0, 1)}</div>
			{#if !collapsed}<div>
					<strong>{civic.user?.name}</strong><small
						>{civic.user?.role === 'admin' ? 'Administrator' : 'Warga'} · Sesi demo</small
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
