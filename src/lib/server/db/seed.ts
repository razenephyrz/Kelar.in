import { sql } from 'drizzle-orm';
import { db } from './index';
import { service, serviceApproval, serviceChecklist } from './schema';

const services = [
	{
		id: 'ktp',
		name: 'KTP',
		category: 'Administrasi Kependudukan',
		description: 'Pengajuan pembuatan atau perubahan KTP dengan estimasi proses yang jelas.',
		processingDays: 7,
		processingTarget: '7 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['Kartu Keluarga', 'Akta Kelahiran', 'Pas foto terbaru'],
		approvals: ['petugas']
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
		id: 'slip-gaji',
		name: 'Slip Gaji',
		category: 'Administrasi Umum',
		description: 'Penerbitan surat keterangan penghasilan atau slip gaji untuk kebutuhan warga.',
		processingDays: 3,
		processingTarget: '3 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP', 'Kartu Keluarga', 'Surat pengantar instansi'],
		approvals: ['petugas', 'lurah']
	},
	{
		id: 'surat-domisili',
		name: 'Surat Domisili',
		category: 'Administrasi Kependudukan',
		description: 'Surat keterangan domisili dengan pengantar dan persetujuan RT/RW.',
		processingDays: 3,
		processingTarget: '3 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		approvals: ['petugas', 'rt_rw', 'lurah']
	},
	{
		id: 'belum-menikah',
		name: 'Surat Keterangan Belum Menikah',
		category: 'Administrasi Kependudukan',
		description: 'Surat keterangan status belum menikah untuk kebutuhan administrasi warga.',
		processingDays: 3,
		processingTarget: '3 hari kerja',
		responsibleDepartment: 'Petugas Kelurahan',
		checklist: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
		approvals: ['petugas', 'lurah']
	}
] as const;

export async function seedCitizenServices() {
	for (const item of services) {
		await db
			.insert(service)
			.values({
				id: item.id,
				name: item.name,
				category: item.category,
				description: item.description,
				processingDays: item.processingDays,
				processingTarget: item.processingTarget,
				responsibleDepartment: item.responsibleDepartment
			})
			.onDuplicateKeyUpdate({
				set: {
					name: sql`VALUES(name)`,
					description: sql`VALUES(description)`,
					processingDays: sql`VALUES(processing_days)`,
					processingTarget: sql`VALUES(processing_target)`,
					responsibleDepartment: sql`VALUES(responsible_department)`
				}
			});

		await db
			.insert(serviceChecklist)
			.values(item.checklist.map((label, position) => ({ serviceId: item.id, label, position })))
			.onDuplicateKeyUpdate({ set: { label: sql`VALUES(label)` } });

		await db
			.insert(serviceApproval)
			.values(item.approvals.map((role, position) => ({ serviceId: item.id, role, position })))
			.onDuplicateKeyUpdate({ set: { role: sql`VALUES(role)` } });
	}
}
