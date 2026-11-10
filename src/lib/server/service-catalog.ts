export const citizenServices = [
	{
		id: 'ktp',
		name: 'Pembuatan atau Perubahan KTP',
		category: 'Administrasi Kependudukan',
		description: 'Pengajuan pembuatan KTP elektronik baru, perubahan data, atau penggantian KTP.',
		processingDays: 7,
		processingTarget: '7 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['Kartu Keluarga', 'Akta Kelahiran', 'Pas foto terbaru'],
		approvals: ['petugas']
	},
	{
		id: 'kartu-keluarga',
		name: 'Pembuatan atau Perubahan Kartu Keluarga',
		category: 'Administrasi Kependudukan',
		description: 'Pengajuan penerbitan atau perubahan susunan dan data anggota keluarga.',
		processingDays: 7,
		processingTarget: '7 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP anggota keluarga', 'Akta kelahiran atau buku nikah', 'Surat pengantar RT/RW'],
		approvals: ['petugas', 'lurah']
	},
	{
		id: 'sktm',
		name: 'Surat Keterangan Tidak Mampu (SKTM)',
		category: 'Surat Keterangan',
		description:
			'Surat keterangan kondisi sosial ekonomi untuk keperluan pendidikan, kesehatan, atau bantuan.',
		processingDays: 3,
		processingTarget: '3 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		approvals: ['petugas', 'rt_rw', 'lurah']
	},
	{
		id: 'akta-kelahiran',
		name: 'Akta Kelahiran',
		category: 'Pencatatan Sipil',
		description: 'Pengajuan surat pengantar dan penerbitan akta kelahiran.',
		processingDays: 5,
		processingTarget: '5 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: [
			'Kartu Keluarga',
			'Surat keterangan lahir',
			'KTP orang tua',
			'Buku nikah orang tua'
		],
		approvals: ['petugas', 'lurah']
	},
	{
		id: 'akta-kematian',
		name: 'Akta Kematian',
		category: 'Pencatatan Sipil',
		description: 'Pencatatan kematian dan penerbitan akta kematian.',
		processingDays: 5,
		processingTarget: '5 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP almarhum', 'Kartu Keluarga', 'Surat keterangan kematian'],
		approvals: ['petugas', 'lurah']
	},
	{
		id: 'surat-domisili',
		name: 'Surat Keterangan Domisili',
		category: 'Surat Keterangan',
		description: 'Surat keterangan domisili dengan pengantar dan persetujuan RT/RW.',
		processingDays: 3,
		processingTarget: '3 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		approvals: ['petugas', 'rt_rw', 'lurah']
	},
	{
		id: 'surat-usaha',
		name: 'Surat Keterangan Usaha',
		category: 'Administrasi Usaha',
		description:
			'Surat keterangan usaha untuk kebutuhan perizinan, pembiayaan, atau administrasi lainnya.',
		processingDays: 3,
		processingTarget: '3 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW', 'Foto tempat usaha'],
		approvals: ['petugas', 'rt_rw', 'lurah']
	},
	{
		id: 'belum-menikah',
		name: 'Surat Keterangan Belum Menikah',
		category: 'Surat Keterangan',
		description: 'Surat keterangan status belum menikah untuk kebutuhan administrasi warga.',
		processingDays: 3,
		processingTarget: '3 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		approvals: ['petugas', 'lurah']
	}
] as const;

export function getCatalogServices() {
	return citizenServices.map((item) => ({
		...item,
		active: true,
		createdAt: new Date(0),
		updatedAt: new Date(0),
		checklist: item.checklist.map((label, position) => ({
			id: position,
			serviceId: item.id,
			label,
			position,
			required: true
		})),
		approvals: item.approvals.map((role, position) => ({
			id: position,
			serviceId: item.id,
			role,
			position
		}))
	}));
}
