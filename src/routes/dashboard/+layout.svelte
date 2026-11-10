<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { civic } from '#lib/store';
	import { ROLE_META, type Role } from '#lib/types';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	let search = $state('');
	let collapsed = $state(false);
	type Menu = 'approval' | 'tracking' | 'education' | 'accountability';
	let openMenu = $state<Menu | null>('tracking');
	let mobileOpenMenu = $state<Menu | null>(null);

	let isMobile = $state(false);
	let mobileNavOpen = $state(false);
	const showLabels = $derived(isMobile || !collapsed);
	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth <= 960;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});
	afterNavigate(() => {
		mobileNavOpen = false;
	});

	const isMenuOpen = (menu: Menu) => {
		if (isMobile) return mobileOpenMenu === menu;
		return openMenu === menu && showLabels;
	};

	const toggleMenu = (menu: Menu) => {
		if (isMobile) {
			mobileOpenMenu = mobileOpenMenu === menu ? null : menu;
		} else {
			openMenu = openMenu === menu ? null : menu;
		}
	};

	const displayUser = $derived(
		data?.authUser ?? {
			id: '',
			name: 'Warga',
			email: '',
			role: 'warga' as const
		}
	);

	const userRole = $derived<Role>(
		displayUser.role && displayUser.role in ROLE_META ? (displayUser.role as Role) : 'warga'
	);
	const userInitials = $derived(
		displayUser.name?.trim() ? displayUser.name.trim().slice(0, 1) : 'W'
	);
	const userFirstName = $derived(
		displayUser.name?.trim() ? displayUser.name.trim().split(' ')[0] : 'Warga'
	);
	const roleMeta = $derived(ROLE_META[userRole] ?? ROLE_META.warga);

	onMount(() => {
		if (data?.authUser) {
			civic.setAuthenticatedUser(data.authUser);
		}
	});

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		if (search.trim()) goto(`/dashboard/requests?q=${encodeURIComponent(search.trim())}`);
	}
</script>

