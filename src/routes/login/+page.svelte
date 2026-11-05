<script lang="ts">
	import { goto } from '$app/navigation';
	import { civic, DEMO_PASSWORD } from '#lib/store';
	let email = $state('citizen@example.com');
	let password = $state(DEMO_PASSWORD);
	let error = $state('');
	function submit(event: SubmitEvent) {
		event.preventDefault();
		const result = civic.login(email, password);
		if (!result.ok) {
			error = result.error ?? 'Sign-in failed.';
			return;
		}
		goto(civic.user?.role === 'admin' ? '/admin' : '/dashboard');
	}
</script>

<svelte:head><title>Sign in — CivicFlow</title></svelte:head>
<main class="auth-page">
	<section class="auth-side">
		<a class="brand" href="/" style="color:white"
			><span class="brand-mark" style="background:white;color:var(--navy)">C</span>CivicFlow</a
		>
		<div>
			<p class="eyebrow" style="color:#a3cef1">Welcome back</p>
			<h1>Pick up where your files left off.</h1>
			<p>One calm view for every request, handoff, and next step.</p>
		</div>
		<small style="color:#ffffff99">Prototype only — demo credentials stay in your browser.</small>
	</section>
	<section class="auth-main">
		<div class="form-card">
			<a class="text-link" href="/">← Back to CivicFlow</a>
			<h1>Sign in</h1>
			<p class="muted">Access your dashboard, requests, and inbox.</p>
			<div class="demo-box">
				<b>Demo password: civic1234</b><br /><button
					type="button"
					onclick={() => (email = 'citizen@example.com')}>citizen@example.com</button
				><button type="button" onclick={() => (email = 'admin@example.com')}
					>admin@example.com</button
				>
			</div>
			<form class="form" onsubmit={submit}>
				<label class="field">Email address<input type="email" bind:value={email} required /></label
				><label class="field"
					>Password<input type="password" bind:value={password} required /></label
				>{#if error}<p class="error" role="alert">{error}</p>{/if}<button
					class="link-button"
					type="submit">Sign in →</button
				>
				<p class="muted" style="text-align:center">
					New to CivicFlow? <a class="text-link" href="/register">Create an account</a>
				</p>
			</form>
		</div>
	</section>
</main>
