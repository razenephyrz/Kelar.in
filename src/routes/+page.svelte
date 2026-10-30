<script>
	import { page } from '$app/state';

	/* ---------- Routing (hash, sama seperti versi HTML) ---------- */
	const PAGES = ['beranda', 'tracking', 'edukasi', 'akuntabilitas', 'pengingat'];
	const route = $derived.by(() => {
		const h = page.url.hash.slice(1);
		return PAGES.includes(h) ? h : 'beranda';
	});
	const title = $derived(route === 'beranda' ? 'Kelar.in' : route.charAt(0).toUpperCase() + route.slice(1) + ' · Kelar.in');
	let open = $state(false);

	// Setiap pindah halaman: tutup menu mobile dan scroll ke atas tanpa animasi
	$effect(() => {
		route;
		open = false;
		window.scrollTo({ top: 0, behavior: 'instant' });
	});

	function goTo(id) {
		const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
		document.getElementById(id)?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
	}

	/* ---------- Ikon ---------- */
	const ic = {
		user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>',
		doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
		shop: '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v11H4z"/><path d="M10 20v-6h4v6"/>',
		land: '<path d="M3 20l5-9 4 6 3-4 6 7z"/><circle cx="17" cy="6" r="2"/>',
		heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
		cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
		search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>',
		book: '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/>',
		scale: '<path d="M12 4v16M6 20h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
		bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
		lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
		desk: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6"/><path d="M17 8h5M19.5 5.5v5"/>',
		check: '<path d="M4 12l5 5L20 6"/>',
		clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>'
	};

	/* ---------- Data Beranda ---------- */
	const cats = [
		['user', 'Kependudukan', 'KTP, KK, akta, domisili'],
		['doc', 'Surat keterangan', 'Domisili, pengantar, usaha'],
		['shop', 'Usaha dan perizinan', 'NIB, izin usaha'],
		['land', 'Pertanahan', 'Surat tanah, PBB'],
		['heart', 'Sosial dan kesehatan', 'Bantuan, jaminan kesehatan'],
		['cap', 'Pendidikan', 'Legalisir, surat pindah']
	];
	const steps = [
		['Pilih dokumen', 'Cari jenis dokumen, lalu baca syarat dan langkahnya di Edukasi.'],
		['Ajukan berkas', 'Ajukan lewat mekanisme yang didukung instansi, lalu simpan ID pengajuan Anda.'],
		['Pantau statusnya', 'Masukkan ID di Tracking untuk melihat status, tahapan, dan riwayat perubahan.'],
		['Terima kabar', 'Pengingat masuk ke inbox saat status berubah atau ada yang perlu dilengkapi.']
	];
	const flow = ['Dibuat', 'Verifikasi', 'Diproses', 'Disetujui', 'Selesai'];
	const ledger = [
		['doc', 'Pengajuan dibuat', 'Dicatat sistem · 26 Okt, 09.12', 'Awal'],
		['clock', 'Menunggu verifikasi', 'Loket pelayanan · 27 Okt, 10.40', '1 hari'],
		['check', 'Sedang diproses', 'Petugas verifikasi · 28 Okt, 14.20', '1 hari']
	];
	// k: chip | tick | teks biasa
	const features = [
		{ icon: 'search', name: 'Tracking', href: '#tracking', text: 'Cek status terkini, tahapan, dan riwayat perubahan hanya dengan ID pengajuan.', mini: [{ k: 'chip', v: 'Sedang diproses' }, { v: 'Diperbarui 28 Okt, 14.20' }] },
		{ icon: 'book', name: 'Edukasi', href: '#edukasi', text: 'Syarat, langkah, instansi, dan penyebab umum berkas tertunda, dari sumber resmi.', mini: [{ k: 'tick', v: '✓' }, { v: 'KTP ' }, { k: 'tick', v: '✓' }, { v: 'KK ' }, { k: 'tick', v: '○' }, { v: 'Surat RT' }] },
		{ icon: 'scale', name: 'Akuntabilitas', href: '#akuntabilitas', text: 'Waktu tiap tahap dicatat dan dibandingkan dengan target layanan, tanpa hukuman otomatis.', mini: [{ v: 'Sisa waktu: 2 hari kerja' }] },
		{ icon: 'bell', name: 'Pengingat', href: '#pengingat', text: 'Notifikasi saat status berubah, dokumen perlu dilengkapi, atau berkas selesai.', mini: [{ k: 'tick', v: '1' }, { v: 'Berkas perlu diperbaiki' }] },
		{ icon: 'lock', name: 'Privasi terjaga', text: 'Akses data dibatasi. ID pengajuan bukan satu-satunya kunci untuk data sensitif.', mini: [{ v: 'ID + verifikasi tambahan' }] },
		{ icon: 'desk', name: 'Untuk petugas (rencana)', text: 'Perbarui status dan catat alasan kendala. Perlu divalidasi dengan kebijakan instansi.', mini: [{ v: 'Perbarui status · Catat alasan' }] }
	];
	const faq = [
		['Bagaimana cara melacak berkas?', 'Masukkan ID pengajuan di halaman Tracking. Versi sebenarnya meminta verifikasi tambahan agar data tidak terbuka hanya dengan ID.'],
		['Apakah ID saja sudah cukup?', 'Tidak untuk data sensitif. Akses dibatasi untuk melindungi privasi pemohon.'],
		['Dari mana informasi syaratnya?', 'Dari prosedur resmi instansi terkait, lengkap dengan tautan sumber dan tanggal terakhir diverifikasi.'],
		['Kalau berkas terlambat, petugas dihukum?', 'Tidak otomatis. Sistem mencatat dan memberi tahu pihak berwenang. Penyebab dan sanksi formal diputuskan pihak yang berhak.'],
		['Bagaimana saya tahu ada perubahan?', 'Pengingat masuk ke inbox, dan riwayat notifikasinya bisa dibaca lagi kapan saja.'],
		['Apakah semua dokumen sudah didukung?', 'Belum. Versi awal fokus pada dokumen yang paling sering diurus, dan daftarnya menyesuaikan hasil validasi.']
	];

	/* ---------- Tracking ---------- */
	const D = {
		'ADM-2026-0142': { t: 'Surat keterangan domisili', u: '28 Okt 2026, 14.20', c: 2, n: 'Dokumen sedang diperiksa petugas. Estimasi selesai 3 hari kerja.', s: [['Pengajuan dibuat', '26 Okt, 09.12'], ['Menunggu verifikasi', '27 Okt, 10.40'], ['Sedang diproses', '28 Okt, 14.20'], ['Disetujui', ''], ['Selesai', '']] },
		'ADM-2026-0187': { t: 'Surat pengantar KTP', u: '29 Okt 2026, 08.05', c: 2, n: 'Fotokopi KK kurang jelas. Unggah ulang agar proses bisa dilanjutkan.', s: [['Pengajuan dibuat', '27 Okt, 13.30'], ['Menunggu verifikasi', '28 Okt, 09.00'], ['Memerlukan perbaikan', '29 Okt, 08.05'], ['Disetujui', ''], ['Selesai', '']] }
	};
	const statuses = [
		['Pengajuan dibuat', 'Berkas Anda sudah tercatat dan mendapat ID.'],
		['Menunggu verifikasi', 'Petugas belum mulai memeriksa kelengkapan berkas.'],
		['Sedang diproses', 'Berkas sedang dikerjakan. Anda tidak perlu berbuat apa-apa.'],
		['Perlu perbaikan', 'Ada dokumen kurang atau kurang jelas. Anda perlu melengkapinya.'],
		['Disetujui', 'Pengajuan diterima, tinggal tahap akhir.'],
		['Selesai', 'Proses tuntas dan dokumen siap.'],
		['Ditolak', 'Pengajuan tidak dapat dilanjutkan. Alasannya selalu dicantumkan.']
	];
	let q = $state('');
	let shown = $state(null); // null = belum mencari
	const data = $derived(shown ? D[shown] : undefined);
	function lacak(v) {
		shown = v.trim().toUpperCase();
	}

	/* ---------- Edukasi ---------- */
	const checklist = ['Fotokopi KTP', 'Fotokopi Kartu Keluarga', 'Surat pengantar RT/RW', 'Formulir permohonan terisi'];
	let done = $state(checklist.map(() => false));
	const count = $derived(done.filter(Boolean).length);

	/* ---------- Pengingat ---------- */
	let mails = $state([
		{ t: 'Berkas Anda perlu diperbaiki', s: 'Fotokopi KK kurang jelas. Unggah ulang agar proses lanjut.', isNew: true },
		{ t: 'Status berubah: Sedang diproses', s: 'Petugas mulai memeriksa berkas Anda.', isNew: true },
		{ t: 'Pengajuan dibuat', s: 'ID pengajuan Anda: ADM-2026-0142.', isNew: false }
	]);
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600&family=Figtree:wght@400;500;600&display=swap" />
</svelte:head>

