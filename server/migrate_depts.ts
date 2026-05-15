import postgres from "postgres";
import "dotenv/config";

async function migrateDepts() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined in .env");
  }
  const sql = postgres(url);

  try {
    console.log("Updating 'Penjualan' to 'Produksi'...");
    const res1 = await sql`
      UPDATE participants 
      SET department = 'Produksi' 
      WHERE department = 'Penjualan'
    `;
    console.log(`Updated ${res1.count} rows.`);

    console.log("Updating 'Operations' to 'Admin'...");
    const res2 = await sql`
      UPDATE participants 
      SET department = 'Admin' 
      WHERE department = 'Operations'
    `;
    console.log(`Updated ${res2.count} rows.`);

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await sql.end();
  }
}

migrateDepts();
