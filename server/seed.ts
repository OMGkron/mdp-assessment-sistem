import "dotenv/config";
import { getDb } from "./db";
import { participants } from "../drizzle/schema";

const sampleParticipants = [
  { participantCode: "MDP001", fullName: "Aditiya Pratama", department: "Operations", position: "Operation Lead Trainee", mentorName: "Budi Santoso", email: "aditiya.p@company.com", joinDate: "2026-01-05" },
  { participantCode: "MDP002", fullName: "Bunga Citra", department: "Marketing", position: "Marketing Specialist Trainee", mentorName: "Siti Aminah", email: "bunga.c@company.com", joinDate: "2026-01-05" },
  { participantCode: "MDP003", fullName: "Candra Wijaya", department: "Finance", position: "Financial Analyst Trainee", mentorName: "Hendra Kurniawan", email: "candra.w@company.com", joinDate: "2026-01-05" },
  { participantCode: "MDP004", fullName: "Dian Sastro", department: "HR", position: "HR Generalist Trainee", mentorName: "Rani Wijaya", email: "dian.s@company.com", joinDate: "2026-01-12" },
  { participantCode: "MDP005", fullName: "Eko Prasetyo", department: "IT", position: "Software Engineer Trainee", mentorName: "Andi Wijaya", email: "eko.p@company.com", joinDate: "2026-01-12" },
  { participantCode: "MDP006", fullName: "Fani Rahmawati", department: "Sales", position: "Account Manager Trainee", mentorName: "Doni Setiawan", email: "fani.r@company.com", joinDate: "2026-01-12" },
  { participantCode: "MDP007", fullName: "Gilang Dirga", department: "Operations", position: "Logistics Trainee", mentorName: "Budi Santoso", email: "gilang.d@company.com", joinDate: "2026-01-19" },
  { participantCode: "MDP008", fullName: "Hani Syahadat", department: "Marketing", position: "Branding Specialist Trainee", mentorName: "Siti Aminah", email: "hani.s@company.com", joinDate: "2026-01-19" },
  { participantCode: "MDP009", fullName: "Indra Bruggman", department: "Finance", position: "Tax Specialist Trainee", mentorName: "Hendra Kurniawan", email: "indra.b@company.com", joinDate: "2026-01-19" },
  { participantCode: "MDP010", fullName: "Joko Anwar", department: "IT", position: "System Admin Trainee", mentorName: "Andi Wijaya", email: "joko.a@company.com", joinDate: "2026-01-19" },
  { participantCode: "MDP011", fullName: "Kiki Rizky", department: "Operations", position: "Procurement Trainee", mentorName: "Budi Santoso", email: "kiki.r@company.com", joinDate: "2026-02-02" },
  { participantCode: "MDP012", fullName: "Lulu Tobing", department: "HR", position: "Recruiter Trainee", mentorName: "Rani Wijaya", email: "lulu.t@company.com", joinDate: "2026-02-02" },
  { participantCode: "MDP013", fullName: "Mamat Alkatiri", department: "Sales", position: "Sales Engineer Trainee", mentorName: "Doni Setiawan", email: "mamat.a@company.com", joinDate: "2026-02-02" },
  { participantCode: "MDP014", fullName: "Nina Zatulini", department: "Marketing", position: "Content Creator Trainee", mentorName: "Siti Aminah", email: "nina.z@company.com", joinDate: "2026-02-09" },
  { participantCode: "MDP015", fullName: "Omesh", department: "Operations", position: "Supply Chain Trainee", mentorName: "Budi Santoso", email: "omesh@company.com", joinDate: "2026-02-09" },
  { participantCode: "MDP016", fullName: "Putri Marino", department: "Finance", position: "Internal Auditor Trainee", mentorName: "Hendra Kurniawan", email: "putri.m@company.com", joinDate: "2026-02-09" },
  { participantCode: "MDP017", fullName: "Qory Sandioriva", department: "HR", position: "Training specialist Trainee", mentorName: "Rani Wijaya", email: "qory.s@company.com", joinDate: "2026-02-16" },
  { participantCode: "MDP018", fullName: "Raffi Ahmad", department: "Sales", position: "Partnership Trainee", mentorName: "Doni Setiawan", email: "raffi.a@company.com", joinDate: "2026-02-16" },
  { participantCode: "MDP019", fullName: "Sule", department: "Operations", position: "Warehouse Trainee", mentorName: "Budi Santoso", email: "sule@company.com", joinDate: "2026-02-16" },
  { participantCode: "MDP020", fullName: "Titi Kamal", department: "Marketing", position: "Digital Marketing Trainee", mentorName: "Siti Aminah", email: "titi.k@company.com", joinDate: "2026-02-16" },
];

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not connected");
    process.exit(1);
  }

  console.log("Seeding participants...");
  for (const p of sampleParticipants) {
    await db.insert(participants).values(p).onConflictDoNothing();
  }
  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
