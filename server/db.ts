import { eq, and, desc } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  InsertUser,
  users,
  participants,
  assessments,
  competencyScores,
  sbiFeedback,
  type Participant,
  type Assessment,
  type CompetencyScore,
  type SbiFeedback,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    
    await db.insert(users).values(values).onConflictDoUpdate({ 
      target: users.openId, 
      set: updateSet 
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== PARTICIPANTS =====
export async function getAllParticipants(): Promise<Participant[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(participants).orderBy(participants.participantCode);
}

export async function getParticipantById(id: number): Promise<Participant | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(participants).where(eq(participants.id, id)).limit(1);
  return result[0];
}

export async function createParticipant(data: any): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(participants).values({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning({ insertedId: participants.id });
  return result[0]?.insertedId ?? 0;
}

export async function updateParticipant(id: number, data: any): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(participants).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(participants.id, id));
}

export async function deleteParticipant(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Hard delete as per user request to "menghapus"
  await db.delete(participants).where(eq(participants.id, id));
}

// ===== ASSESSMENTS =====
export async function getAssessmentsByParticipant(participantId: number): Promise<Assessment[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(assessments)
    .where(eq(assessments.participantId, participantId))
    .orderBy(desc(assessments.createdAt));
}

export async function getAssessmentById(id: number): Promise<Assessment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result[0];
}

export async function createAssessment(data: {
  participantId: number;
  assessmentType: "self" | "observation";
  assessorName?: string;
  assessorRole?: string;
  period?: string;
  notes?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(assessments).values({
    participantId: data.participantId,
    assessmentType: data.assessmentType,
    assessorName: data.assessorName,
    assessorRole: data.assessorRole,
    period: data.period ?? "2026",
    notes: data.notes,
    status: "draft",
  }).returning({ insertedId: assessments.id });
  return result[0]?.insertedId ?? 0;
}

export async function completeAssessment(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(assessments).set({ status: "completed" }).where(eq(assessments.id, id));
}

export async function updateAssessmentNotes(id: number, notes: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(assessments).set({ notes }).where(eq(assessments.id, id));
}

// ===== COMPETENCY SCORES =====
export async function getScoresByAssessment(assessmentId: number): Promise<CompetencyScore[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(competencyScores)
    .where(eq(competencyScores.assessmentId, assessmentId));
}

export async function upsertCompetencyScore(data: {
  assessmentId: number;
  competencyKey: string;
  score: number;
  behavioralEvidence?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete existing then insert
  await db
    .delete(competencyScores)
    .where(
      and(
        eq(competencyScores.assessmentId, data.assessmentId),
        eq(competencyScores.competencyKey, data.competencyKey)
      )
    );
  await db.insert(competencyScores).values({
    assessmentId: data.assessmentId,
    competencyKey: data.competencyKey,
    score: data.score,
    behavioralEvidence: data.behavioralEvidence,
  });
}

export async function upsertAllScores(
  assessmentId: number,
  scores: { competencyKey: string; score: number; behavioralEvidence?: string }[]
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(competencyScores).where(eq(competencyScores.assessmentId, assessmentId));
  if (scores.length > 0) {
    await db.insert(competencyScores).values(
      scores.map((s) => ({
        assessmentId,
        competencyKey: s.competencyKey,
        score: s.score,
        behavioralEvidence: s.behavioralEvidence,
      }))
    );
  }
}

// ===== SBI FEEDBACK =====
export async function getSbiFeedbackByAssessment(assessmentId: number): Promise<SbiFeedback[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sbiFeedback).where(eq(sbiFeedback.assessmentId, assessmentId));
}

export async function upsertSbiFeedback(data: {
  assessmentId: number;
  competencyKey: string;
  situation?: string;
  behavior?: string;
  impact?: string;
  actionPlan?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .delete(sbiFeedback)
    .where(
      and(
        eq(sbiFeedback.assessmentId, data.assessmentId),
        eq(sbiFeedback.competencyKey, data.competencyKey)
      )
    );
  await db.insert(sbiFeedback).values(data);
}

// ===== AGGREGATED RESULTS =====
export async function getParticipantResults(participantId: number) {
  const allAssessments = await getAssessmentsByParticipant(participantId);
  const selfAssessment = allAssessments.find(
    (a) => a.assessmentType === "self" && a.status === "completed"
  );
  const observationAssessment = allAssessments.find(
    (a) => a.assessmentType === "observation" && a.status === "completed"
  );

  const selfScores = selfAssessment ? await getScoresByAssessment(selfAssessment.id) : [];
  const observationScores = observationAssessment
    ? await getScoresByAssessment(observationAssessment.id)
    : [];

  return {
    selfAssessment,
    observationAssessment,
    selfScores,
    observationScores,
  };
}

// ===== DASHBOARD SUMMARY =====
export async function getDashboardSummary() {
  const allParticipants = await getAllParticipants();
  const db = await getDb();
  if (!db) return allParticipants.map((p) => ({ ...p, selfDone: false, observationDone: false, avgScore: null }));

  const allAssessments = await db
    .select()
    .from(assessments)
    .where(eq(assessments.status, "completed"));

  return allParticipants.map((p) => {
    const pAssessments = allAssessments.filter((a) => a.participantId === p.id);
    const selfDone = pAssessments.some((a) => a.assessmentType === "self");
    const observationDone = pAssessments.some((a) => a.assessmentType === "observation");
    return { ...p, selfDone, observationDone };
  });
}

// ===== EXPORT DATA =====
export async function getAllAssessmentsWithScores() {
  const db = await getDb();
  if (!db) return [];
  const allParticipants = await getAllParticipants();
  const allAssessments = await db.select().from(assessments).orderBy(assessments.participantId);
  const allScores = await db.select().from(competencyScores);

  return allParticipants.map((p) => {
    const pAssessments = allAssessments.filter((a) => a.participantId === p.id);
    return {
      participant: p,
      assessments: pAssessments.map((a) => ({
        ...a,
        scores: allScores.filter((s) => s.assessmentId === a.id),
      })),
    };
  });
}
