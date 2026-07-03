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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export default sql;
