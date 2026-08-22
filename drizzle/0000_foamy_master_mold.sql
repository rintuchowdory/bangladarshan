CREATE TABLE `bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` varchar(120) NOT NULL,
	`chapterId` int NOT NULL,
	`positionSeconds` int NOT NULL DEFAULT 0,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookmarks_userId_bookId_chapterId_position_unique` UNIQUE(`userId`,`bookId`,`chapterId`,`positionSeconds`)
);
--> statement-breakpoint
CREATE TABLE `listeningHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` varchar(120) NOT NULL,
	`chapterId` int NOT NULL DEFAULT 1,
	`progress` int NOT NULL DEFAULT 0,
	`lastListenedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `listeningHistory_id` PRIMARY KEY(`id`),
	CONSTRAINT `listeningHistory_userId_bookId_unique` UNIQUE(`userId`,`bookId`)
);
--> statement-breakpoint
CREATE TABLE `userFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userFavorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `userFavorites_userId_bookId_unique` UNIQUE(`userId`,`bookId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
