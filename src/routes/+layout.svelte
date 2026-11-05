<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Kelar.in — Setiap pengajuan, setiap tahap, jelas.</title>
	<meta name="description" content="Lacak pengajuan layanan kelurahan dengan transparan." />
</svelte:head>

{@render children()}
