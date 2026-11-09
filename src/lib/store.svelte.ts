import {
	seedUsers,
	seedRequests,
	seedHistory,
	seedNotifications,
	seedProcedures,
	DEMO_PASSWORD
} from './data';
import { mockHash, verifyMock, uid, generateRequestId } from './utils';
import type {
	AdministrativeRequest,
	DocumentProcedure,
	Notification,
	RequestHistory,
	RequestStatus,
	User,
	Permission,
	Role
} from './types';
import { hasPermission } from './types';

const keys = {
	users: 'civicflow/users/v1',
	requests: 'civicflow/requests/v1',
	history: 'civicflow/history/v1',
	notifications: 'civicflow/notifications/v1',
	session: 'civicflow/session/v1'
};
const read = <T>(key: string, fallback: T): T => {
	if (typeof window === 'undefined') return fallback;
	try {
		return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
	} catch {
		return fallback;
	}
};
const save = (key: string, value: unknown) => {
	if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
};

let users = $state<User[]>(read(keys.users, seedUsers()));
let requests = $state<AdministrativeRequest[]>(read(keys.requests, seedRequests()));
let history = $state<RequestHistory[]>(read(keys.history, seedHistory()));
let notifications = $state<Notification[]>(read(keys.notifications, seedNotifications()));
const procedures = $state<DocumentProcedure[]>(seedProcedures());
let sessionId = $state<string | null>(
	read<{ userId: string } | null>(keys.session, null)?.userId ?? null
);
const persist = () => {
	save(keys.users, users);
	save(keys.requests, requests);
	save(keys.history, history);
	save(keys.notifications, notifications);
};
const setSession = (id: string | null) => {
	sessionId = id;
	save(keys.session, id ? { userId: id } : null);
};

