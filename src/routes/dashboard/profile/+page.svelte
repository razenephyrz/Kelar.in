<script lang="ts">
	import { civic } from '#lib/store';
</script>

<header class="app-header">
	<div>
		<p class="eyebrow">Akun</p>
		<h1>Profil kamu</h1>
		<p class="muted">Informasi akun demo dan pengaturan sesi.</p>
	</div>
</header>
<section class="surface stack">
	<div>
		<p class="eyebrow">Nama</p>
		<h2 class="section-title">{civic.user?.name}</h2>
	</div>
	<div>
		<p class="eyebrow">Email</p>
		<p>{civic.user?.email}</p>
	</div>
	<div>
		<p class="eyebrow">Peran</p>
		<p>{civic.user?.role}</p>
	</div>
	<button class="link-button" onclick={() => civic.resetDemo()}>Reset data demo</button>
</section>
