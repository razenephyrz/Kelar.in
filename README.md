# Kelar.in

**Kelar.in** adalah aplikasi web *public service tracking* untuk melacak berkas pelayanan kelurahan secara transparan dan pasti. Warga dapat memantau status pengajuan berkasnya dari awal hingga selesai, tanpa perlu bolak-balik ke kantor kelurahan untuk bertanya.

> Karya untuk **MIA 2026** — tahap *First Draft Submission* (01 November 2026).

---

## Tech Stack

| Kebutuhan | Teknologi |
| --- | --- |
| Framework | [SvelteKit](https://svelte.dev/docs/kit) (Svelte + TypeScript) |
| Build tool | Vite |
| Styling | Tailwind CSS (plugin `typography` & `forms`) |
| Database | MySQL (driver `mysql2`) |
| ORM | Drizzle ORM (`drizzle-kit` untuk skema/migrasi) |
| Autentikasi | Better Auth |
| Testing | Vitest |
| Kualitas kode | ESLint + Prettier |
| Deployment | Netlify (`@sveltejs/adapter-netlify`) |

---

## Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) (disarankan versi LTS terbaru) dan npm
- Server MySQL yang sudah berjalan (lokal atau remote)
- Git

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/razenephyrz/Kelar.in.git
cd Kelar.in

# 2. Install dependency
npm install

# 3. Siapkan environment variable
cp .env.example .env
#    lalu isi nilai di .env (koneksi database, secret auth, dll.)

# 4. Siapkan skema database
npm run db:push

# 5. Jalankan development server
npm run dev
#    atau langsung buka di browser:
npm run dev -- --open
```

Aplikasi berjalan di `http://localhost:5173` (default Vite).

### Perintah lain

```bash
npm run build      # build versi production
npm run preview    # preview hasil build
npm run lint       # cek ESLint & Prettier
npm run test       # jalankan unit test (Vitest)
```

---

## Progress Saat Ini

**Status: First Draft (pra-penyisihan)**

- [x] Inisialisasi project SvelteKit + TypeScript
- [x] Setup Tailwind CSS, ESLint, Prettier, Vitest
- [x] Setup Drizzle ORM + MySQL dan konfigurasi Better Auth
- [x] Konfigurasi deployment Netlify
- [x] Landing page
- [ ] Halaman login / registrasi
- [ ] Form pengajuan berkas layanan
- [ ] Halaman pelacakan status berkas (timeline status)
- [ ] Dashboard petugas kelurahan untuk memperbarui status berkas
- [ ] Notifikasi perubahan status

---

## Struktur Project

```
Kelar.in/
├── src/              # Kode aplikasi (routes, komponen, logic server)
├── static/           # Aset statis
├── drizzle.config.ts # Konfigurasi Drizzle ORM
├── vite.config.ts    # Konfigurasi Vite
├── .env.example      # Contoh environment variable
└── package.json
```

---

## Tim

- [Katanya Faiz Kumpul di FC](https://github.com/razenephyrz)

<!-- Tambahkan nama anggota tim lainnya di sini -->