export const civic = {
	get user() {
		return users.find((item) => item.id === sessionId) ?? null;
	},
	setAuthenticatedUser(input: {
		id: string;
		name: string;
		email: string;
		role?: string | null;
		createdAt?: string | Date;
	}) {
		const roleMap: Record<string, Role> = {
			warga: 'warga',
			pegawai: 'petugas',
			petugas: 'petugas',
			rtrw: 'rt_rw',
			rt_rw: 'rt_rw',
			lurah: 'lurah',
			super_admin: 'super_admin'
		};
		const authenticatedUser: User = {
			id: input.id,
			name: input.name,
			email: input.email,
			passwordHash: '',
			role: roleMap[input.role ?? 'warga'] ?? 'warga',
			createdAt: input.createdAt ? new Date(input.createdAt).toISOString() : new Date().toISOString(),
			avatarColor: '#274C77'
		};
		users = [...users.filter((item) => item.id !== authenticatedUser.id), authenticatedUser];
		setSession(authenticatedUser.id);
	},
	get users() {
		return users;
	},
	get requests() {
		return requests;
	},
	get history() {
		return history;
	},
	get notifications() {
		return notifications;
	},
	get procedures() {
		return procedures;
	},
	get myRequests() {
		const u = this.user;
		return requests
			.filter((r) => u?.role !== 'warga' || r.ownerId === u?.id)
			.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
	},
	get myNotifications() {
		const u = this.user;
		return notifications
			.filter((n) => n.recipientId === u?.id)
			.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
	},
	get unreadCount() {
		return this.myNotifications.filter((n) => !n.isRead).length;
	},
	login(email: string, password: string) {
		const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
		if (!user || !verifyMock(password, user.passwordHash))
			return { ok: false, error: 'Email or password is incorrect.' };
		setSession(user.id);
		return { ok: true };
	},
	register(input: { name: string; email: string; password: string }) {
		if (users.some((item) => item.email.toLowerCase() === input.email.trim().toLowerCase()))
			return { ok: false, error: 'An account with this email already exists.' };
		const user: User = {
			id: uid('u'),
			name: input.name.trim(),
			email: input.email.trim(),
			passwordHash: mockHash(input.password),
			role: 'warga',
			createdAt: new Date().toISOString(),
			avatarColor: '#274C77'
		};
		users = [...users, user];
		setSession(user.id);
		persist();
		return { ok: true };
	},
	updateProfile(input: { name: string; email: string }) {
		const user = this.user;
		const name = input.name.trim();
		const email = input.email.trim();
		if (!user || !name || !email) return { ok: false, error: 'Nama dan email wajib diisi.' };
		if (
			users.some(
				(item) => item.id !== user.id && item.email.toLowerCase() === email.toLowerCase()
			)
		)
			return { ok: false, error: 'Email tersebut sudah digunakan akun lain.' };
		users = users.map((item) => (item.id === user.id ? { ...item, name, email } : item));
		persist();
		return { ok: true };
	},
	changePassword(currentPassword: string, newPassword: string) {
		const user = this.user;
		if (!user || !verifyMock(currentPassword, user.passwordHash))
			return { ok: false, error: 'Password saat ini tidak sesuai.' };
		if (newPassword.trim().length < 8)
			return { ok: false, error: 'Password baru minimal 8 karakter.' };
		users = users.map((item) =>
			item.id === user.id ? { ...item, passwordHash: mockHash(newPassword) } : item
		);
		persist();
		return { ok: true };
	},
	logout() {
		setSession(null);
	},
	createRequest(input: {
		documentType: string;
		title: string;
		description: string;
		metadata: Record<string, string>;
		assignedDepartment: string;
		targetDays?: number;
	}) {
		const now = new Date();
		const target = new Date(now);
		const targetDays = input.targetDays ?? 7;
		target.setDate(target.getDate() + targetDays);
		target.setHours(17, 0, 0, 0);
		const owner = this.user;
		if (!owner) return null;
		const item: AdministrativeRequest = {
			id: generateRequestId(),
			ownerId: owner.id,
			documentType: input.documentType,
			title: input.title,
			description: input.description,
			status: 'submitted',
			createdAt: now.toISOString(),
			updatedAt: now.toISOString(),
			targetCompletionAt: target.toISOString(),
			assignedDepartment: input.assignedDepartment,
			requiredActions: [],
			metadata: input.metadata,
			requestedCompletionAt:
				input.targetDays === undefined ? undefined : target.toISOString()
		};
		requests = [item, ...requests];
		history = [
			{
				id: uid('h'),
				requestId: item.id,
				previousStatus: '—',
				newStatus: 'submitted',
				explanation: 'Request submitted. Received at front office intake.',
				actorId: owner.id,
				actorName: owner.name,
				actorRole: owner.role,
				timestamp: item.createdAt
			},
			...history
		];
		notifications = [
			{
				id: uid('n'),
				recipientId: owner.id,
				requestId: item.id,
				title: 'Request received',
				message: `${item.id} has been received by the front office.`,
				type: 'request_created',
				isRead: false,
				createdAt: item.createdAt
			},
			...notifications
		];
		persist();
		return item;
	},
	can(permission: Permission) {
		return hasPermission(this.user?.role, permission);
	},
	acceptRequest(id: string, explanation = 'Pengajuan diterima untuk diproses petugas.') {
		if (!this.can('request:accept')) return false;
		this.changeStatus(id, 'under_review', explanation);
		return true;
	},
	approveRequest(id: string, explanation = 'Pengajuan disetujui dan siap ditandatangani.') {
		if (!this.can('request:approve')) return false;
		this.changeStatus(id, 'approved', explanation);
		return true;
	},
	updateProcess(id: string, explanation: string, status: RequestStatus = 'under_review') {
		if (!this.can('request:update') || explanation.trim().length < 8) return false;
		this.changeStatus(id, status, explanation);
		return true;
	},
	createOfflineRequest(input: {
		ownerId: string;
		documentType: string;
		title: string;
		description: string;
		metadata?: Record<string, string>;
		targetDays?: number;
	}) {
		if (!this.can('request:create_offline')) return null;
		const owner = this.user;
		if (!owner) return null;
		const previousSession = sessionId;
		sessionId = input.ownerId;
		const request = this.createRequest({
			documentType: input.documentType,
			title: input.title,
			description: input.description,
			metadata: { ...input.metadata, source: 'offline' },
			assignedDepartment: 'Petugas Kelurahan',
			targetDays: input.targetDays
		});
		sessionId = previousSession;
		return request;
	},
	changeStatus(id: string, status: RequestStatus, explanation: string) {
		const item = requests.find((r) => r.id === id);
		const actor = this.user;
		if (!item || !actor || explanation.trim().length < 8) return;
		const previous = item.status;
		item.status = status;
		item.updatedAt = new Date().toISOString();
		const label = status.replace('_', ' ');
		const title =
			status === 'completed'
				? `Request ${item.id} completed`
				: status === 'action_required'
					? `Action needed on ${item.id}`
					: `Update on ${item.id}: ${label}`;
		history = [
			{
				id: uid('h'),
				requestId: id,
				previousStatus: previous,
				newStatus: status,
				explanation,
				actorId: actor.id,
				actorName: actor.name,
				actorRole: actor.role,
				timestamp: item.updatedAt
			},
			...history
		];
		notifications = [
			{
				id: uid('n'),
				recipientId: item.ownerId,
				requestId: id,
				title,
				message: explanation,
				type:
					status === 'completed'
						? 'completed'
						: status === 'action_required'
							? 'action_required'
							: 'status_change',
				isRead: false,
				createdAt: item.updatedAt
			},
			...notifications
		];
		persist();
	},
	resolveAction(id: string, note: string) {
		const item = requests.find((r) => r.id === id);
		if (!item || item.status !== 'action_required' || note.trim().length < 8) return;
		item.requiredActions = [];
		item.metadata = { ...item.metadata, resubmissionNote: note.trim() };
		this.changeStatus(id, 'under_review', 'Applicant resubmitted the requested information.');
	},
	deleteRequest(id: string) {
		const item = requests.find((r) => r.id === id);
		const actor = this.user;
		if (!item || !actor || (actor.role === 'warga' && item.ownerId !== actor.id)) return false;
		if (item.status === 'approved' || item.status === 'completed') return false;
		requests = requests.filter((request) => request.id !== id);
		history = history.filter((entry) => entry.requestId !== id);
		notifications = notifications.filter((notification) => notification.requestId !== id);
		persist();
		return true;
	},
	markRead(id: string) {
		notifications = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
		persist();
	},
	markAllRead() {
		notifications = notifications.map((n) =>
			n.recipientId === this.user?.id ? { ...n, isRead: true } : n
		);
		persist();
	},
	resetDemo() {
		users = seedUsers();
		requests = seedRequests();
		history = seedHistory();
		notifications = seedNotifications();
		setSession(null);
		persist();
	}
};
export { DEMO_PASSWORD };
