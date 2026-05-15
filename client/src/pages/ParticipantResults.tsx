import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Download,
  Plus,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { COMPETENCIES } from "../../../shared/competencies";

const SCORE_LABELS = ["", "Belum Berkembang", "Mulai Berkembang", "Cukup Kompeten", "Kompeten", "Sangat Kompeten"];

function ScoreBar({ score, max = 5, color }: { score: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${(score / max) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-bold w-4 text-right" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export default function ParticipantResults() {
  const params = useParams<{ participantId: string }>();
  const [, setLocation] = useLocation();
  const participantId = parseInt(params.participantId ?? "0");

  const { data: participant } = trpc.participants.getById.useQuery({ id: participantId });
  const { data: results, isLoading } = trpc.participants.results.useQuery({ participantId });

  if (isLoading || !participant) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="mt-3 text-muted-foreground text-sm">Memuat hasil penilaian...</p>
      </div>
    );
  }

  const selfScoreMap = Object.fromEntries(
    (results?.selfScores ?? []).map((s) => [s.competencyKey, s.score])
  );
  const obsScoreMap = Object.fromEntries(
    (results?.observationScores ?? []).map((s) => [s.competencyKey, s.score])
  );

  const radarData = COMPETENCIES.map((c) => ({
    subject: c.name.split(" ")[0], // short name for radar
    fullName: c.name,
    self: selfScoreMap[c.key] ?? 0,
    observasi: obsScoreMap[c.key] ?? 0,
  }));

  const selfAvg =
    results?.selfScores && results.selfScores.length > 0
      ? results.selfScores.reduce((sum, s) => sum + s.score, 0) / results.selfScores.length
      : null;
  const obsAvg =
    results?.observationScores && results.observationScores.length > 0
      ? results.observationScores.reduce((sum, s) => sum + s.score, 0) / results.observationScores.length
      : null;

  const hasSelf = !!results?.selfAssessment;
  const hasObs = !!results?.observationAssessment;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">Hasil Penilaian — {participant.fullName}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header card */}
        <div className="card-premium rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{participant.fullName.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{participant.fullName}</h1>
                <p className="text-muted-foreground text-sm">{participant.position} · {participant.department}</p>
                <p className="text-muted-foreground text-xs mt-0.5">Mentor: {participant.mentorName ?? "-"}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {!hasSelf && (
                <Button size="sm" onClick={() => setLocation(`/penilaian/${participantId}/self`)} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Self-Assessment
                </Button>
              )}
              {!hasObs && (
                <Button size="sm" variant="outline" onClick={() => setLocation(`/penilaian/${participantId}/observation`)} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Observasi Perilaku
                </Button>
              )}
            </div>
          </div>

          {/* Status badges */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${hasSelf ? "status-complete" : "status-pending"}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Self-Assessment: {hasSelf ? "Selesai" : "Belum Dilakukan"}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${hasObs ? "status-complete" : "status-pending"}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Observasi Perilaku: {hasObs ? "Selesai" : "Belum Dilakukan"}
            </span>
          </div>
        </div>

        {/* No data state */}
        {!hasSelf && !hasObs && (
          <div className="card-premium rounded-2xl p-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Belum Ada Data Penilaian</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Mulai penilaian kompetensi untuk melihat hasil dan analisis
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setLocation(`/penilaian/${participantId}/self`)}>
                Mulai Self-Assessment
              </Button>
              <Button variant="outline" onClick={() => setLocation(`/penilaian/${participantId}/observation`)}>
                Mulai Observasi Perilaku
              </Button>
            </div>
          </div>
        )}

        {(hasSelf || hasObs) && (
          <>
            {/* Average scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Rata-rata Self-Assessment", avg: selfAvg, color: "oklch(0.48 0.15 255)", done: hasSelf },
                { label: "Rata-rata Observasi Perilaku", avg: obsAvg, color: "oklch(0.65 0.18 30)", done: hasObs },
              ].map((item) => (
                <div key={item.label} className="card-premium rounded-2xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
                  {item.done && item.avg !== null ? (
                    <>
                      <p className="text-5xl font-bold" style={{ color: item.color }}>
                        {item.avg.toFixed(1)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">dari 5.0</p>
                      <p className="text-xs font-medium mt-2" style={{ color: item.color }}>
                        {SCORE_LABELS[Math.round(item.avg)]}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm py-4">Belum tersedia</p>
                  )}
                </div>
              ))}
            </div>

            {/* Radar chart */}
            {hasSelf && hasObs && (
              <div className="card-premium rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-6">
                  Radar Kompetensi — Perbandingan Self-Assessment vs Observasi Perilaku
                </h2>
                <ResponsiveContainer width="100%" height={380}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="oklch(0.85 0.01 250)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 12, fill: "oklch(0.40 0.03 250)", fontWeight: 600 }}
                    />
                    <Radar
                      name="Self-Assessment"
                      dataKey="self"
                      stroke="oklch(0.48 0.15 255)"
                      fill="oklch(0.48 0.15 255)"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      dot={{ r: 4, fill: "oklch(0.48 0.15 255)" }}
                    />
                    <Radar
                      name="Observasi Perilaku"
                      dataKey="observasi"
                      stroke="oklch(0.65 0.18 30)"
                      fill="oklch(0.65 0.18 30)"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      dot={{ r: 4, fill: "oklch(0.65 0.18 30)" }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ fontSize: 12, color: "oklch(0.35 0.03 250)", fontWeight: 500 }}>
                          {value}
                        </span>
                      )}
                    />
                    <Tooltip
                      formatter={(value, name) => [`${value}/5 — ${SCORE_LABELS[value as number]}`, name]}
                      contentStyle={{
                        borderRadius: "0.75rem",
                        border: "1px solid oklch(0.90 0.01 250)",
                        fontSize: 12,
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Detailed comparison & gap analysis */}
            <div className="card-premium rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Perbandingan Detail & Analisis Kesenjangan</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Kesenjangan = Skor Observasi − Skor Self-Assessment
                </p>
              </div>
              <div className="divide-y divide-border">
                {COMPETENCIES.map((comp) => {
                  const selfScore = selfScoreMap[comp.key];
                  const obsScore = obsScoreMap[comp.key];
                  const gap = selfScore && obsScore ? obsScore - selfScore : null;

                  return (
                    <div key={comp.key} className="px-6 py-5">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl">{comp.icon}</span>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">{comp.name}</h3>
                          <p className="text-xs text-muted-foreground">{comp.nameEn}</p>
                        </div>
                        {gap !== null && (
                          <div className={`ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg ${
                            gap > 0 ? "bg-emerald-50 text-emerald-700" : gap < 0 ? "bg-red-50 text-red-700" : "bg-muted text-muted-foreground"
                          }`}>
                            {gap > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : gap < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                            {gap > 0 ? `+${gap}` : gap} Kesenjangan
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Self-Assessment</span>
                            {selfScore ? (
                              <span className={`score-badge-${selfScore}`}>{SCORE_LABELS[selfScore]}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Belum dinilai</span>
                            )}
                          </div>
                          {selfScore ? (
                            <ScoreBar score={selfScore} color="oklch(0.48 0.15 255)" />
                          ) : (
                            <div className="h-2 bg-muted rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Observasi Perilaku</span>
                            {obsScore ? (
                              <span className={`score-badge-${obsScore}`}>{SCORE_LABELS[obsScore]}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Belum dinilai</span>
                            )}
                          </div>
                          {obsScore ? (
                            <ScoreBar score={obsScore} color="oklch(0.65 0.18 30)" />
                          ) : (
                            <div className="h-2 bg-muted rounded-full" />
                          )}
                        </div>
                      </div>

                      {/* Gap interpretation */}
                      {gap !== null && (
                        <div className={`mt-3 px-3 py-2 rounded-lg text-xs ${
                          gap > 1 ? "bg-emerald-50 text-emerald-800" :
                          gap < -1 ? "bg-red-50 text-red-800" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {gap > 1 && "✓ Mentor/Coach menilai lebih tinggi dari self-assessment. Peserta mungkin meremehkan kemampuannya sendiri."}
                          {gap < -1 && "⚠ Self-assessment lebih tinggi dari observasi. Perlu diskusi untuk menyelaraskan persepsi dan ekspektasi."}
                          {gap >= -1 && gap <= 1 && "≈ Penilaian diri dan observasi cukup selaras. Persepsi yang konsisten."}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overall gap summary */}
            {hasSelf && hasObs && selfAvg !== null && obsAvg !== null && (
              <div className="card-premium rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-4">Ringkasan Analisis Kesenjangan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Kompetensi Kekuatan",
                      desc: "Skor tertinggi",
                      comps: COMPETENCIES.filter((c) => {
                        const s = selfScoreMap[c.key] ?? 0;
                        const o = obsScoreMap[c.key] ?? 0;
                        return Math.max(s, o) >= 4;
                      }),
                      color: "text-emerald-700",
                      bg: "bg-emerald-50",
                    },
                    {
                      label: "Area Pengembangan",
                      desc: "Skor di bawah 3",
                      comps: COMPETENCIES.filter((c) => {
                        const s = selfScoreMap[c.key] ?? 5;
                        const o = obsScoreMap[c.key] ?? 5;
                        return Math.min(s, o) < 3;
                      }),
                      color: "text-red-700",
                      bg: "bg-red-50",
                    },
                    {
                      label: "Kesenjangan Besar",
                      desc: "Selisih > 1",
                      comps: COMPETENCIES.filter((c) => {
                        const s = selfScoreMap[c.key];
                        const o = obsScoreMap[c.key];
                        return s && o && Math.abs(o - s) > 1;
                      }),
                      color: "text-amber-700",
                      bg: "bg-amber-50",
                    },
                  ].map((section) => (
                    <div key={section.label} className={`rounded-xl p-4 ${section.bg}`}>
                      <h3 className={`font-semibold text-sm ${section.color} mb-2`}>{section.label}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{section.desc}</p>
                      {section.comps.length > 0 ? (
                        <ul className="space-y-1.5">
                          {section.comps.map((c) => (
                            <li key={c.key} className="flex items-center gap-2 text-xs font-medium text-foreground">
                              <span>{c.icon}</span> {c.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground">—</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
