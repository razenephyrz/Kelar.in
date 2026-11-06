import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	int,
	mysqlTable,
	serial,
	text,
	timestamp,
	varchar,
	index,
	uniqueIndex
} from 'drizzle-orm/mysql-core';
import { user } from './auth.schema';

export const task = mysqlTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: int('priority').notNull().default(1)
});

export const service = mysqlTable(
	'service',
	{
		id: varchar('id', { length: 64 }).primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		category: varchar('category', { length: 120 }).notNull(),
		description: text('description').notNull(),
		processingDays: int('processing_days').notNull(),
		processingTarget: varchar('processing_target', { length: 120 }).notNull(),
		responsibleDepartment: varchar('responsible_department', { length: 255 }).notNull(),
		active: boolean('active').default(true).notNull(),
		createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
		updatedAt: timestamp('updated_at', { fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('service_active_idx').on(table.active)]
);

export const serviceChecklist = mysqlTable(
	'service_checklist',
	{
		id: serial('id').primaryKey(),
		serviceId: varchar('service_id', { length: 64 })
			.notNull()
			.references(() => service.id, { onDelete: 'cascade' }),
		label: varchar('label', { length: 255 }).notNull(),
		position: int('position').notNull().default(0),
		required: boolean('required').default(true).notNull()
	},
	(table) => [
		index('service_checklist_service_idx').on(table.serviceId),
		uniqueIndex('service_checklist_service_label_idx').on(table.serviceId, table.label)
	]
);

export const serviceApproval = mysqlTable(
	'service_approval',
	{
		id: serial('id').primaryKey(),
		serviceId: varchar('service_id', { length: 64 })
			.notNull()
			.references(() => service.id, { onDelete: 'cascade' }),
		role: varchar('role', { length: 32 }).notNull(),
		position: int('position').notNull().default(0)
	},
	(table) => [
		index('service_approval_service_idx').on(table.serviceId),
		uniqueIndex('service_approval_service_role_idx').on(table.serviceId, table.role)
	]
);

export const serviceRequest = mysqlTable(
	'service_request',
	{
		id: varchar('id', { length: 32 }).primaryKey(),
		ownerId: varchar('owner_id', { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		serviceId: varchar('service_id', { length: 64 })
			.notNull()
			.references(() => service.id),
		title: varchar('title', { length: 255 }).notNull(),
		description: text('description').notNull(),
		status: varchar('status', { length: 32 }).notNull().default('submitted'),
		targetCompletionAt: timestamp('target_completion_at', { fsp: 3 }).notNull(),
		assignedDepartment: varchar('assigned_department', { length: 255 }).notNull(),
		delayReason: text('delay_reason'),
		createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
		updatedAt: timestamp('updated_at', { fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index('service_request_owner_idx').on(table.ownerId),
		index('service_request_status_idx').on(table.status),
		index('service_request_service_idx').on(table.serviceId)
	]
);

export const requestChecklist = mysqlTable(
	'request_checklist',
	{
		id: serial('id').primaryKey(),
		requestId: varchar('request_id', { length: 32 })
			.notNull()
			.references(() => serviceRequest.id, { onDelete: 'cascade' }),
		label: varchar('label', { length: 255 }).notNull(),
		completed: boolean('completed').default(false).notNull(),
		position: int('position').notNull().default(0)
	},
	(table) => [
		index('request_checklist_request_idx').on(table.requestId),
		uniqueIndex('request_checklist_request_label_idx').on(table.requestId, table.label)
	]
);

export const requestHistory = mysqlTable(
	'request_history',
	{
		id: serial('id').primaryKey(),
		requestId: varchar('request_id', { length: 32 })
			.notNull()
			.references(() => serviceRequest.id, { onDelete: 'cascade' }),
		previousStatus: varchar('previous_status', { length: 32 }),
		newStatus: varchar('new_status', { length: 32 }).notNull(),
		explanation: text('explanation').notNull(),
		actorId: varchar('actor_id', { length: 36 }).notNull(),
		actorName: varchar('actor_name', { length: 255 }).notNull(),
		actorRole: varchar('actor_role', { length: 32 }).notNull(),
		createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull()
	},
	(table) => [index('request_history_request_idx').on(table.requestId)]
);

export const notification = mysqlTable(
	'notification',
	{
		id: serial('id').primaryKey(),
		recipientId: varchar('recipient_id', { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		requestId: varchar('request_id', { length: 32 }).references(() => serviceRequest.id, {
			onDelete: 'set null'
		}),
		title: varchar('title', { length: 255 }).notNull(),
		message: text('message').notNull(),
		type: varchar('type', { length: 32 }).notNull(),
		isRead: boolean('is_read').default(false).notNull(),
		createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull()
	},
	(table) => [index('notification_recipient_idx').on(table.recipientId)]
);

export const requestRating = mysqlTable(
	'request_rating',
	{
		id: serial('id').primaryKey(),
		requestId: varchar('request_id', { length: 32 })
			.notNull()
			.references(() => serviceRequest.id, { onDelete: 'cascade' }),
		raterId: varchar('rater_id', { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		targetRole: varchar('target_role', { length: 32 }).notNull(),
		score: int('score').notNull(),
		comment: text('comment'),
		createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull()
	},
	(table) => [
		uniqueIndex('request_rating_request_rater_role_idx').on(
			table.requestId,
			table.raterId,
			table.targetRole
		)
	]
);

export const serviceRelations = relations(service, ({ many }) => ({
	checklist: many(serviceChecklist),
	approvals: many(serviceApproval),
	requests: many(serviceRequest)
}));

export const serviceRequestRelations = relations(serviceRequest, ({ one, many }) => ({
	owner: one(user, { fields: [serviceRequest.ownerId], references: [user.id] }),
	service: one(service, { fields: [serviceRequest.serviceId], references: [service.id] }),
	checklist: many(requestChecklist),
	history: many(requestHistory),
	notifications: many(notification),
	ratings: many(requestRating)
}));

export * from './auth.schema';
