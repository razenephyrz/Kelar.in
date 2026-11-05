<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>CivicFlow — Every document. Every step. Clear progress.</title>
	<meta name="description" content="Track administrative requests with clarity." />
</svelte:head>

{@render children()}
