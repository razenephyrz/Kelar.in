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
	User
} from './types';

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
			.filter((r) => u?.role === 'admin' || r.ownerId === u?.id)
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
			role: 'citizen',
			createdAt: new Date().toISOString(),
			avatarColor: '#274C77'
		};
		users = [...users, user];
		setSession(user.id);
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
		targetDays: number;
	}) {
		const now = new Date();
		const target = new Date(now);
		target.setDate(target.getDate() + input.targetDays);
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
			metadata: input.metadata
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
		if (!item || !actor || (actor.role !== 'admin' && item.ownerId !== actor.id)) return false;
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
