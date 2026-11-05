<script lang="ts">
	import { civic } from '#lib/store';
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Account</p>
		<h1>Your profile</h1>
		<p class="muted">Demo account details and session controls.</p>
	</div>
</header>
<section class="surface stack">
	<div>
		<p class="eyebrow">Name</p>
		<h2 class="section-title">{civic.user?.name}</h2>
	</div>
	<div>
		<p class="eyebrow">Email</p>
		<p>{civic.user?.email}</p>
	</div>
	<div>
		<p class="eyebrow">Role</p>
		<p>{civic.user?.role}</p>
	</div>
	<button class="link-button" onclick={() => civic.resetDemo()}>Reset demo data</button>
</section>
