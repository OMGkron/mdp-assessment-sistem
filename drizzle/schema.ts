import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const assessmentTypeEnum = pgEnum("assessment_type", ["self", "observation"]);
export const statusEnum = pgEnum("status", ["draft", "completed"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Peserta MDP
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  participantCode: varchar("participantCode", { length: 16 }).notNull().unique(),
  fullName: varchar("fullName", { length: 128 }).notNull(),
  department: varchar("department", { length: 64 }).notNull(),
  position: varchar("position", { length: 64 }).notNull(),
  mentorName: varchar("mentorName", { length: 128 }),
  email: varchar("email", { length: 320 }),
  joinDate: varchar("joinDate", { length: 32 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = typeof participants.$inferInsert;

// Sesi penilaian (self-assessment atau observasi perilaku)
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  participantId: integer("participantId").notNull(),
  assessmentType: assessmentTypeEnum("assessmentType").notNull(),
  assessorName: varchar("assessorName", { length: 128 }), // null = self
  assessorRole: varchar("assessorRole", { length: 64 }), // Mentor, Coach, etc.
  period: varchar("period", { length: 32 }).notNull().default("2026"), // e.g. "2026-Q1"
  status: statusEnum("status").default("draft").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

// Skor per kompetensi dalam sebuah sesi penilaian
export const competencyScores = pgTable("competency_scores", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessmentId").notNull(),
  competencyKey: varchar("competencyKey", { length: 64 }).notNull(),
  // e.g. "strategic_thinking", "leadership", "communication", etc.
  score: integer("score").notNull(), // 1-5
  behavioralEvidence: text("behavioralEvidence"), // SBI notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompetencyScore = typeof competencyScores.$inferSelect;
export type InsertCompetencyScore = typeof competencyScores.$inferInsert;

// Catatan SBI (Situation-Behavior-Impact) per penilaian
export const sbiFeedback = pgTable("sbi_feedback", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessmentId").notNull(),
  competencyKey: varchar("competencyKey", { length: 64 }).notNull(),
  situation: text("situation"),
  behavior: text("behavior"),
  impact: text("impact"),
  actionPlan: text("actionPlan"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SbiFeedback = typeof sbiFeedback.$inferSelect;
export type InsertSbiFeedback = typeof sbiFeedback.$inferInsert;
