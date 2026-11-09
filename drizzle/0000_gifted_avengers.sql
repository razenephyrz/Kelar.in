CREATE TABLE `profil_pegawai` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`nipd` varchar(32) NOT NULL,
	`nik_hash` varchar(64) NOT NULL,
	`nik_encrypted` text NOT NULL,
	`phone` varchar(16),
	`kelurahan_id` varchar(64) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `profil_pegawai_id` PRIMARY KEY(`id`),
	CONSTRAINT `profil_pegawai_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `profil_pegawai_nipd_unique` UNIQUE(`nipd`),
	CONSTRAINT `profil_pegawai_nik_hash_unique` UNIQUE(`nik_hash`)
);
--> statement-breakpoint
CREATE TABLE `profil_rtrw` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`nipd` varchar(32),
	`nik_hash` varchar(64) NOT NULL,
	`nik_encrypted` text NOT NULL,
	`phone` varchar(16),
	`kelurahan_id` varchar(64) NOT NULL,
	`rt` varchar(3) NOT NULL,
	`rw` varchar(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `profil_rtrw_id` PRIMARY KEY(`id`),
	CONSTRAINT `profil_rtrw_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `profil_rtrw_nipd_unique` UNIQUE(`nipd`),
	CONSTRAINT `profil_rtrw_nik_hash_unique` UNIQUE(`nik_hash`)
);
--> statement-breakpoint
CREATE TABLE `profil_warga` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`nik_hash` varchar(64) NOT NULL,
	`nik_encrypted` text NOT NULL,
	`phone` varchar(16),
	`kelurahan_id` varchar(64) NOT NULL,
	`rt` varchar(3) NOT NULL,
	`rw` varchar(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `profil_warga_id` PRIMARY KEY(`id`),
	CONSTRAINT `profil_warga_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `profil_warga_nik_hash_unique` UNIQUE(`nik_hash`)
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`priority` int NOT NULL DEFAULT 1,
	CONSTRAINT `task_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`username` varchar(255),
	`display_username` text,
	`role` varchar(16) NOT NULL DEFAULT 'warga',
	`status` varchar(16) NOT NULL DEFAULT 'aktif',
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `profil_warga_kelurahan_idx` ON `profil_warga` (`kelurahan_id`);--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);