import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export async function initDB() {
  if (!sql) {
    console.warn("DATABASE_URL not configured - skipping schema init");
    return;
  }
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      birth_date DATE NOT NULL,
      gender TEXT NOT NULL,
      address TEXT NOT NULL,
      occupation TEXT NOT NULL,
      emergency_contact_name TEXT NOT NULL,
      emergency_contact_number TEXT NOT NULL,
      primary_physician TEXT NOT NULL,
      insurance_provider TEXT NOT NULL,
      insurance_policy_number TEXT NOT NULL,
      allergies TEXT,
      current_medication TEXT,
      family_medical_history TEXT,
      past_medical_history TEXT,
      identification_type TEXT,
      identification_number TEXT,
      identification_document_url TEXT,
      treatment_consent BOOLEAN DEFAULT FALSE,
      disclosure_consent BOOLEAN DEFAULT FALSE,
      privacy_consent BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL REFERENCES patients(id),
      user_id TEXT NOT NULL,
      primary_physician TEXT NOT NULL,
      reason TEXT NOT NULL,
      schedule TIMESTAMP NOT NULL,
      status TEXT DEFAULT 'pending',
      note TEXT,
      cancellation_reason TEXT,
      category TEXT DEFAULT 'general',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      specialty TEXT NOT NULL DEFAULT 'General',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // seed default doctors if table is empty
  const existing = await sql`SELECT COUNT(*) FROM doctors`;
  if (Number(existing[0].count) === 0) {
    const defaultDoctors = [
      { name: "John Green", image: "/assets/images/dr-green.png", specialty: "General" },
      { name: "Leila Cameron", image: "/assets/images/dr-cameron.png", specialty: "Pediatrics" },
      { name: "David Livingston", image: "/assets/images/dr-livingston.png", specialty: "Cardiology" },
      { name: "Evan Peter", image: "/assets/images/dr-peter.png", specialty: "Neurology" },
      { name: "Jane Powell", image: "/assets/images/dr-powell.png", specialty: "Orthopedics" },
      { name: "Alex Ramirez", image: "/assets/images/dr-remirez.png", specialty: "Dermatology" },
      { name: "Jasmine Lee", image: "/assets/images/dr-lee.png", specialty: "Ophthalmology" },
      { name: "Alyana Cruz", image: "/assets/images/dr-cruz.png", specialty: "Gynecology" },
      { name: "Hardik Sharma", image: "/assets/images/dr-sharma.png", specialty: "General" },
    ];
    for (const doc of defaultDoctors) {
      await sql`
        INSERT INTO doctors (id, name, image, specialty)
        VALUES (${crypto.randomUUID()}, ${doc.name}, ${doc.image}, ${doc.specialty})
      `;
    }
  }
}

export default sql;