<div class="app-shell" class:sidebar-collapsed={collapsed && !isMobile}>
	<div class="sidebar-frame">
	<aside class="sidebar" class:mobile-open={mobileNavOpen}>
		<div class="sidebar-brand-wrap">
			<a class="brand" href="/"><span class="brand-mark">K</span><span>Kelar.in</span></a>
			<p>Pelacakan layanan kelurahan</p>
			<button
				class="sidebar-mobile-toggle"
				type="button"
				aria-expanded={mobileNavOpen}
				aria-controls="dashboard-nav"
				onclick={() => (mobileNavOpen = !mobileNavOpen)}
			>
				{mobileNavOpen ? 'Tutup' : 'Menu'}
			</button>
		</div>
		{#if civic.can('request:create')}<a
				class="sidebar-new-request"
				href="/dashboard/requests/new"
				aria-label="Pengajuan baru"
				><span>+</span>{#if showLabels}
					Pengajuan baru{/if}</a
			>{/if}
		<nav id="dashboard-nav" aria-label="Navigasi dashboard">
			{#if userRole === 'lurah'}
				<div class="nav-group">
					<button
						class:nav-group-active={isMenuOpen('approval')}
						class="nav-group-toggle"
						type="button"
						onclick={() => toggleMenu('approval')}
					>
						<span class="nav-glyph">✓</span>{#if showLabels}<span>Persetujuan Petugas</span><span
								class="nav-chevron">{isMenuOpen('approval') ? '⌃' : '⌄'}</span
							>{/if}
					</button>
					{#if isMenuOpen('approval') && showLabels}
						<div class="nav-submenu">
							<a class:nav-active={page.url.pathname.startsWith('/lurah')} href="/lurah"
								>Verifikasi akun petugas</a
							>
						</div>
					{/if}
				</div>
			{/if}
			<div class="nav-group">
				<button
					class:nav-group-active={isMobile
						? mobileOpenMenu === 'tracking'
						: openMenu === 'tracking'}
					class="nav-group-toggle"
					type="button"
					onclick={() => toggleMenu('tracking')}
				>
					<span class="nav-glyph">▦</span>{#if showLabels}<span>Tracking</span><span
							class="nav-chevron">{isMenuOpen('tracking') ? '⌃' : '⌄'}</span
						>{/if}
				</button>
				{#if isMenuOpen('tracking') && showLabels}<div class="nav-submenu open">
						<a class:nav-active={page.url.pathname === '/dashboard'} href="/dashboard">Ringkasan</a>
						{#if civic.can('request:create')}<a
								class:nav-active={page.url.pathname.startsWith('/dashboard/requests')}
								href="/dashboard/requests">Pengajuan saya</a
							>{/if}
						<a
							class:nav-active={page.url.pathname.startsWith('/dashboard/inbox')}
							href="/dashboard/inbox"
							>Kotak masuk {#if civic.unreadCount}<span class="nav-count">{civic.unreadCount}</span
								>{/if}</a
						>
					</div>{/if}
			</div>
			<div class="nav-group">
				<button
					class:nav-group-active={isMenuOpen('education')}
					class="nav-group-toggle"
					type="button"
					onclick={() => toggleMenu('education')}
				>
					<span class="nav-glyph">▥</span>{#if showLabels}<span>Education</span><span
							class="nav-chevron">{isMenuOpen('education') ? '⌃' : '⌄'}</span
						>{/if}
				</button>
				{#if isMenuOpen('education') && showLabels}<div class="nav-submenu open">
						<a
							class:nav-active={page.url.pathname.startsWith('/dashboard/documents')}
							href="/dashboard/documents">Panduan dokumen</a
						>
						{#if civic.can('content:education')}<a
								class:nav-active={page.url.pathname.startsWith('/help')}
								href="/help">Edukasi layanan</a
							>{/if}
					</div>{/if}
			</div>
			<div class="nav-group">
				<button
					class:nav-group-active={isMenuOpen('accountability')}
					class="nav-group-toggle"
					type="button"
					onclick={() => toggleMenu('accountability')}
				>
					<span class="nav-glyph">◌</span>{#if showLabels}<span>Accountability</span><span
							class="nav-chevron">{isMenuOpen('accountability') ? '⌃' : '⌄'}</span
						>{/if}
				</button>
				{#if isMenuOpen('accountability') && showLabels}<div class="nav-submenu open">
						{#if civic.can('content:transparency')}<a
								class:nav-active={page.url.pathname.startsWith('/dashboard/transparansi')}
								href="/dashboard/transparansi">Transparansi</a
							>{/if}
						<a
							class:nav-active={page.url.pathname.startsWith('/dashboard/profile')}
							href="/dashboard/profile">Profil & dokumen</a
						>
						{#if civic.can('system:manage') || civic.can('request:approve') || civic.can('request:accept')}<a
								class:nav-active={page.url.pathname.startsWith('/admin')}
								href="/admin">Administrasi</a
							>{/if}
					</div>{/if}
			</div>
		</nav>
		<div class="sidebar-account" class:sidebar-account-collapsed={collapsed && !isMobile}>
			<div class="avatar">{userInitials}</div>
			{#if showLabels}<div>
					<strong>{displayUser.name || 'Warga'}</strong><small>{roleMeta.label} · Sesi aktif</small>
				</div>{/if}
			<button
				class="logout"
				aria-label="Keluar"
				onclick={async () => {
					await fetch('/api/auth/sign-out', { method: 'POST' });
					civic.logout();
					goto('/');
				}}>↪</button
			>
		</div>
	</aside>
	<button
		class="sidebar-collapse"
		type="button"
		onclick={() => (collapsed = !collapsed)}
		aria-label={collapsed ? 'Buka bilah samping' : 'Ciutkan bilah samping'}
		>{collapsed ? '›' : '‹'}</button
	>
	</div>
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
					><span class="avatar avatar-small">{userInitials}</span><span>{userFirstName}</span></a
				>
			</div>
		</header>
		{@render children()}
	</main>
</div>
