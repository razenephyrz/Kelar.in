export type Role = 'warga' | 'petugas' | 'lurah' | 'rt_rw' | 'super_admin';

export type Permission =
	| 'request:create'
	| 'request:track'
	| 'request:review'
	| 'request:approve'
	| 'request:sign'
	| 'request:accept'
	| 'request:update'
	| 'request:create_offline'
	| 'content:education'
	| 'content:transparency'
	| 'system:manage';

export const ROLE_META: Record<Role, { label: string; description: string }> = {
	warga: {
		label: 'User / Warga',
		description: 'Mengajukan layanan, memantau proses, dan membaca informasi publik.'
	},
	rt_rw: {
		label: 'RT/RW',
		description: 'Memberi persetujuan dan tanda tangan pada pengajuan wilayah.'
	},
	lurah: {
		label: 'Pak Lurah',
		description: 'Memberi persetujuan dan tanda tangan akhir.'
	},
	petugas: {
		label: 'Petugas Kelurahan',
		description: 'Menerima, memverifikasi, dan memperbarui proses pengajuan.'
	},
	super_admin: {
		label: 'Superadmin',
		description: 'Mengelola akun, role, layanan, dan konfigurasi sistem.'
	}
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
	warga: ['request:create', 'request:track', 'content:education', 'content:transparency'],
	rt_rw: ['request:approve', 'request:sign', 'request:track'],
	lurah: ['request:approve', 'request:sign', 'request:track'],
	petugas: [
		'request:accept',
		'request:update',
		'request:create_offline',
		'request:track',
		'content:education',
		'content:transparency'
	],
	super_admin: [
		'request:create',
		'request:track',
		'request:review',
		'request:approve',
		'request:sign',
		'request:accept',
		'request:update',
		'request:create_offline',
		'content:education',
		'content:transparency',
		'system:manage'
	]
};

export function hasPermission(
    role: Role | undefined,
    permission: Permission
): boolean {
    if (!role) return false;

    const permissions = ROLE_PERMISSIONS[role];

    return permissions?.includes(permission) ?? false;
}

export interface User {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	role: Role;
	createdAt: string;
	avatarColor?: string;
}

export type RequestStatus =
	| 'draft'
	| 'submitted'
	| 'under_review'
	| 'action_required'
	| 'approved'
	| 'completed'
	| 'rejected';

export interface AdministrativeRequest {
	id: string;
	ownerId: string;
	documentType: string;
	title: string;
	description: string;
	status: RequestStatus;
	createdAt: string;
	updatedAt: string;
	targetCompletionAt: string;
	assignedDepartment: string;
	requiredActions: string[];
	delayReason?: string;
	escalationFlag?: boolean;
	metadata: Record<string, string>;
	requestedCompletionAt?: string;
	progressOverride?: number;
}

export interface RequestHistory {
	id: string;
	requestId: string;
	previousStatus: RequestStatus | '—';
	newStatus: RequestStatus;
	explanation: string;
	actorId: string;
	actorName: string;
	actorRole: Role | 'system' | 'citizen' | 'admin';
	timestamp: string;
}

export type NotificationType =
	'request_created' | 'status_change' | 'action_required' | 'completed' | 'overdue' | 'info';

export interface Notification {
	id: string;
	recipientId: string;
	requestId?: string;
	title: string;
	message: string;
	type: NotificationType;
	isRead: boolean;
	createdAt: string;
}

export interface DocumentProcedure {
	id: string;
	name: string;
	category: string;
	description: string;
	eligibility: string[];
	requiredDocuments: string[];
	procedureSteps: { title: string; detail: string; duration: string }[];
	responsibleDepartment: string;
	processingTarget: string;
	processingDays: number;
	commonPitfalls: string[];
	sourceReference: string;
	lastVerifiedAt: string;
	approvalRoles?: Role[];
}

export const STATUS_META: Record<
	RequestStatus,
	{ label: string; color: string; bg: string; dot: string; description: string }
> = {
	draft: {
		label: 'Draf',
		color: '#647587',
		bg: '#E7ECEF',
		dot: '#647587',
		description: 'Belum diajukan dan hanya dapat dilihat oleh kamu.'
	},
	submitted: {
		label: 'Diajukan',
		color: '#274C77',
		bg: '#E7ECEF',
		dot: '#274C77',
		description: 'Sudah diterima petugas dan menunggu verifikasi.'
	},
	under_review: {
		label: 'Sedang diproses',
		color: '#274C77',
		bg: '#D8E8F5',
		dot: '#6096BA',
		description: 'Sedang diperiksa oleh petugas yang bertanggung jawab.'
	},
	action_required: {
		label: 'Perlu perbaikan',
		color: '#7A5A1F',
		bg: '#F7EBCF',
		dot: '#B78032',
		description: 'Ada informasi atau berkas yang perlu dilengkapi.'
	},
	approved: {
		label: 'Disetujui',
		color: '#2E6B57',
		bg: '#D9EBE3',
		dot: '#39856A',
		description: 'Disetujui. Dokumen sedang disiapkan.'
	},
	completed: {
		label: 'Selesai',
		color: '#2E6B57',
		bg: '#D9EBE3',
		dot: '#39856A',
		description: 'Selesai dan siap diambil atau diunduh.'
	},
	rejected: {
		label: 'Dikembalikan',
		color: '#8E4444',
		bg: '#F3DEDE',
		dot: '#B85C5C',
		description: 'Dikembalikan dengan catatan perbaikan.'
	}
};

export const PIPELINE_STAGES = [
	{ key: 'received', label: 'Diterima', hint: 'Penerimaan oleh petugas' },
	{ key: 'verification', label: 'Verifikasi', hint: 'Pemeriksaan berkas dan identitas' },
	{ key: 'review', label: 'Pemeriksaan', hint: 'Unit yang bertanggung jawab' },
	{ key: 'decision', label: 'Keputusan', hint: 'Persetujuan dan tanda tangan' },
	{ key: 'issuance', label: 'Penerbitan', hint: 'Siap diambil' }
] as const;

export function statusToStageIndex(status: RequestStatus): number {
	switch (status) {
		case 'draft':
			return 0;
		case 'submitted':
			return 1;
		case 'under_review':
			return 2;
		case 'action_required':
			return 2;
		case 'approved':
			return 3;
		case 'completed':
			return 4;
		case 'rejected':
			return 2;
		default:
			return 1;
	}
}
