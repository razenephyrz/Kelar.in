import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const connection = await mysql.createConnection({
	uri: process.env.DATABASE_URL,
	ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

const services = [
	[
		'ktp',
		'Pembuatan atau Perubahan KTP',
		'Administrasi Kependudukan',
		'Pengajuan pembuatan KTP elektronik baru, perubahan data, atau penggantian KTP.',
		7,
		'7 hari kerja',
		'Petugas Kelurahan',
		['Kartu Keluarga', 'Akta Kelahiran', 'Pas foto terbaru'],
		['petugas']
	],
	[
		'kartu-keluarga',
		'Pembuatan atau Perubahan Kartu Keluarga',
		'Administrasi Kependudukan',
		'Pengajuan penerbitan atau perubahan susunan dan data anggota keluarga.',
		7,
		'7 hari kerja',
		'Petugas Kelurahan',
		['KTP anggota keluarga', 'Akta kelahiran atau buku nikah', 'Surat pengantar RT/RW'],
		['petugas', 'lurah']
	],
	[
		'sktm',
		'Surat Keterangan Tidak Mampu (SKTM)',
		'Surat Keterangan',
		'Surat keterangan kondisi sosial ekonomi untuk keperluan pendidikan, kesehatan, atau bantuan.',
		3,
		'3 hari kerja',
		'Petugas Kelurahan',
		['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		['petugas', 'rt_rw', 'lurah']
	],
	[
		'akta-kelahiran',
		'Akta Kelahiran',
		'Pencatatan Sipil',
		'Pengajuan surat pengantar dan penerbitan akta kelahiran.',
		5,
		'5 hari kerja',
		'Petugas Kelurahan',
		['Kartu Keluarga', 'Surat keterangan lahir', 'KTP orang tua', 'Buku nikah orang tua'],
		['petugas', 'lurah']
	],
	[
		'akta-kematian',
		'Akta Kematian',
		'Pencatatan Sipil',
		'Pencatatan kematian dan penerbitan akta kematian.',
		5,
		'5 hari kerja',
		'Petugas Kelurahan',
		['KTP almarhum', 'Kartu Keluarga', 'Surat keterangan kematian'],
		['petugas', 'lurah']
	],
	[
		'surat-domisili',
		'Surat Keterangan Domisili',
		'Surat Keterangan',
		'Surat keterangan domisili dengan pengantar dan persetujuan RT/RW.',
		3,
		'3 hari kerja',
		'Petugas Kelurahan',
		['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		['petugas', 'rt_rw', 'lurah']
	],
	[
		'surat-usaha',
		'Surat Keterangan Usaha',
		'Administrasi Usaha',
		'Surat keterangan usaha untuk kebutuhan perizinan, pembiayaan, atau administrasi lainnya.',
		3,
		'3 hari kerja',
		'Petugas Kelurahan',
		['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW', 'Foto tempat usaha'],
		['petugas', 'rt_rw', 'lurah']
	],
	[
		'belum-menikah',
		'Surat Keterangan Belum Menikah',
		'Surat Keterangan',
		'Surat keterangan status belum menikah untuk kebutuhan administrasi warga.',
		3,
		'3 hari kerja',
		'Petugas Kelurahan',
		['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		['petugas', 'lurah']
	]
];

for (const [
	id,
	name,
	category,
	description,
	days,
	target,
	department,
	checklist,
	approvals
] of services) {
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
