import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { invokeLLM } from "../lib/llm";
import { getParticipantById } from "../db";
import { COMPETENCIES, COMPETENCY_MAP } from "../../shared/competencies";

export const aiRouter = router({
    message: publicProcedure
        .input(z.object({
            messages: z.array(z.object({
                role: z.enum(["system", "user", "assistant"]),
                content: z.string()
            })),
            participantId: z.number().optional(),
            assessmentType: z.enum(["self", "observation"]).optional(),
            currentCompetency: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            const participant = input.participantId
                ? await getParticipantById(input.participantId)
                : null;

            const competencyContext = COMPETENCIES.map(
                (c) =>
                    `- ${c.name}: ${c.description}\n  Level 1: ${c.indicators[0].description}\n  Level 3: ${c.indicators[2].description}\n  Level 5: ${c.indicators[4].description}`
            ).join("\n");

            const systemPrompt = `Kamu adalah Asisten Penilaian Kompetensi MDP (Management Development Program) yang membantu proses penilaian kompetensi karyawan. 

PERAN KAMU:
Memandu penilai (mentor/coach atau peserta sendiri) melalui proses penilaian kompetensi secara sistematis menggunakan kerangka SBI (Situasi-Perilaku-Dampak).

KONTEKS PROGRAM:
- Program: Management Development Program (MDP)
- Durasi: 12 bulan (2026)
- Jumlah peserta: 20 orang
${participant ? `- Peserta yang sedang dinilai: ${participant.fullName} (${participant.position}, ${participant.department})` : ""}
${input.assessmentType ? `- Jenis penilaian: ${input.assessmentType === "self" ? "Self-Assessment (Penilaian Diri)" : "Observasi Perilaku (oleh Mentor/Coach)"}` : ""}
${input.currentCompetency ? `- Kompetensi yang sedang dinilai: ${COMPETENCY_MAP[input.currentCompetency]?.name ?? input.currentCompetency}` : ""}

6 KOMPETENSI INTI:
${competencyContext}

SKALA PENILAIAN:
1 = Belum Berkembang: Belum menunjukkan kompetensi yang diharapkan
2 = Mulai Berkembang: Menunjukkan tanda-tanda awal pengembangan kompetensi
3 = Cukup Kompeten: Memenuhi ekspektasi standar untuk posisi saat ini
4 = Kompeten: Melebihi ekspektasi dan menunjukkan kompetensi yang kuat
5 = Sangat Kompeten: Menjadi teladan dan pemimpin dalam kompetensi ini

KERANGKA SBI (Situasi-Perilaku-Dampak):
- Situasi: Konteks spesifik di mana perilaku terjadi
- Perilaku: Tindakan konkret yang dapat diamati
- Dampak: Hasil atau pengaruh dari perilaku tersebut

PANDUAN PERCAKAPAN:
1. Selalu gunakan Bahasa Indonesia yang formal namun ramah
2. Tanyakan pertanyaan yang spesifik dan berbasis bukti perilaku
3. Bantu penilai memberikan contoh konkret menggunakan kerangka SBI
4. Berikan panduan tentang cara membedakan level 1-5 untuk setiap kompetensi
5. Jika penilai ragu, berikan contoh perilaku yang khas untuk setiap level
6. Dorong penilai untuk berpikir tentang situasi nyata yang pernah diamati
7. Ringkas penilaian di akhir setiap kompetensi

BATASAN:
- Hanya membahas topik yang berkaitan dengan penilaian kompetensi MDP
- Tidak memberikan skor secara langsung; bantu penilai sampai pada kesimpulan sendiri
- Selalu minta bukti perilaku konkret sebelum menyimpulkan level kompetensi`;

            const response = await invokeLLM([
                { role: "system", content: systemPrompt },
                ...input.messages.map((m) => ({ role: m.role, content: m.content })),
            ]);

            return { content: response };
        }),
});