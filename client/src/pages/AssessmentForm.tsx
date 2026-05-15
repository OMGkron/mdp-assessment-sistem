import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Save,
  User,
  Users,
} from "lucide-react";
import { COMPETENCIES } from "../../../shared/competencies";

const SCORE_LABELS = ["", "Belum Berkembang", "Mulai Berkembang", "Cukup Kompeten", "Kompeten", "Sangat Kompeten"];
const SCORE_COLORS = [
  "",
  "border-red-300 bg-red-50 text-red-700",
  "border-orange-300 bg-orange-50 text-orange-700",
  "border-yellow-300 bg-yellow-50 text-yellow-700",
  "border-emerald-300 bg-emerald-50 text-emerald-700",
  "border-blue-300 bg-blue-50 text-blue-700",
];
const SCORE_ACTIVE = [
  "",
  "border-red-500 bg-red-500 text-white shadow-lg scale-105",
  "border-orange-500 bg-orange-500 text-white shadow-lg scale-105",
  "border-yellow-500 bg-yellow-500 text-white shadow-lg scale-105",
  "border-emerald-500 bg-emerald-500 text-white shadow-lg scale-105",
  "border-blue-600 bg-blue-600 text-white shadow-lg scale-105",
];

export default function AssessmentForm() {
  const params = useParams<{ participantId: string; type: string }>();
  const [, setLocation] = useLocation();
  const participantId = parseInt(params.participantId ?? "0");
  const assessmentType = (params.type === "observation" ? "observation" : "self") as "self" | "observation";

  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-6 = competencies, 7 = review
  const [scores, setScores] = useState<Record<string, number>>({});
  const [evidences, setEvidences] = useState<Record<string, string>>({});
  const [sbiData, setSbiData] = useState<Record<string, { situation: string; behavior: string; impact: string; actionPlan: string }>>({});
  const [assessorName, setAssessorName] = useState("");
  const [assessorRole, setAssessorRole] = useState("");
  const [notes, setNotes] = useState("");
  const [showGuide, setShowGuide] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: participant } = trpc.participants.getById.useQuery({ id: participantId });
  const { data: existingAssessments } = trpc.assessments.listByParticipant.useQuery({ participantId });

  const createAssessment = trpc.assessments.create.useMutation();
  const saveScores = trpc.assessments.saveScores.useMutation();
  const saveSbi = trpc.assessments.saveSbiFeedback.useMutation();

  // Check if assessment already exists
  useEffect(() => {
    if (existingAssessments) {
      const existing = existingAssessments.find(
        (a) => a.assessmentType === assessmentType && a.status === "draft"
      );
      if (existing) setAssessmentId(existing.id);
    }
  }, [existingAssessments, assessmentType]);

  const handleStart = async () => {
    if (assessmentType === "observation" && !assessorName.trim()) {
      toast.error("Nama penilai wajib diisi untuk Observasi Perilaku");
      return;
    }
    try {
      let id = assessmentId;
      if (!id) {
        const result = await createAssessment.mutateAsync({
          participantId,
          assessmentType,
          assessorName: assessmentType === "observation" ? assessorName : participant?.fullName,
          assessorRole: assessmentType === "observation" ? assessorRole : "Peserta",
          period: "2026",
        });
        id = result.id;
        setAssessmentId(id);
      }
      setCurrentStep(1);
    } catch {
      toast.error("Gagal memulai penilaian. Silakan coba lagi.");
    }
  };

  const handleSaveProgress = async () => {
    if (!assessmentId) return;
    try {
      await saveScores.mutateAsync({
        assessmentId,
        scores: Object.entries(scores).map(([key, score]) => ({
          competencyKey: key,
          score,
          behavioralEvidence: evidences[key],
        })),
        notes,
      });
      toast.success("Progress tersimpan");
    } catch {
      toast.error("Gagal menyimpan progress");
    }
  };

  const handleSubmit = async () => {
    const allScored = COMPETENCIES.every((c) => scores[c.key] !== undefined);
    if (!allScored) {
      toast.error("Harap isi semua penilaian kompetensi terlebih dahulu");
      return;
    }
    setIsSubmitting(true);
    try {
      await saveScores.mutateAsync({
        assessmentId: assessmentId!,
        scores: Object.entries(scores).map(([key, score]) => ({
          competencyKey: key,
          score,
          behavioralEvidence: evidences[key],
        })),
        notes,
        complete: true,
      });
      // Save SBI feedback
      for (const [key, sbi] of Object.entries(sbiData)) {
        if (sbi.situation || sbi.behavior || sbi.impact) {
          await saveSbi.mutateAsync({
            assessmentId: assessmentId!,
            competencyKey: key,
            ...sbi,
          });
        }
      }
      toast.success("Penilaian berhasil disimpan!");
      setLocation(`/hasil/${participantId}`);
    } catch {
      toast.error("Gagal menyimpan penilaian");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGuide = (idx: number) => {
    setShowGuide((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const totalSteps = COMPETENCIES.length + 1; // +1 for review
  const progress = currentStep === 0 ? 0 : Math.round((currentStep / totalSteps) * 100);

  if (!participant) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">
            {assessmentType === "self" ? "Self-Assessment" : "Observasi Perilaku"} — {participant.fullName}
          </span>
        </div>
        {currentStep > 0 && currentStep <= COMPETENCIES.length && (
          <Button variant="outline" size="sm" onClick={handleSaveProgress} className="gap-2">
            <Save className="h-3.5 w-3.5" />
            Simpan Draft
          </Button>
        )}
      </div>

      {/* Progress bar */}
      {currentStep > 0 && (
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 0: Intro */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                assessmentType === "self" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
              }`}>
                {assessmentType === "self" ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                {assessmentType === "self" ? "Self-Assessment (Penilaian Diri)" : "Observasi Perilaku"}
              </div>
              <h1 className="text-2xl font-bold text-foreground">Penilaian Kompetensi MDP</h1>
              <p className="text-muted-foreground">
                Penilaian untuk <strong>{participant.fullName}</strong> — {participant.position}, {participant.department}
              </p>
            </div>

            <div className="card-premium rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Informasi Penilaian</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Peserta</p>
                  <p className="font-medium">{participant.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Departemen</p>
                  <p className="font-medium">{participant.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Posisi</p>
                  <p className="font-medium">{participant.position}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Periode</p>
                  <p className="font-medium">2026</p>
                </div>
              </div>

              {assessmentType === "observation" && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <h3 className="font-medium text-sm">Data Penilai</h3>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Nama Penilai *</label>
                    <input
                      type="text"
                      value={assessorName}
                      onChange={(e) => setAssessorName(e.target.value)}
                      placeholder="Nama mentor/coach"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Peran Penilai</label>
                    <input
                      type="text"
                      value={assessorRole}
                      onChange={(e) => setAssessorRole(e.target.value)}
                      placeholder="Mentor / Coach / Atasan Langsung"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="card-premium rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Panduan Pengisian</h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>• Anda akan menilai <strong>6 kompetensi inti</strong> menggunakan skala 1–5</li>
                    <li>• Setiap kompetensi dilengkapi <strong>panduan perilaku</strong> untuk setiap level</li>
                    <li>• Berikan <strong>bukti perilaku konkret</strong> menggunakan kerangka SBI (Situasi-Perilaku-Dampak)</li>
                    <li>• Penilaian dapat disimpan sebagai draft dan dilanjutkan kapan saja</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button onClick={handleStart} className="w-full h-12 text-base font-semibold" disabled={createAssessment.isPending}>
              {createAssessment.isPending ? "Memulai..." : "Mulai Penilaian →"}
            </Button>
          </div>
        )}

        {/* Steps 1-6: Competency Assessment */}
        {currentStep >= 1 && currentStep <= COMPETENCIES.length && (() => {
          const comp = COMPETENCIES[currentStep - 1];
          if (!comp) return null;
          const currentScore = scores[comp.key];
          const sbi = sbiData[comp.key] ?? { situation: "", behavior: "", impact: "", actionPlan: "" };

          return (
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {COMPETENCIES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i + 1)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        i + 1 === currentStep
                          ? "bg-primary text-primary-foreground scale-110"
                          : scores[COMPETENCIES[i].key]
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {scores[COMPETENCIES[i].key] ? "✓" : i + 1}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentStep} / {COMPETENCIES.length}
                </span>
              </div>

              {/* Competency card */}
              <div className="card-premium rounded-2xl overflow-hidden">
                <div className="bg-primary px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{comp.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-primary-foreground">{comp.name}</h2>
                      <p className="text-primary-foreground/70 text-sm mt-0.5">{comp.nameEn}</p>
                    </div>
                  </div>
                  <p className="text-primary-foreground/80 text-sm mt-3">{comp.description}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Score selection */}
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-3">
                      Pilih Level Kompetensi <span className="text-destructive">*</span>
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => setScores((prev) => ({ ...prev, [comp.key]: score }))}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                            currentScore === score
                              ? SCORE_ACTIVE[score]
                              : SCORE_COLORS[score] + " hover:scale-102 hover:shadow-md"
                          }`}
                        >
                          <span className="text-2xl font-bold">{score}</span>
                          <span className="text-xs font-medium text-center leading-tight">
                            {SCORE_LABELS[score]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Behavioral guide */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleGuide(currentStep)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-sm font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        Panduan Indikator Perilaku per Level
                      </span>
                      {showGuide[currentStep] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {showGuide[currentStep] && (
                      <div className="divide-y divide-border">
                        {comp.indicators.map((ind) => (
                          <div
                            key={ind.level}
                            className={`px-4 py-3 ${currentScore === ind.level ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`score-badge-${ind.level}`}>Level {ind.level}</span>
                              <span className="text-sm font-semibold text-foreground">{ind.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{ind.description}</p>
                            <ul className="space-y-1">
                              {ind.examples.map((ex, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex gap-2">
                                  <span className="text-primary shrink-0">•</span>
                                  {ex}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Behavioral evidence */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Bukti Perilaku (Opsional)
                    </label>
                    <Textarea
                      value={evidences[comp.key] ?? ""}
                      onChange={(e) => setEvidences((prev) => ({ ...prev, [comp.key]: e.target.value }))}
                      placeholder="Deskripsikan perilaku konkret yang Anda amati..."
                      className="resize-none text-sm"
                      rows={3}
                    />
                  </div>

                  {/* SBI Framework */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleGuide(currentStep + 100)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors text-sm font-medium text-amber-800"
                    >
                      <span>Kerangka SBI (Situasi-Perilaku-Dampak)</span>
                      {showGuide[currentStep + 100] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {showGuide[currentStep + 100] && (
                      <div className="p-4 space-y-3">
                        {[
                          { key: "situation", label: "Situasi", placeholder: "Konteks atau situasi spesifik di mana perilaku terjadi..." },
                          { key: "behavior", label: "Perilaku", placeholder: "Perilaku konkret yang dapat diamati..." },
                          { key: "impact", label: "Dampak", placeholder: "Dampak atau hasil dari perilaku tersebut..." },
                          { key: "actionPlan", label: "Rencana Aksi", placeholder: "Langkah pengembangan yang disarankan..." },
                        ].map((field) => (
                          <div key={field.key}>
                            <label className="text-xs font-semibold text-foreground block mb-1">{field.label}</label>
                            <Textarea
                              value={(sbi as any)[field.key] ?? ""}
                              onChange={(e) =>
                                setSbiData((prev) => ({
                                  ...prev,
                                  [comp.key]: { ...sbi, [field.key]: e.target.value },
                                }))
                              }
                              placeholder={field.placeholder}
                              className="resize-none text-xs"
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Sebelumnya
                </Button>
                <Button
                  onClick={() => {
                    if (!currentScore) {
                      toast.error("Harap pilih level kompetensi terlebih dahulu");
                      return;
                    }
                    setCurrentStep((s) => s + 1);
                  }}
                  className="flex-1 gap-2"
                >
                  {currentStep === COMPETENCIES.length ? "Tinjau Penilaian" : "Selanjutnya"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })()}

        {/* Step 7: Review */}
        {currentStep === COMPETENCIES.length + 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Tinjau Penilaian
              </div>
              <h2 className="text-xl font-bold text-foreground">Ringkasan Penilaian Kompetensi</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Periksa kembali penilaian Anda sebelum menyimpan
              </p>
            </div>

            <div className="card-premium rounded-2xl p-6 space-y-4">
              {COMPETENCIES.map((comp) => {
                const score = scores[comp.key];
                const label = score ? SCORE_LABELS[score] : "Belum dinilai";
                return (
                  <div key={comp.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{comp.icon}</span>
                      <div>
                        <p className="font-medium text-sm text-foreground">{comp.name}</p>
                        <p className="text-xs text-muted-foreground">{comp.nameEn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {score ? (
                        <span className={`score-badge-${score}`}>
                          {score} — {label}
                        </span>
                      ) : (
                        <span className="text-xs text-destructive font-medium">Belum dinilai</span>
                      )}
                      <button
                        onClick={() => setCurrentStep(COMPETENCIES.findIndex((c) => c.key === comp.key) + 1)}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card-premium rounded-2xl p-6">
              <label className="text-sm font-medium text-foreground block mb-2">
                Catatan Umum (Opsional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan atau observasi umum tentang peserta..."
                className="resize-none text-sm"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(COMPETENCIES.length)}
                className="flex-1 gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !COMPETENCIES.every((c) => scores[c.key])}
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Simpan Penilaian
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
