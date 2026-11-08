type LocalProfile = {
	userId: string;
	name: string;
	email: string;
	kind: 'warga' | 'pegawai' | 'rtrw';
	status: 'aktif' | 'pending' | 'ditolak';
	kelurahanId: string;
	rt: string;
	rw: string;
	nipd?: string;
	nikHash: string;
};

const profiles = new Map<string, LocalProfile>();
const roles = new Map<string, { role: string; status: string }>();

export function setLocalAccount(userId: string, role: string, status: string) {
	roles.set(userId, { role, status });
}

export function getLocalAccount(userId: string) {
	return roles.get(userId);
}

export function addLocalProfile(profile: LocalProfile) {
	profiles.set(profile.userId, profile);
}

export function removeLocalAccount(userId: string) {
	profiles.delete(userId);
	roles.delete(userId);
}

export function hasLocalNik(nikHash: string) {
	return [...profiles.values()].some((profile) => profile.nikHash === nikHash);
}

export function hasLocalNipd(nipd: string) {
	return [...profiles.values()].some((profile) => profile.nipd === nipd);
}

export function listLocalPending() {
	return [...profiles.values()]
		.filter((profile) => profile.status === 'pending')
		.map((profile) => ({
			id: profile.userId,
			name: profile.name,
			email: profile.email,
			role: roles.get(profile.userId)?.role ?? profile.kind,
			status: profile.status
		}));
}

export function updateLocalStatus(userId: string, status: 'aktif' | 'ditolak') {
	const profile = profiles.get(userId);
	if (profile) profile.status = status;
	const account = roles.get(userId);
	if (account) account.status = status;
}
