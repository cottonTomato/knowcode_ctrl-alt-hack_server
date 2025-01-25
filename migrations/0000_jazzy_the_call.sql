CREATE TABLE IF NOT EXISTS "user_contributions" (
	"user_id" varchar(255),
	"event_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"contributed_at" timestamp DEFAULT now(),
	CONSTRAINT "user_contributions_user_id_event_id_unique" UNIQUE("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_images" (
	"event_id" uuid,
	"image_url" varchar(200) NOT NULL,
	"alt_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" varchar(50) NOT NULL,
	"event_description" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"location_id" varchar(255) NOT NULL,
	"is_crowdfund" boolean DEFAULT false,
	"is_volunteer" boolean DEFAULT false,
	"fundraising_goal" numeric(10, 2) DEFAULT '0.0',
	"funds_raised" numeric(10, 2) DEFAULT '0.0',
	"volunteer_roles" smallint DEFAULT 0,
	"volunteer_count" smallint DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "friends" (
	"userId" varchar(255),
	"friendId" varchar(255),
	CONSTRAINT "friends_userId_friendId_unique" UNIQUE("userId","friendId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_account" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"firstname" varchar(20) NOT NULL,
	"lastname" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_contributions" ADD CONSTRAINT "user_contributions_user_id_user_account_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_contributions" ADD CONSTRAINT "user_contributions_event_id_event_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_event_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_userId_user_account_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user_account"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_friendId_user_account_user_id_fk" FOREIGN KEY ("friendId") REFERENCES "public"."user_account"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
