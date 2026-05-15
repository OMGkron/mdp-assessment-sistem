import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { aiRouter } from "./routers/ai";
import {
  getAllParticipants,
  getParticipantById,
  getAssessmentsByParticipant,
  getAssessmentById,
  createAssessment,
  completeAssessment,
  updateAssessmentNotes,
  getScoresByAssessment,
  upsertAllScores,
  getSbiFeedbackByAssessment,
  upsertSbiFeedback,
  getParticipantResults,
  getDashboardSummary,
  getAllAssessmentsWithScores,
} from "./db";
import { COMPETENCIES, COMPETENCY_MAP } from "../shared/competencies";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== PARTICIPANTS =====
  participants: router({
    list: publicProcedure.query(async () => {
      return getDashboardSummary();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getParticipantById(input.id);
      }),
    results: publicProcedure
      .input(z.object({ participantId: z.number() }))
      .query(async ({ input }) => {
        return getParticipantResults(input.participantId);
      }),
    create: publicProcedure
      .input(
        z.object({
          participantCode: z.string(),
          fullName: z.string(),
          department: z.string(),
          position: z.string(),
          mentorName: z.string().optional(),
          email: z.string().email().optional().or(z.literal("")),
          joinDate: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createParticipant } = await import("./db");
        const id = await createParticipant(input);
        return { id };
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            participantCode: z.string().optional(),
            fullName: z.string().optional(),
            department: z.string().optional(),
            position: z.string().optional(),
            mentorName: z.string().optional(),
            email: z.string().email().optional().or(z.literal("")),
            joinDate: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const { updateParticipant } = await import("./db");
        await updateParticipant(input.id, input.data);
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteParticipant } = await import("./db");
        await deleteParticipant(input.id);
        return { success: true };
      }),
  }),

  // ===== ASSESSMENTS =====
  assessments: router({
    listByParticipant: publicProcedure
      .input(z.object({ participantId: z.number() }))
      .query(async ({ input }) => {
        return getAssessmentsByParticipant(input.participantId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const assessment = await getAssessmentById(input.id);
        if (!assessment) return null;
        const scores = await getScoresByAssessment(input.id);
        const sbi = await getSbiFeedbackByAssessment(input.id);
        return { ...assessment, scores, sbiFeedback: sbi };
      }),

    create: publicProcedure
      .input(
        z.object({
          participantId: z.number(),
          assessmentType: z.enum(["self", "observation"]),
          assessorName: z.string().optional(),
          assessorRole: z.string().optional(),
          period: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createAssessment(input);
        return { id };
      }),

    saveScores: publicProcedure
      .input(
        z.object({
          assessmentId: z.number(),
          scores: z.array(
            z.object({
              competencyKey: z.string(),
              score: z.number().min(1).max(5),
              behavioralEvidence: z.string().optional(),
            })
          ),
          notes: z.string().optional(),
          complete: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertAllScores(input.assessmentId, input.scores);
        if (input.notes !== undefined) {
          await updateAssessmentNotes(input.assessmentId, input.notes);
        }
        if (input.complete) {
          await completeAssessment(input.assessmentId);
        }
        return { success: true };
      }),

    saveSbiFeedback: publicProcedure
      .input(
        z.object({
          assessmentId: z.number(),
          competencyKey: z.string(),
          situation: z.string().optional(),
          behavior: z.string().optional(),
          impact: z.string().optional(),
          actionPlan: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertSbiFeedback(input);
        return { success: true };
      }),

    complete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await completeAssessment(input.id);
        return { success: true };
      }),
  }),

  // ===== COMPETENCIES =====
  competencies: router({
    list: publicProcedure.query(() => COMPETENCIES),
    getByKey: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => COMPETENCY_MAP[input.key] ?? null),
  }),

  // ===== AI CHATBOT =====
  chat: aiRouter,

  // ===== EXPORT =====
  export: router({
    allData: publicProcedure.query(async () => {
      return getAllAssessmentsWithScores();
    }),
  }),
});

export type AppRouter = typeof appRouter;
