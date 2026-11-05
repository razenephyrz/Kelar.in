<script lang="ts">
	import { goto } from '$app/navigation';
	import { civic } from '#lib/store';
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let error = $state('');
	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (name.trim().length < 2) {
			error = 'Please enter your full name.';
			return;
		}
		if (password.length < 8) {
			error = 'Password must be at least 8 characters.';
			return;
		}
		if (password !== confirm) {
			error = 'Passwords do not match.';
			return;
		}
		const result = civic.register({ name, email, password });
		if (!result.ok) {
			error = result.error ?? 'Registration failed.';
			return;
		}
		goto('/dashboard');
	}
</script>

<main class="auth-page">
	<section class="auth-main">
		<div class="form-card">
			<a class="text-link" href="/">← Back to CivicFlow</a>
			<h1>Create your account</h1>
			<p class="muted">A local demo account — no email is sent.</p>
			<form class="form" onsubmit={submit}>
				<label class="field"
					>Full name<input bind:value={name} placeholder="Amara Osei" required /></label
				><label class="field"
					>Email address<input
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
					/></label
				><label class="field"
					>Password<input type="password" bind:value={password} minlength="8" required /></label
				><label class="field"
					>Confirm password<input type="password" bind:value={confirm} required /></label
				>{#if error}<p class="error" role="alert">{error}</p>{/if}<button
					class="link-button"
					type="submit">Create account →</button
				>
				<p class="muted" style="text-align:center">
					Already have an account? <a class="text-link" href="/login">Sign in</a>
				</p>
			</form>
		</div>
	</section>
	<section class="auth-side" style="background:var(--blue)">
		<a class="brand" href="/" style="color:white"
			><span class="brand-mark" style="background:white;color:var(--navy)">C</span>CivicFlow</a
		>
		<div>
			<p class="eyebrow" style="color:white">File · Track · Collect</p>
			<h1>One account. Every step visible.</h1>
			<p>Seeded demo sessions persist across refreshes using local storage.</p>
		</div>
		<small style="color:#ffffffaa">Demo password convention: civic1234</small>
	</section>
</main>