{#snippet icon(n)}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html ic[n]}</svg>
{/snippet}

<nav class="nav" class:open>
	<a class="logo" href="#beranda" aria-label="Kelar.in, ke beranda" aria-current={route === 'beranda' ? 'page' : undefined}>
		<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A3CEF1" /><stop offset="1" stop-color="#274C77" /></linearGradient></defs><rect width="32" height="32" rx="10" fill="url(#lg)" /><path d="M9 16.5l4.8 4.8L23 11.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
		<span>Kelar.in</span>
	</a>
	<button class="menu" type="button" aria-expanded={open} aria-controls="lk" onclick={() => (open = !open)}>Menu</button>
	<div class="links" id="lk">
		{#each PAGES.slice(1) as p}
			<a href="#{p}" aria-current={route === p ? 'page' : undefined}>{p.charAt(0).toUpperCase() + p.slice(1)}</a>
		{/each}
	</div>
</nav>

<main>
	{#if route === 'beranda'}
		<div class="pg">
			<header class="top">
				<i class="blob" style="width:520px;height:480px;right:-140px;top:60px"></i>
				<i class="blob" style="width:300px;height:300px;left:-90px;bottom:40px;animation-delay:-8s"></i>
				<div class="wrap hg">
					<div>
						<div class="badge"><i></i>Pelacakan berkas administrasi untuk masyarakat</div>
						<h1>Berkas Anda, kelar tanpa bolak-balik.</h1>
						<p class="lead">Lihat sampai mana pengurusan surat dan dokumen Anda, pahami syaratnya sebelum berangkat, dan terima kabar setiap ada perkembangan.</p>
						<div class="acts">
							<a class="btn" href="#tracking">Lacak berkas</a>
							<button type="button" class="btn ghost" onclick={() => goTo('cara-kerja')}>Lihat cara kerja</button>
						</div>
						<ul class="perks">
							<li><span class="tick">✓</span>Status diperbarui tiap tahap</li>
							<li><span class="tick">✓</span>Pengingat langsung ke inbox</li>
							<li><span class="tick">✓</span>Data hanya untuk pemilik berkas</li>
						</ul>
					</div>
					<div class="mock" aria-hidden="true">
						<span class="fl bell">{@render icon('bell')}1 pengingat</span>
						<b>Surat keterangan domisili</b><small>ADM-2026-0142</small>
						<span class="chip">Sedang diproses</span>
						<ol class="tl">
							<li class="done">Pengajuan dibuat<small>26 Okt, 09.12</small></li>
							<li class="done">Menunggu verifikasi<small>27 Okt, 10.40</small></li>
							<li class="cur">Sedang diproses<small>28 Okt, 14.20</small></li>
							<li>Selesai</li>
						</ol>
						<span class="fl est">Estimasi 3 hari kerja</span>
					</div>
				</div>
			</header>

			<section class="sec">
				<div class="wrap">
					<div class="hd">
						<div><small>Dokumen apa yang ingin Anda urus?</small><h2>Enam kelompok dokumen, satu tempat.</h2></div>
						<p>Dari kependudukan sampai perizinan usaha. Daftar akhir menyesuaikan hasil validasi dengan instansi.</p>
					</div>
					<div class="cats">
						{#each cats as c}
							<div><div class="ci">{@render icon(c[0])}</div><b>{c[1]}</b><small>{c[2]}</small></div>
						{/each}
					</div>
				</div>
			</section>

			<section class="sec">
				<div class="wrap">
					<h2 style="max-width:20ch">Mengurus berkas sering terasa seperti menebak-nebak.</h2>
					<div class="cmp">
						<div class="pn">
							<h3>Tanpa Kelar.in</h3>
							<ul>
								<li><i>✕</i>Tidak tahu berkas masih diproses, sudah disetujui, atau kurang dokumen.</li>
								<li><i>✕</i>Syarat yang keliru membuat berkas dikembalikan dan harus diulang.</li>
								<li><i>✕</i>Harus datang berkali-kali hanya untuk bertanya “sudah sampai mana?”.</li>
							</ul>
						</div>
						<div class="pn on">
							<h3>Dengan Kelar.in</h3>
							<ul>
								<li><i>✓</i>Status, tahapan, dan riwayat perubahan terlihat kapan saja.</li>
								<li><i>✓</i>Syarat dan langkah tersedia lengkap dari sumber resmi sebelum Anda berangkat.</li>
								<li><i>✓</i>Kabar masuk ke inbox, jadi Anda datang hanya saat memang perlu.</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section class="sec" id="cara-kerja">
				<div class="wrap">
					<div class="hd"><div><small>Cara kerja</small><h2>Empat langkah, dari memilih dokumen sampai selesai.</h2></div></div>
					<ol class="steps">
						{#each steps as s, i}
							<li class="st"><b>{i + 1}</b><h3>{s[0]}</h3><p>{s[1]}</p></li>
						{/each}
					</ol>
				</div>
			</section>

			<section class="sec">
				<i class="blob" style="width:420px;height:380px;right:-160px;top:10%"></i>
				<div class="wrap two">
					<div>
						<h2 class="big">Setiap tahap tercatat waktunya.</h2>
						<p>Tiap perubahan status tersimpan bersama waktu dan unit yang menanganinya. Dari sini terlihat berapa lama tiap tahap berjalan dan di mana prosesnya tersendat.</p>
						<ol class="flow">{#each flow as f}<li>{f}</li>{/each}</ol>
					</div>
					<div class="led" role="group" aria-label="Contoh riwayat status">
						<div class="lh"><h3>Riwayat status</h3><small>3 perubahan · data contoh</small></div>
						{#each ledger as r}
							<div class="lr"><span class="ci">{@render icon(r[0])}</span><div><b>{r[1]}</b><small>{r[2]}</small></div><span class="chip">{r[3]}</span></div>
						{/each}
					</div>
				</div>
			</section>

			<section class="sec" id="fitur">
				<div class="wrap">
					<div class="hd">
						<div><small>Fitur</small><h2>Jelas bagi Anda, adil bagi semua pihak.</h2></div>
						<p>Bukan sekadar kolom cek status. Ada panduan, pencatatan waktu, dan pengingat yang saling terhubung.</p>
					</div>
					<div class="fg">
						{#each features as f}
							<article class="fc">
								<div class="ci">{@render icon(f.icon)}</div>
								<h3>{f.name}</h3>
								<p>{f.text}</p>
								<div class="mini">
									{#each f.mini as m}{#if m.k === 'chip'}<span class="chip">{m.v}</span>{:else if m.k === 'tick'}<span class="tick">{m.v}</span>{:else}{m.v}{/if}{/each}
								</div>
								{#if f.href}<a class="btn ghost" href={f.href}>Buka {f.name}</a>{/if}
							</article>
						{/each}
					</div>
				</div>
			</section>

			<section class="sec">
				<div class="wrap">
					<h2 style="margin-bottom:32px">Tiga prinsip yang kami pegang.</h2>
					<div class="prin">
						<div><h3>Transparan</h3><p>Status dan waktu pembaruan harus mencerminkan perkembangan berkas yang sebenarnya.</p></div>
						<div><h3>Terverifikasi</h3><p>Informasi prosedur bersumber dari ketentuan resmi dan dapat diperiksa.</p></div>
						<div><h3>Adil</h3><p>Keterlambatan diperiksa penyebabnya lebih dulu. Sistem tidak menjatuhkan hukuman otomatis.</p></div>
					</div>
				</div>
			</section>

			<section class="sec">
				<div class="wrap">
					<h2 style="margin-bottom:36px">Masih ragu? Baca ini dulu.</h2>
					<div class="faq">
						{#each faq as f}<details><summary>{f[0]}</summary><p>{f[1]}</p></details>{/each}
					</div>
				</div>
			</section>
		</div>
	{:else if route === 'tracking'}
		<div class="pg">
			<header class="top">
				<i class="blob" style="width:480px;height:440px;right:-140px;top:60px"></i>
				<div class="wrap">
					<h1>Lihat sampai mana berkas Anda.</h1>
					<p class="lead">Masukkan ID pengajuan untuk melihat status, tahapan, dan apa yang perlu Anda lakukan berikutnya.</p>
					<form class="track" role="search" onsubmit={(e) => { e.preventDefault(); lacak(q); }}>
						<input bind:value={q} aria-label="ID pengajuan" placeholder="Masukkan ID pengajuan" autocomplete="off" />
						<button type="submit">Lacak</button>
					</form>
					<div class="try">Coba ID contoh:
						{#each Object.keys(D) as id}
							<button type="button" onclick={() => { q = id; lacak(id); }}>{id}</button>
						{/each}
					</div>
					<div id="res" aria-live="polite">
						{#if shown !== null}
							{#if data}
								<div class="res-h">{data.t}</div>
								<div class="res-m">{shown} · Diperbarui {data.u} · Data contoh</div>
								<ol class="tl">
									{#each data.s as s, i}
										<li class:done={i < data.c} class:cur={i === data.c}>{s[0]}{#if s[1]}<small>{s[1]}</small>{/if}</li>
									{/each}
								</ol>
								<div class="note">{data.n}</div>
							{:else}
								<p class="note">{shown ? `ID “${shown}” tidak ditemukan. Periksa penulisan ID, atau coba ID contoh di atas.` : 'Masukkan ID pengajuan terlebih dahulu.'}</p>
							{/if}
						{/if}
					</div>
				</div>
			</header>
			<section class="sec">
				<div class="wrap two">
					<div><h2>Arti setiap status</h2><p style="margin-top:20px">Rancangan awal, akan disesuaikan dengan prosedur instansi. Versi sebenarnya meminta verifikasi tambahan agar data tidak terbuka hanya dengan menebak ID.</p></div>
					<div class="dl">
						{#each statuses as s}<div><b>{s[0]}</b><span>{s[1]}</span></div>{/each}
					</div>
				</div>
			</section>
		</div>
	{:else if route === 'edukasi'}
		<div class="pg">
			<header class="top">
				<i class="blob" style="width:480px;height:440px;right:-140px;top:60px"></i>
				<div class="wrap">
					<h1>Tahu syaratnya sebelum berangkat.</h1>
					<p class="lead">Panduan langkah demi langkah untuk tiap jenis dokumen, ditulis dengan bahasa sehari-hari dan bersumber dari ketentuan resmi.</p>
					<a class="btn" href="#tracking">Sudah mengajukan? Lacak berkas</a>
				</div>
			</header>
			<section class="sec">
				<div class="wrap two">
					<div><h2>Coba cek kesiapan berkas</h2><p style="margin-top:20px">Contoh surat keterangan domisili. Daftar ini ilustrasi, bukan persyaratan resmi.</p></div>
					<div>
						<div class="chk">
							{#each checklist as item, i}<label><input type="checkbox" bind:checked={done[i]} /> {item}</label>{/each}
						</div>
						<div class="cnt" aria-live="polite">{count === checklist.length ? 'Semua siap, Anda bisa berangkat.' : `${count} dari ${checklist.length} siap`}</div>
					</div>
				</div>
			</section>
			<section class="sec">
				<div class="wrap two">
					<h2>Isi setiap panduan</h2>
					<ul class="dots">
						<li>Persyaratan yang harus dibawa</li><li>Langkah pengajuan, urut dari awal sampai akhir</li><li>Instansi berwenang dan cara menghubunginya</li><li>Perkiraan lama proses, bila tersedia</li><li>Penyebab umum berkas tertunda atau ditolak, dan cara menghindarinya</li><li>Tautan sumber resmi dan tanggal terakhir diverifikasi</li>
					</ul>
				</div>
			</section>
		</div>
	{:else if route === 'akuntabilitas'}
		<div class="pg">
			<header class="top">
				<i class="blob" style="width:480px;height:440px;right:-140px;top:60px"></i>
				<div class="wrap">
					<h1>Proses yang terlihat, bukan ditebak.</h1>
					<p class="lead">Setiap perubahan status dicatat beserta waktunya, lalu dibandingkan dengan target layanan, agar hambatan cepat ketahuan dan ditindaklanjuti.</p>
					<a class="btn" href="#tracking">Lihat contoh di Tracking</a>
				</div>
			</header>
			<section class="sec">
				<div class="wrap two">
					<div><h2>Contoh pemantauan waktu</h2><p style="margin-top:20px">Data ilustrasi. Target waktu sebenarnya mengikuti standar pelayanan yang berlaku.</p></div>
					<div>
						<div class="row"><div><b>Surat domisili</b><span>Aman · hari ke-1 dari 3</span></div><div class="bar"><i style="width:33%"></i></div></div>
						<div class="row"><div><b>Surat pengantar KTP</b><span>Mendekati target · hari ke-3 dari 4</span></div><div class="bar"><i style="width:80%"></i></div></div>
						<div class="row">
							<div><b>Surat keterangan usaha</b><span>Melewati target · hari ke-6 dari 5</span></div>
							<div class="bar late"><i style="width:100%"></i></div>
							<p style="margin:10px 0 0;font-size:.92rem">Alasan tercatat: menunggu dokumen tambahan dari pemohon. Pihak berwenang telah diberi tahu.</p>
						</div>
					</div>
				</div>
			</section>
			<section class="sec">
				<div class="wrap who">
					<div><h3>Yang dilakukan sistem</h3><ul class="dots"><li>Mencatat waktu tiap perubahan status</li><li>Menandai berkas yang melewati target</li><li>Mencatat alasan keterlambatan dan tindak lanjutnya</li><li>Memberi tahu pihak berwenang dan menyusun laporan durasi</li></ul></div>
					<div><h3>Yang tidak dilakukan sistem</h3><ul class="dots"><li>Menjatuhkan hukuman otomatis karena terlambat</li><li>Menyimpulkan petugas lalai tanpa memeriksa penyebabnya</li><li>Menetapkan sanksi formal, karena itu wewenang pihak yang berhak</li></ul></div>
				</div>
			</section>
		</div>
	{:else}
		<div class="pg">
			<header class="top">
				<i class="blob" style="width:480px;height:440px;right:-140px;top:60px"></i>
				<div class="wrap">
					<h1>Kabar terbaru langsung ke inbox Anda.</h1>
					<p class="lead">Tidak perlu membuka halaman berulang kali. Kelar.in memberi tahu saat ada perubahan atau saat Anda perlu bertindak.</p>
					<a class="btn" href="#tracking">Lacak berkas</a>
				</div>
			</header>
			<section class="sec">
				<div class="wrap two">
					<div><h2>Contoh inbox</h2><p style="margin-top:20px">Klik pesan untuk menandainya sudah dibaca. Isi pesan hanya ilustrasi.</p></div>
					<div>
						{#each mails as m}
							<button class="mail" class:new={m.isNew} type="button" onclick={() => (m.isNew = false)}><b>{m.t}</b><small>{m.s}</small></button>
						{/each}
					</div>
				</div>
			</section>
			<section class="sec">
				<div class="wrap two">
					<h2>Kapan Anda diberi kabar</h2>
					<ul class="dots"><li>Status pengajuan berubah</li><li>Ada dokumen atau tindakan yang perlu Anda lengkapi</li><li>Berkas terkendala, lengkap dengan alasannya</li><li>Berkas sudah selesai</li><li>Semua pesan tersimpan di inbox dan bisa dibaca lagi</li></ul>
				</div>
			</section>
		</div>
	{/if}
</main>

<section class="bot end">
	<i class="blob" style="width:520px;height:300px;left:50%;margin-left:-260px;bottom:-140px"></i>
	<div class="wrap">
		<h2>Berkas jelas, hati tenang.</h2>
		<p>Mulai dari melihat status berkas yang sedang Anda urus.</p>
		<a class="btn" href="#tracking">Lacak berkas sekarang</a>
		<nav class="fn" aria-label="Footer"><a href="#beranda">Beranda</a><a href="#tracking">Tracking</a><a href="#edukasi">Edukasi</a><a href="#akuntabilitas">Akuntabilitas</a><a href="#pengingat">Pengingat</a></nav>
		<footer>© 2026 Kelar.in. Rancangan awal, data contoh hanya ilustrasi.</footer>
	</div>
</section>

<style>
@keyframes -global-drift{to{transform:translate(30px,-24px) rotate(14deg)}}
:global {
:root{--bg:#E7ECEF;--bg2:#d3e6f6;--top:#b9d8f3;--ink:#274C77;--ink2:#41638a;--sea:#6096BA;--sky:#A3CEF1;--glass:rgba(255,255,255,.5);--line:rgba(39,76,119,.15);--btn:#274C77;--btnink:#E7ECEF;--blob:.6;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e1b2c;--bg2:#17304d;--top:#23507f;--ink:#E7ECEF;--ink2:#b3c6da;--glass:rgba(163,206,241,.1);--line:rgba(163,206,241,.2);--btn:#A3CEF1;--btnink:#0e1b2c;--blob:.3}}
:root[data-theme="dark"]{--bg:#0e1b2c;--bg2:#17304d;--top:#23507f;--ink:#E7ECEF;--ink2:#b3c6da;--glass:rgba(163,206,241,.1);--line:rgba(163,206,241,.2);--btn:#A3CEF1;--btnink:#0e1b2c;--blob:.3}
*{box-sizing:border-box}html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;background:var(--bg);color:var(--ink);font:400 1.05rem/1.7 Figtree,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:"Bricolage Grotesque",Figtree,system-ui,sans-serif;font-weight:600;letter-spacing:-.02em;line-height:1.1;margin:0}
h1{font-size:clamp(2.4rem,6.5vw,4.4rem);max-width:15ch}h2{font-size:clamp(1.7rem,3.8vw,2.8rem)}h3{font-size:1.25rem;letter-spacing:-.01em}
p{margin:0 0 1em;max-width:62ch;color:var(--ink2)}ul,ol{margin:0;padding:0;list-style:none}a{color:inherit}small{color:var(--ink2)}
:focus-visible{outline:3px solid var(--sea);outline-offset:3px;border-radius:8px}
button,.btn{font:600 1rem Figtree,sans-serif;border:0;border-radius:999px;padding:12px 26px;background:var(--btn);color:var(--btnink);cursor:pointer;text-decoration:none;display:inline-block}
.btn.ghost{background:var(--glass);color:var(--ink);border:1px solid var(--line)}
.nav{position:fixed;z-index:10;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 12px);width:min(960px,calc(100% - 24px));display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 8px 8px 16px;border-radius:999px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4)}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;font:600 1.25rem "Bricolage Grotesque",sans-serif}.logo svg{width:32px;height:32px;flex:none}
.links{display:flex;gap:4px}.links a{text-decoration:none;color:var(--ink2);font-size:.95rem;padding:8px 16px;border-radius:999px}.links a:hover{color:var(--ink)}.links a[aria-current]{background:var(--btn);color:var(--btnink)}
.menu{display:none;padding:8px 18px}
@media(max-width:780px){.menu{display:block}.links{display:none;position:absolute;top:calc(100% + 8px);left:0;right:0;flex-direction:column;padding:10px;border-radius:28px;background:color-mix(in srgb,var(--bg) 88%,transparent);border:1px solid var(--line);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}.nav.open .links{display:flex}}
.top{position:relative;overflow:hidden;background:linear-gradient(180deg,var(--top),var(--bg2) 50%,var(--bg));padding:clamp(120px,16vw,160px) 0 clamp(72px,10vw,120px)}
.sec{position:relative;overflow:hidden;padding:clamp(48px,7vw,90px) 0;scroll-margin-top:20px}
.bot{position:relative;overflow:hidden;background:linear-gradient(180deg,var(--bg),var(--bg2) 45%,var(--top));padding:clamp(100px,14vw,170px) 0 40px}
.wrap{position:relative;z-index:1;max-width:1060px;margin:0 auto;padding:0 24px}
.blob{position:absolute;z-index:0;pointer-events:none;filter:blur(46px);opacity:var(--blob);background:radial-gradient(circle at 30% 30%,var(--sky),var(--sea) 80%);border-radius:62% 38% 55% 45%/48% 58% 42% 52%;animation:drift 22s ease-in-out infinite alternate}

@media (prefers-reduced-motion:reduce){.blob{animation:none}}
.lead{font-size:1.2rem;margin:24px 0 32px}
.badge{display:inline-flex;gap:10px;align-items:center;padding:6px 16px;margin-bottom:24px;border-radius:999px;background:var(--glass);border:1px solid var(--line);font-size:.9rem}.badge i{width:10px;height:10px;border-radius:50%;background:var(--sea)}
.hg{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:48px;align-items:center}@media(max-width:900px){.hg{grid-template-columns:1fr}}
.acts{display:flex;flex-wrap:wrap;gap:12px}
.perks{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:28px;font-size:.92rem;color:var(--ink2)}.perks li{display:flex;gap:8px;align-items:center}
.tick{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--sky),var(--sea));color:#0e1b2c;font-size:.75rem;font-weight:700}
.mock{position:relative;padding:24px;border-radius:30px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transform:rotate(-2deg);margin:20px 12px}
.mock b{font:600 1.3rem "Bricolage Grotesque",sans-serif;display:block}.mock small{display:block;margin-bottom:12px}.mock .tl{margin:16px 0 8px}.mock .tl li{padding-bottom:12px}
.chip{display:inline-block;padding:4px 14px;border-radius:999px;background:linear-gradient(135deg,var(--sky),var(--sea));color:#0e1b2c;font-size:.85rem;font-weight:600}
.fl{position:absolute;z-index:2;padding:8px 16px;border-radius:999px;background:var(--bg);border:1px solid var(--line);font-weight:600;font-size:.9rem;display:flex;gap:8px;align-items:center}.fl svg{width:20px;height:20px}
.bell{top:-18px;left:16px;transform:rotate(-5deg)}.est{bottom:-18px;right:12px;transform:rotate(4deg)}
.hd{display:flex;flex-direction:column;gap:12px;margin-bottom:40px}.hd p{margin:0}@media(min-width:900px){.hd{flex-direction:row;justify-content:space-between;align-items:flex-end}.hd p{max-width:36ch}}
.cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:32px 16px;padding:36px 24px;border-radius:32px;background:var(--glass);border:1px solid var(--line);text-align:center}
.cats b{display:block;font-size:1.1rem}.cats small{display:block;line-height:1.4;font-size:.88rem}
.ci{width:84px;height:84px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--sky),var(--sea))}.cats>div:nth-child(even) .ci{background:linear-gradient(315deg,var(--sky),var(--sea));border-radius:60% 40% 55% 45%/50% 60% 40% 50%}
.ci svg{width:38px;height:38px;color:#0e1b2c}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:40px}@media(max-width:780px){.cmp{grid-template-columns:1fr}}
.pn{padding:30px;border-radius:28px;background:var(--glass);border:1px solid var(--line)}.pn.on{background:linear-gradient(135deg,color-mix(in srgb,var(--sky) 55%,transparent),color-mix(in srgb,var(--sea) 25%,transparent))}
.pn h3{font-size:1.6rem;margin-bottom:18px}.pn li{display:flex;gap:12px;margin-bottom:14px;color:var(--ink2)}.pn li i{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;border:2px solid var(--ink);font-style:normal;font-size:.75rem;font-weight:700;color:var(--ink)}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;align-items:start}
.st{padding:26px;border-radius:28px;background:var(--glass);border:1px solid var(--line)}.st b{display:block;font:600 4.5rem "Bricolage Grotesque",sans-serif;line-height:.9;color:var(--sea);margin-bottom:14px}.st h3{margin-bottom:8px}.st p{margin:0;font-size:.98rem}
@media(min-width:1000px){.st:nth-child(1){margin-top:90px}.st:nth-child(2){margin-top:60px}.st:nth-child(3){margin-top:30px}}
.led{border-radius:28px;background:var(--glass);border:1px solid var(--line);overflow:hidden}
.lh{display:flex;justify-content:space-between;align-items:baseline;padding:20px 24px}.lh h3{font-size:1.6rem}
.lr{display:flex;gap:14px;align-items:center;padding:16px 24px;border-top:1px solid var(--line)}.lr .ci{width:44px;height:44px;margin:0;flex:none}.lr .ci svg{width:22px;height:22px}.lr div{flex:1;min-width:0}.lr b{display:block}.lr small{display:block}
.flow{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.flow li{padding:6px 16px;border-radius:999px;background:var(--glass);border:1px solid var(--line);font-size:.92rem;color:var(--ink)}.flow li:last-child{background:var(--btn);color:var(--btnink)}
.big{font-size:clamp(2.2rem,6vw,4.4rem);max-width:14ch;margin-bottom:28px}
.fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:24px}
.fc{display:flex;flex-direction:column;gap:12px;padding:28px;border-radius:30px;background:var(--glass);border:1px solid var(--line);min-height:320px}.fc .ci{width:60px;height:60px;margin:0 0 4px}.fc h3{font-size:1.5rem}.fc p{margin:0;font-size:.98rem}
.mini{margin-top:auto;padding:12px 16px;border-radius:20px;background:color-mix(in srgb,var(--bg) 70%,transparent);border:1px solid var(--line);font-size:.9rem;display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:var(--ink)}
.fc .btn{align-self:flex-start;padding:8px 20px;font-size:.92rem}
.prin{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;padding:36px;border-radius:32px;background:var(--glass);border:1px solid var(--line)}.prin h3{margin-bottom:8px}.prin p{margin:0;font-size:.98rem}
.faq{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}@media(max-width:780px){.faq{grid-template-columns:1fr}}
details{padding:18px 24px;border-radius:24px;background:var(--glass);border:1px solid var(--line)}summary{font:600 1.1rem "Bricolage Grotesque",sans-serif;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:12px}summary::-webkit-details-marker{display:none}summary::after{content:"+";font-size:1.4rem;line-height:1}details[open] summary::after{content:"−"}details p{margin:12px 0 0}
.track{display:flex;gap:6px;max-width:520px;padding:6px;border-radius:999px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.track input{flex:1;min-width:0;border:0;background:none;color:var(--ink);font:inherit;padding:10px 18px}.track input:focus-visible{outline:none}.track:focus-within{outline:3px solid var(--sea);outline-offset:3px}
.try{margin-top:14px;font-size:.92rem;color:var(--ink2)}.try button{background:none;color:var(--ink);padding:4px 10px;border:1px solid var(--line);font-weight:500;font-size:.9rem;margin-left:6px}
#res{margin-top:40px;max-width:560px;min-height:24px}
.res-h{font:600 1.35rem "Bricolage Grotesque",sans-serif;margin-bottom:4px}.res-m{font-size:.92rem;color:var(--ink2);margin-bottom:22px}
.tl li{position:relative;padding:0 0 20px 38px;color:var(--ink2)}
.tl li::before{content:"";position:absolute;left:0;top:5px;width:16px;height:16px;border-radius:50%;border:2px solid var(--sea)}
.tl li::after{content:"";position:absolute;left:7px;top:24px;bottom:-2px;width:2px;background:linear-gradient(var(--sea),var(--sky));opacity:.5}.tl li:last-child::after{display:none}
.tl li.done::before{background:var(--sea)}.tl li.cur::before{background:var(--sky);box-shadow:0 0 0 6px color-mix(in srgb,var(--sky) 45%,transparent);border-color:var(--ink)}
.tl li.cur{color:var(--ink);font-weight:600}.tl small{display:block;font-weight:400;font-size:.88rem}
.note{padding:16px 20px;border-radius:22px 22px 22px 6px;background:linear-gradient(135deg,color-mix(in srgb,var(--sky) 50%,transparent),color-mix(in srgb,var(--sea) 18%,transparent));color:var(--ink);margin-top:6px}
.two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:clamp(28px,6vw,80px)}@media(max-width:780px){.two{grid-template-columns:1fr}}
.dots li{position:relative;padding:0 0 6px 20px;color:var(--ink2)}.dots{margin:12px 0}
.dots li::before{content:"";position:absolute;left:0;top:.72em;width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,var(--sky),var(--sea))}
.dl>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:20px;padding:16px 0;border-top:1px solid var(--line)}.dl b{font-family:"Bricolage Grotesque",sans-serif;font-weight:600}.dl span{color:var(--ink2)}
@media(max-width:620px){.dl>div{grid-template-columns:1fr;gap:4px}}
.who{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,6vw,72px)}@media(max-width:700px){.who{grid-template-columns:1fr}}
.chk label{display:flex;gap:12px;align-items:center;padding:12px 18px;margin-bottom:8px;border-radius:999px;background:var(--glass);border:1px solid var(--line);cursor:pointer}.chk input{width:20px;height:20px;accent-color:var(--sea)}.cnt{margin-top:14px;font-weight:600;color:var(--ink)}
.row{padding:18px 0;border-top:1px solid var(--line)}.row div{display:flex;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap}.row span{color:var(--ink2);font-size:.92rem}
.bar{height:10px;border-radius:99px;background:var(--line);overflow:hidden}.bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--sky),var(--sea))}.bar.late i{background:var(--ink)}
.mail{display:block;width:100%;text-align:left;background:var(--glass);color:var(--ink);border:1px solid var(--line);border-radius:22px;padding:14px 20px 14px 44px;font-weight:400;margin-bottom:10px;position:relative}.mail b{display:block;font-weight:400}.mail small{color:var(--ink2)}
.mail.new b{font-weight:600}.mail.new::before{content:"";position:absolute;left:18px;top:20px;width:12px;height:12px;border-radius:50%;background:var(--sea)}.mail.new small::after{content:" · Baru"}
.end{text-align:center}.end h2{max-width:20ch;margin:0 auto 24px}.end p{margin:0 auto 1.4em}
.fn{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 24px;margin-top:56px;font-size:.95rem}.fn a{text-decoration:none;color:var(--ink2)}.fn a:hover{color:var(--ink)}
footer{font-size:.9rem;color:var(--ink2);text-align:center;margin-top:24px}
}
</style>