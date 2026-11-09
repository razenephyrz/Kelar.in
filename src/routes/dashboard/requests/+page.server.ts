import type { PageServerLoad } from './$types';
import { listCitizenRequests } from '#lib/server/warga.ts';
import { requireAuthenticatedUser } from '#lib/server/warga.ts';
import type { RequestStatus } from '#lib/types';

export const load: PageServerLoad = async (event) => {
	const user = requireAuthenticatedUser(event);
	const requests = await listCitizenRequests(user.id);

	return {
		requests: requests.map((request) => ({
			...request,
			documentType: request.serviceName,
			status: request.status as RequestStatus,
			targetCompletionAt: new Date(request.targetCompletionAt).toISOString(),
			createdAt: new Date(request.createdAt).toISOString(),
			updatedAt: new Date(request.updatedAt).toISOString()
		}))
	};
};
