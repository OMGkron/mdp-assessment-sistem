import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { COMPETENCIES } from "../../../shared/competencies";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const SCORE_LABELS = ["", "Belum Berkembang", "Mulai Berkembang", "Cukup Kompeten", "Kompeten", "Sangat Kompeten"];

export default function LaporanPage() {
  const [, setLocation] = useLocation();
  const { data: participants } = trpc.participants.list.useQuery();
  const { data: exportData } = trpc.export.allData.useQuery();

  const competencyStats = useMemo(() => {
    if (!exportData) return [];
    const stats: Record<string, { selfScores: number[]; obsScores: number[] }> = {};
    COMPETENCIES.forEach((c) => {
      stats[c.key] = { selfScores: [], obsScores: [] };
    });
    exportData.forEach(({ assessments }) => {
      assessments.forEach((a) => {
        a.scores.forEach((s) => {
          if (!stats[s.competencyKey]) return;
          if (a.assessmentType === "self") stats[s.competencyKey].selfScores.push(s.score);
          else stats[s.competencyKey].obsScores.push(s.score);
        });
      });
    });
    return COMPETENCIES.map((c) => {
      const { selfScores, obsScores } = stats[c.key];
      const selfAvg = selfScores.length > 0 ? selfScores.reduce((a, b) => a + b, 0) / selfScores.length : 0;
      const obsAvg = obsScores.length > 0 ? obsScores.reduce((a, b) => a + b, 0) / obsScores.length : 0;
      return {
        name: c.name.split(" ")[0],
        fullName: c.name,
        icon: c.icon,
        selfAvg: parseFloat(selfAvg.toFixed(2)),
        obsAvg: parseFloat(obsAvg.toFixed(2)),
        gap: parseFloat((obsAvg - selfAvg).toFixed(2)),
      };
    });
  }, [exportData]);

  const programStats = useMemo(() => {
    if (!participants) return { total: 0, selfDone: 0, obsDone: 0, bothDone: 0 };
    return {
      total: participants.length,
      selfDone: participants.filter((p) => p.selfDone).length,
      obsDone: participants.filter((p) => p.observationDone).length,
      bothDone: participants.filter((p) => p.selfDone && p.observationDone).length,
    };
  }, [participants]);

  const handleExport = () => {
    if (!exportData) return;
    const rows: any[] = [];
    const COMP_LABELS: Record<string, string> = {
      strategic_thinking: "Pemikiran Strategis",
      leadership: "Kepemimpinan",
      communication: "Komunikasi",
      problem_solving: "Pemecahan Masalah",
      decision_making: "Pengambilan Keputusan",
      emotional_intelligence: "Kecerdasan Emosional",
    };
    exportData.forEach(({ participant, assessments }) => {
      assessments.forEach((a) => {
        const row: any = {
          "Kode": participant.participantCode,
          "Nama": participant.fullName,
          "Departemen": participant.department,
          "Posisi": participant.position,
          "Jenis Penilaian": a.assessmentType === "self" ? "Self-Assessment" : "Observasi Perilaku",
          "Penilai": a.assessorName ?? participant.fullName,
          "Status": a.status === "completed" ? "Selesai" : "Draft",
        };
        a.scores.forEach((s) => {
          row[COMP_LABELS[s.competencyKey] ?? s.competencyKey] = s.score;
        });
        rows.push(row);
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hasil Penilaian");
    XLSX.writeFile(wb, "MDP_Laporan_Kompetensi.xlsx");
    toast.success("Laporan berhasil diekspor ke Excel");
  };

  const completionPct = programStats.total > 0
    ? Math.round((programStats.bothDone / programStats.total) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan Program MDP</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ringkasan hasil penilaian kompetensi seluruh peserta
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Ekspor Excel
        </Button>
      </div>

      {/* Program completion */}
      <div className="card-premium rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Progress Penyelesaian Program</h2>
          <span className="text-2xl font-bold text-primary">{completionPct}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Peserta", value: programStats.total, color: "text-foreground" },
            { label: "Self-Assessment", value: programStats.selfDone, color: "text-blue-600" },
            { label: "Observasi Perilaku", value: programStats.obsDone, color: "text-amber-600" },
            { label: "Keduanya Selesai", value: programStats.bothDone, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Competency bar chart */}
      {competencyStats.some((s) => s.selfAvg > 0 || s.obsAvg > 0) && (
        <div className="card-premium rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6">
            Rata-rata Skor Kompetensi — Seluruh Peserta
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={competencyStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.01 250)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.45 0.03 250)" }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "oklch(0.45 0.03 250)" }} />
              <Tooltip
                formatter={(value, name) => [
                  `${value}/5`,
                  name === "selfAvg" ? "Self-Assessment" : "Observasi Perilaku",
                ]}
                contentStyle={{ borderRadius: "0.75rem", border: "1px solid oklch(0.90 0.01 250)", fontSize: 12 }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "oklch(0.35 0.03 250)" }}>
                    {value === "selfAvg" ? "Self-Assessment" : "Observasi Perilaku"}
                  </span>
                )}
              />
              <Bar dataKey="selfAvg" name="selfAvg" fill="oklch(0.48 0.15 255)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="obsAvg" name="obsAvg" fill="oklch(0.65 0.18 30)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Competency detail table */}
      <div className="card-premium rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Detail Rata-rata per Kompetensi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {["Kompetensi", "Self-Assessment", "Observasi Perilaku", "Kesenjangan", "Interpretasi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {competencyStats.map((s) => (
                <tr key={s.name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{s.icon}</span>
                      <span className="font-medium text-sm text-foreground">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {s.selfAvg > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">{s.selfAvg}</span>
                        <span className="text-xs text-muted-foreground">{SCORE_LABELS[Math.round(s.selfAvg)]}</span>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {s.obsAvg > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-600">{s.obsAvg}</span>
                        <span className="text-xs text-muted-foreground">{SCORE_LABELS[Math.round(s.obsAvg)]}</span>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {s.selfAvg > 0 && s.obsAvg > 0 ? (
                      <span className={`font-bold text-sm ${s.gap > 0 ? "text-emerald-600" : s.gap < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                        {s.gap > 0 ? `+${s.gap}` : s.gap}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">
                    {s.selfAvg > 0 && s.obsAvg > 0 ? (
                      s.gap > 0.5 ? "Mentor menilai lebih tinggi — potensi tersembunyi" :
                      s.gap < -0.5 ? "Self-assessment lebih tinggi — perlu kalibrasi" :
                      "Penilaian selaras"
                    ) : "Data belum lengkap"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant list with scores */}
      <div className="card-premium rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Ringkasan per Peserta</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {["Peserta", "Departemen", "Self Avg", "Observasi Avg", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(participants ?? []).map((p) => {
                const pData = exportData?.find((e) => e.participant.id === p.id);
                const selfAssessment = pData?.assessments.find((a) => a.assessmentType === "self");
                const obsAssessment = pData?.assessments.find((a) => a.assessmentType === "observation");
                const selfAvg = selfAssessment?.scores.length
                  ? (selfAssessment.scores.reduce((s, sc) => s + sc.score, 0) / selfAssessment.scores.length).toFixed(1)
                  : null;
                const obsAvg = obsAssessment?.scores.length
                  ? (obsAssessment.scores.reduce((s, sc) => s + sc.score, 0) / obsAssessment.scores.length).toFixed(1)
                  : null;
                return (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{p.fullName.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-sm text-foreground whitespace-nowrap">{p.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.department}</td>
                    <td className="px-4 py-3">
                      {selfAvg ? <span className="font-bold text-blue-600">{selfAvg}</span> : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {obsAvg ? <span className="font-bold text-amber-600">{obsAvg}</span> : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        p.selfDone && p.observationDone ? "status-complete" :
                        p.selfDone || p.observationDone ? "status-partial" : "status-pending"
                      }`}>
                        {p.selfDone && p.observationDone ? "Lengkap" : p.selfDone || p.observationDone ? "Sebagian" : "Belum"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => setLocation(`/hasil/${p.id}`)}>
                        <Eye className="h-3 w-3" /> Detail
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
