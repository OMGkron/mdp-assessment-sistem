CREATE TYPE "public"."assessment_type" AS ENUM('self', 'observation');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'completed');--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"participantId" integer NOT NULL,
	"assessmentType" "assessment_type" NOT NULL,
	"assessorName" varchar(128),
	"assessorRole" varchar(64),
	"period" varchar(32) DEFAULT '2026' NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competency_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessmentId" integer NOT NULL,
	"competencyKey" varchar(64) NOT NULL,
	"score" integer NOT NULL,
	"behavioralEvidence" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"participantCode" varchar(16) NOT NULL,
	"fullName" varchar(128) NOT NULL,
	"department" varchar(64) NOT NULL,
	"position" varchar(64) NOT NULL,
	"mentorName" varchar(128),
	"email" varchar(320),
	"joinDate" varchar(32),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "participants_participantCode_unique" UNIQUE("participantCode")
);
--> statement-breakpoint
CREATE TABLE "sbi_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessmentId" integer NOT NULL,
	"competencyKey" varchar(64) NOT NULL,
	"situation" text,
	"behavior" text,
	"impact" text,
	"actionPlan" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
