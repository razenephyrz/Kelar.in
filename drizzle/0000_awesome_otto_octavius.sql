CREATE TABLE `notification` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`recipient_id` varchar(36) NOT NULL,
	`request_id` varchar(32),
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(32) NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `request_checklist` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`request_id` varchar(32) NOT NULL,
	`label` varchar(255) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `request_checklist_id` PRIMARY KEY(`id`),
	CONSTRAINT `request_checklist_request_label_idx` UNIQUE(`request_id`,`label`)
);
--> statement-breakpoint
CREATE TABLE `request_history` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`request_id` varchar(32) NOT NULL,
	`previous_status` varchar(32),
	`new_status` varchar(32) NOT NULL,
	`explanation` text NOT NULL,
	`actor_id` varchar(36) NOT NULL,
	`actor_name` varchar(255) NOT NULL,
	`actor_role` varchar(32) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `request_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `request_rating` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`request_id` varchar(32) NOT NULL,
	`rater_id` varchar(36) NOT NULL,
	`target_role` varchar(32) NOT NULL,
	`score` int NOT NULL,
	`comment` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `request_rating_id` PRIMARY KEY(`id`),
	CONSTRAINT `request_rating_request_rater_role_idx` UNIQUE(`request_id`,`rater_id`,`target_role`)
);
--> statement-breakpoint
CREATE TABLE `service` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`processing_days` int NOT NULL,
	`processing_target` varchar(120) NOT NULL,
	`responsible_department` varchar(255) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_approval` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service_id` varchar(64) NOT NULL,
	`role` varchar(32) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `service_approval_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_approval_service_role_idx` UNIQUE(`service_id`,`role`)
);
--> statement-breakpoint
CREATE TABLE `service_checklist` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service_id` varchar(64) NOT NULL,
	`label` varchar(255) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`required` boolean NOT NULL DEFAULT true,
	CONSTRAINT `service_checklist_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_checklist_service_label_idx` UNIQUE(`service_id`,`label`)
);
--> statement-breakpoint
CREATE TABLE `service_request` (
	`id` varchar(32) NOT NULL,
	`owner_id` varchar(36) NOT NULL,
	`service_id` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'submitted',
	`target_completion_at` timestamp(3) NOT NULL,
	`assigned_department` varchar(255) NOT NULL,
	`delay_reason` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `service_request_id` PRIMARY KEY(`id`)
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
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
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
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_recipient_id_user_id_fk` FOREIGN KEY (`recipient_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_request_id_service_request_id_fk` FOREIGN KEY (`request_id`) REFERENCES `service_request`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `request_checklist` ADD CONSTRAINT `request_checklist_request_id_service_request_id_fk` FOREIGN KEY (`request_id`) REFERENCES `service_request`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `request_history` ADD CONSTRAINT `request_history_request_id_service_request_id_fk` FOREIGN KEY (`request_id`) REFERENCES `service_request`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `request_rating` ADD CONSTRAINT `request_rating_request_id_service_request_id_fk` FOREIGN KEY (`request_id`) REFERENCES `service_request`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `request_rating` ADD CONSTRAINT `request_rating_rater_id_user_id_fk` FOREIGN KEY (`rater_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_approval` ADD CONSTRAINT `service_approval_service_id_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_checklist` ADD CONSTRAINT `service_checklist_service_id_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_request` ADD CONSTRAINT `service_request_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_request` ADD CONSTRAINT `service_request_service_id_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `notification_recipient_idx` ON `notification` (`recipient_id`);--> statement-breakpoint
CREATE INDEX `request_checklist_request_idx` ON `request_checklist` (`request_id`);--> statement-breakpoint
CREATE INDEX `request_history_request_idx` ON `request_history` (`request_id`);--> statement-breakpoint
CREATE INDEX `service_active_idx` ON `service` (`active`);--> statement-breakpoint
CREATE INDEX `service_approval_service_idx` ON `service_approval` (`service_id`);--> statement-breakpoint
CREATE INDEX `service_checklist_service_idx` ON `service_checklist` (`service_id`);--> statement-breakpoint
CREATE INDEX `service_request_owner_idx` ON `service_request` (`owner_id`);--> statement-breakpoint
CREATE INDEX `service_request_status_idx` ON `service_request` (`status`);--> statement-breakpoint
CREATE INDEX `service_request_service_idx` ON `service_request` (`service_id`);--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);