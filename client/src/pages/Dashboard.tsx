import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Eye,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const DEPT_COLORS: Record<string, string> = {
  Produksi: "bg-blue-100 text-blue-700",
  Pemasaran: "bg-purple-100 text-purple-700",
  Admin: "bg-orange-100 text-orange-700",
  Keuangan: "bg-green-100 text-green-700",
  SDM: "bg-pink-100 text-pink-700",
  IT: "bg-cyan-100 text-cyan-700",
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("Semua");

  const { data: participants, isLoading } = trpc.participants.list.useQuery();
  const { data: exportData } = trpc.export.allData.useQuery();

  const departments = useMemo(() => {
    if (!participants) return ["Semua"];
    const depts = Array.from(new Set(participants.map((p) => p.department))).sort();
    return ["Semua", ...depts];
  }, [participants]);

  const filtered = useMemo(() => {
    if (!participants) return [];
    return participants.filter((p) => {
      const matchSearch =
        search === "" ||
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.participantCode.toLowerCase().includes(search.toLowerCase()) ||
        p.department.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === "Semua" || p.department === filterDept;
      return matchSearch && matchDept;
    });
  }, [participants, search, filterDept]);

  const stats = useMemo(() => {
    if (!participants) return { total: 0, selfDone: 0, observationDone: 0, bothDone: 0 };
    return {
      total: participants.length,
      selfDone: participants.filter((p) => p.selfDone).length,
      observationDone: participants.filter((p) => p.observationDone).length,
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
        const baseRow: any = {
          "Kode Peserta": participant.participantCode,
          "Nama Lengkap": participant.fullName,
          Departemen: participant.department,
          Posisi: participant.position,
          "Jenis Penilaian": a.assessmentType === "self" ? "Self-Assessment" : "Observasi Perilaku",
          "Nama Penilai": a.assessorName ?? participant.fullName,
          Status: a.status === "completed" ? "Selesai" : "Draft",
          Periode: a.period,
        };
        a.scores.forEach((s) => {
          baseRow[COMP_LABELS[s.competencyKey] ?? s.competencyKey] = s.score;
        });
        rows.push(baseRow);
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hasil Penilaian");
    XLSX.writeFile(wb, "MDP_Hasil_Penilaian.xlsx");
    toast.success("Data berhasil diekspor ke Excel");
  };

  const getStatusInfo = (selfDone: boolean, observationDone: boolean) => {
    if (selfDone && observationDone) return { label: "Lengkap", cls: "status-complete", icon: CheckCircle2 };
    if (selfDone || observationDone) return { label: "Sebagian", cls: "status-partial", icon: Clock };
    return { label: "Belum Dinilai", cls: "status-pending", icon: Circle };
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard MDP</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Program Pengembangan Manajemen — Periode 2026
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Ekspor Excel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Peserta",
            value: stats.total,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Self-Assessment Selesai",
            value: stats.selfDone,
            icon: CheckCircle2,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Observasi Selesai",
            value: stats.observationDone,
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Penilaian Lengkap",
            value: stats.bothDone,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="card-premium rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-current rounded-full transition-all duration-700"
                style={{
                  width: `${stats.total > 0 ? (stat.value / stats.total) * 100 : 0}%`,
                  color: stat.color.replace("text-", ""),
                  backgroundColor: stat.color.includes("primary")
                    ? "oklch(0.28 0.08 255)"
                    : stat.color.includes("blue")
                      ? "oklch(0.48 0.18 255)"
                      : stat.color.includes("amber")
                        ? "oklch(0.65 0.18 75)"
                        : "oklch(0.52 0.16 155)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, kode, atau departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterDept === dept
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Participants Table */}
      <div className="card-premium rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Daftar Peserta
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filtered.length} peserta)
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="mt-3 text-muted-foreground text-sm">Memuat data peserta...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  {["Kode", "Nama Peserta", "Departemen", "Posisi", "Mentor", "Self-Assessment", "Observasi Perilaku", "Status", "Aksi"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => {
                  const status = getStatusInfo(p.selfDone, p.observationDone);
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {p.participantCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {p.fullName.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground text-sm whitespace-nowrap">
                            {p.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-lg ${DEPT_COLORS[p.department] ?? "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {p.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {p.position}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {p.mentorName ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {p.selfDone ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                          </span>
                        ) : (
                          <button
                            onClick={() => setLocation(`/penilaian/${p.id}/self`)}
                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            <Plus className="h-3.5 w-3.5" /> Mulai
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {p.observationDone ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                          </span>
                        ) : (
                          <button
                            onClick={() => setLocation(`/penilaian/${p.id}/observation`)}
                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            <Plus className="h-3.5 w-3.5" /> Mulai
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${status.cls}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => setLocation(`/hasil/${p.id}`)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Hasil
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Tidak ada peserta yang ditemukan</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
