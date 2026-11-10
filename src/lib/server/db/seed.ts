import { sql } from 'drizzle-orm';
import { db } from './index';
import { service, serviceApproval, serviceChecklist } from './schema';
import { citizenServices as services } from '../service-catalog';

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
