import { mysqlTable, serial, int, text, varchar, timestamp, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const task = mysqlTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: int('priority').notNull().default(1)
});

export const profilWarga = mysqlTable(
	'profil_warga',
	{
		id: varchar('id', { length: 36 }).primaryKey(),
		userId: varchar('user_id', { length: 36 }).notNull().unique(),
		nikHash: varchar('nik_hash', { length: 64 }).notNull().unique(),
		nikEncrypted: text('nik_encrypted').notNull(),
		phone: varchar('phone', { length: 16 }),
		kelurahanId: varchar('kelurahan_id', { length: 64 }).notNull(),
		rt: varchar('rt', { length: 3 }).notNull(),
		rw: varchar('rw', { length: 3 }).notNull(),
		createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull()
	},
	(table) => [index('profil_warga_kelurahan_idx').on(table.kelurahanId)]
);

export const profilPegawai = mysqlTable('profil_pegawai', {
	id: varchar('id', { length: 36 }).primaryKey(),
	userId: varchar('user_id', { length: 36 }).notNull().unique(),
	nipd: varchar('nipd', { length: 32 }).notNull().unique(),
	nikHash: varchar('nik_hash', { length: 64 }).notNull().unique(),
	nikEncrypted: text('nik_encrypted').notNull(),
	phone: varchar('phone', { length: 16 }),
	kelurahanId: varchar('kelurahan_id', { length: 64 }).notNull(),
	createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull()
});

export const profilRtrw = mysqlTable('profil_rtrw', {
	id: varchar('id', { length: 36 }).primaryKey(),
	userId: varchar('user_id', { length: 36 }).notNull().unique(),
	nipd: varchar('nipd', { length: 32 }).notNull().unique(),
	nikHash: varchar('nik_hash', { length: 64 }).notNull().unique(),
	nikEncrypted: text('nik_encrypted').notNull(),
	phone: varchar('phone', { length: 16 }),
	kelurahanId: varchar('kelurahan_id', { length: 64 }).notNull(),
	rt: varchar('rt', { length: 3 }).notNull(),
	rw: varchar('rw', { length: 3 }).notNull(),
	createdAt: timestamp('created_at', { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull()
});

export * from './auth.schema.ts';
