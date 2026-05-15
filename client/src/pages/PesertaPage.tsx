import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3, Eye, Plus, Search, Users, Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const DEPT_COLORS: Record<string, string> = {
  Produksi: "bg-blue-100 text-blue-700",
  Pemasaran: "bg-purple-100 text-purple-700",
  Admin: "bg-orange-100 text-orange-700",
  Keuangan: "bg-green-100 text-green-700",
  SDM: "bg-pink-100 text-pink-700",
  IT: "bg-cyan-100 text-cyan-700",
};

const participantSchema = z.object({
  participantCode: z.string().min(1, "Kode wajib diisi"),
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  department: z.string().min(1, "Departemen wajib diisi"),
  position: z.string().min(1, "Jabatan wajib diisi"),
  mentorName: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  joinDate: z.string().optional(),
});

type ParticipantFormValues = z.infer<typeof participantSchema>;

export default function PesertaPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: participants, isLoading } = trpc.participants.list.useQuery();

  const createMutation = trpc.participants.create.useMutation({
    onSuccess: () => {
      toast.success("Peserta berhasil ditambahkan");
      utils.participants.list.invalidate();
      setIsDialogOpen(false);
    },
    onError: (err) => toast.error(`Gagal: ${err.message}`),
  });

  const updateMutation = trpc.participants.update.useMutation({
    onSuccess: () => {
      toast.success("Data peserta berhasil diperbarui");
      utils.participants.list.invalidate();
      setIsDialogOpen(false);
    },
    onError: (err) => toast.error(`Gagal: ${err.message}`),
  });

  const deleteMutation = trpc.participants.delete.useMutation({
    onSuccess: () => {
      toast.success("Peserta berhasil dihapus");
      utils.participants.list.invalidate();
      setDeleteConfirmId(null);
    },
    onError: (err) => toast.error(`Gagal: ${err.message}`),
  });

  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      participantCode: "",
      fullName: "",
      department: "",
      position: "",
      mentorName: "",
      email: "",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (values: ParticipantFormValues) => {
    if (editingParticipant) {
      updateMutation.mutate({ id: editingParticipant.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const openAddDialog = () => {
    setEditingParticipant(null);
    form.reset({
      participantCode: `MDP${(participants?.length ?? 0) + 1}`.padStart(6, "0"),
      fullName: "",
      department: "",
      position: "",
      mentorName: "",
      email: "",
      joinDate: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (participant: any) => {
    setEditingParticipant(participant);
    form.reset({
      participantCode: participant.participantCode,
      fullName: participant.fullName,
      department: participant.department,
      position: participant.position,
      mentorName: participant.mentorName ?? "",
      email: participant.email ?? "",
      joinDate: participant.joinDate ?? "",
    });
    setIsDialogOpen(true);
  };

  const filtered = useMemo(() => {
    if (!participants) return [];
    return participants.filter(
      (p) =>
        search === "" ||
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.department.toLowerCase().includes(search.toLowerCase()) ||
        p.position.toLowerCase().includes(search.toLowerCase()) ||
        p.participantCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [participants, search]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Peserta MDP</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manajemen daftar peserta Program Pengembangan Manajemen
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Peserta
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, kode, departemen, atau posisi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        </div>
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="card-premium rounded-2xl p-5 flex flex-col gap-4 group relative"
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                    onClick={() => openEditDialog(p)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteConfirmId(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">{p.fullName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 pr-12">
                    <p className="font-semibold text-sm text-foreground truncate">{p.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.participantCode}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Departemen</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${DEPT_COLORS[p.department] ?? "bg-gray-100 text-gray-700"}`}>
                      {p.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Mentor</span>
                    <span className="text-xs font-medium text-foreground">{p.mentorName ?? "-"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className={`text-center py-2 rounded-lg text-xs font-medium ${p.selfDone ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {p.selfDone ? "✓ Self" : "○ Self"}
                  </div>
                  <div className={`text-center py-2 rounded-lg text-xs font-medium ${p.observationDone ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {p.observationDone ? "✓ Observasi" : "○ Observasi"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs gap-1"
                    onClick={() => setLocation(`/hasil/${p.id}`)}
                  >
                    <Eye className="h-3 w-3" /> Hasil
                  </Button>
                  {!p.selfDone && (
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1"
                      onClick={() => setLocation(`/penilaian/${p.id}/self`)}
                    >
                      <Plus className="h-3 w-3" /> Nilai
                    </Button>
                  )}
                  {p.selfDone && !p.observationDone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs gap-1"
                      onClick={() => setLocation(`/penilaian/${p.id}/observation`)}
                    >
                      <Plus className="h-3 w-3" /> Observasi
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Tidak ada peserta yang ditemukan</p>
        </div>
      )}

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingParticipant ? "Edit Peserta" : "Tambah Peserta Baru"}</DialogTitle>
            <DialogDescription>
              Silakan lengkapi data peserta MDP di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="participantCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Peserta</FormLabel>
                      <FormControl>
                        <Input placeholder="MDP001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departemen</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Dept" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(DEPT_COLORS).map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Lead Trainee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mentorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Mentor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama mentor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tgl Join</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog Konfirmasi Hapus */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Peserta?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Seluruh data penilaian terkait peserta ini juga akan terhapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && deleteMutation.mutate({ id: deleteConfirmId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Peserta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


