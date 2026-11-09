import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const connection = await mysql.createConnection({
	uri: process.env.DATABASE_URL,
	ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

const services = [
	['ktp', 'KTP', 'Administrasi Kependudukan', 'Pengajuan pembuatan atau perubahan KTP dengan estimasi proses yang jelas.', 7, '7 hari kerja', 'Petugas Kelurahan', ['Kartu Keluarga', 'Akta Kelahiran', 'Pas foto terbaru'], ['petugas']],
	['akta-kematian', 'Akta Kematian', 'Pencatatan Sipil', 'Pencatatan kematian dan penerbitan akta kematian.', 5, '5 hari kerja', 'Petugas Kelurahan', ['KTP almarhum', 'Kartu Keluarga', 'Surat keterangan kematian'], ['petugas', 'lurah']],
	['slip-gaji', 'Slip Gaji', 'Administrasi Umum', 'Penerbitan surat keterangan penghasilan atau slip gaji untuk kebutuhan warga.', 3, '3 hari kerja', 'Petugas Kelurahan', ['KTP', 'Kartu Keluarga', 'Surat pengantar instansi'], ['petugas', 'lurah']],
	['surat-domisili', 'Surat Domisili', 'Administrasi Kependudukan', 'Surat keterangan domisili dengan pengantar dan persetujuan RT/RW.', 3, '3 hari kerja', 'Petugas Kelurahan', ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'], ['petugas', 'rt_rw', 'lurah']],
	['belum-menikah', 'Surat Keterangan Belum Menikah', 'Administrasi Kependudukan', 'Surat keterangan status belum menikah untuk kebutuhan administrasi warga.', 3, '3 hari kerja', 'Petugas Kelurahan', ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'], ['petugas', 'lurah']]
];

for (const [id, name, category, description, days, target, department, checklist, approvals] of services) {
	await connection.query(
		'INSERT INTO service (id, name, category, description, processing_days, processing_target, responsible_department) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), description=VALUES(description), processing_days=VALUES(processing_days), processing_target=VALUES(processing_target), responsible_department=VALUES(responsible_department)',
		[id, name, category, description, days, target, department]
	);
	for (const [position, label] of checklist.entries()) {
		await connection.query(
			'INSERT INTO service_checklist (service_id, label, position, required) VALUES (?, ?, ?, true) ON DUPLICATE KEY UPDATE position=VALUES(position), required=true',
			[id, label, position]
		);
	}
	for (const [position, role] of approvals.entries()) {
		await connection.query(
			'INSERT INTO service_approval (service_id, role, position) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE position=VALUES(position)',
			[id, role, position]
		);
	}
}

await connection.end();
console.log('Seed layanan warga selesai.');
