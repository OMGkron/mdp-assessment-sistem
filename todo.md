# MDP Assessment System - TODO

## Phase 1: Database & Backend
- [x] Database schema: participants, assessments, competency_scores, sbi_feedback
- [x] Seed 20 sample participants dengan data lengkap
- [x] tRPC router: participants CRUD + dashboard summary
- [x] tRPC router: assessments CRUD (self & observation)
- [x] tRPC router: competency scores dengan upsert
- [x] tRPC router: AI chatbot endpoint berbahasa Indonesia
- [x] tRPC router: export Excel (getAllAssessmentsWithScores)
- [x] Shared competencies data dengan panduan perilaku 6 kompetensi x 5 level

## Phase 2: Frontend - Dashboard & Form
- [x] Global design system (Navy+Gold palette, Plus Jakarta Sans, index.css)
- [x] DashboardLayout dengan sidebar navigasi berbahasa Indonesia
- [x] Dashboard halaman utama: daftar 20 peserta + status penilaian + stats cards
- [x] Halaman form penilaian kompetensi multi-step (skala 1-5)
- [x] Panduan perilaku inline per kompetensi (level 1-5) dengan toggle
- [x] Mode Self-Assessment dan Observasi Perilaku
- [x] Kerangka SBI (Situasi-Perilaku-Dampak) dalam form penilaian
- [x] Filter departemen dan pencarian peserta
- [x] Ekspor Excel dari dashboard

## Phase 3: Hasil Individual
- [x] Halaman hasil individual peserta
- [x] Radar chart (self vs observasi) menggunakan Recharts
- [x] Perbandingan skor side-by-side dengan score bars
- [x] Gap analysis per kompetensi dengan interpretasi
- [x] Ringkasan: kekuatan, area pengembangan, kesenjangan besar

## Phase 4: Chatbot AI
- [x] Halaman ChatbotPage dengan UI chat yang elegan
- [x] Chatbot AI berbahasa Indonesia (sistem prompt lengkap)
- [x] Konteks kompetensi, peserta, dan jenis penilaian dalam chatbot
- [x] Quick start questions untuk memulai percakapan
- [x] Selector konteks (peserta, jenis penilaian, kompetensi)

## Phase 5: Halaman Tambahan & Polish
- [x] Halaman Peserta MDP (card view)
- [x] Halaman Laporan dengan statistik program + bar chart
- [x] Ekspor Excel dari halaman Laporan
- [x] Tabel detail rata-rata per kompetensi
- [x] Ringkasan per peserta di halaman Laporan

## Phase 6: Testing & Delivery
- [x] Vitest unit tests (6 tests passing)
- [x] TypeScript 0 errors
- [x] Checkpoint final (v: af07cdcf)
