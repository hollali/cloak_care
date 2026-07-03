"use server";

import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import sql, { initDB } from "../db.config";
import { parseStringify } from "../utils";
import { UserFormValidation, PatientFormValidation } from "../validation";
import { sendEmail, otpEmail } from "../email";

// INIT DB (non-blocking)
if (sql) initDB().catch(console.error);

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const UPLOAD_DIR = path.join(process.cwd(), "private", "uploads");

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const parsed = UserFormValidation.parse(user);

    const db = requireDb();
    const existing = await db`
      SELECT * FROM users WHERE email = ${parsed.email}
    `;
    if (existing.length > 0) {
      return parseStringify({ $id: existing[0].id, ...existing[0] });
    }

    const id = crypto.randomUUID();
    const result = await db`
      INSERT INTO users (id, name, email, phone)
      VALUES (${id}, ${parsed.name}, ${parsed.email}, ${parsed.phone})
      RETURNING *
    `;
    return parseStringify({ $id: result[0].id, ...result[0] });
  } catch (error) {
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const db = requireDb();
    const result = await db`
      SELECT * FROM users WHERE id = ${userId}
    `;
    if (result.length === 0) throw new Error("User not found");
    return parseStringify({ $id: result[0].id, ...result[0] });
  } catch (error) {
    console.error("An error occurred while retrieving the user:", error);
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    const parsed = PatientFormValidation.parse({
      ...patient,
      birthDate: patient.birthDate,
      identificationDocument: identificationDocument ? [] : undefined,
    });

    const db = requireDb();
    let identificationDocumentUrl = "";
    if (identificationDocument) {
      const blobFile = identificationDocument.get("blobFile") as Blob | null;
      const fileName = identificationDocument.get("fileName") as string | null;

      if (!blobFile || !fileName) {
        throw new Error("Missing file data in upload");
      }

      if (blobFile.size > MAX_FILE_SIZE) {
        throw new Error("File exceeds maximum size of 5 MB");
      }

      if (!ALLOWED_MIME_TYPES.has(blobFile.type)) {
        throw new Error("File type not allowed. Accepted: PNG, JPEG, GIF, SVG");
      }

      const buffer = Buffer.from(await blobFile.arrayBuffer());
      const uniqueName = `${crypto.randomUUID()}-${fileName}`;

      await writeFile(path.join(UPLOAD_DIR, uniqueName), buffer);
      identificationDocumentUrl = `/api/uploads?file=${uniqueName}`;
    }

    const id = crypto.randomUUID();
    const result = await db`
      INSERT INTO patients (
        id, user_id, name, email, phone, birth_date, gender,
        address, occupation, emergency_contact_name, emergency_contact_number,
        primary_physician, insurance_provider, insurance_policy_number,
        allergies, current_medication, family_medical_history, past_medical_history,
        identification_type, identification_number, identification_document_url,
        treatment_consent, disclosure_consent, privacy_consent
      ) VALUES (
        ${id}, ${patient.userId}, ${parsed.name}, ${parsed.email}, ${parsed.phone},
        ${parsed.birthDate.toISOString()}, ${parsed.gender},
        ${parsed.address}, ${parsed.occupation},
        ${parsed.emergencyContactName}, ${parsed.emergencyContactNumber},
        ${parsed.primaryPhysician}, ${parsed.insuranceProvider},
        ${parsed.insurancePolicyNumber}, ${parsed.allergies ?? null},
        ${parsed.currentMedication ?? null}, ${parsed.familyMedicalHistory ?? null},
        ${parsed.pastMedicalHistory ?? null}, ${parsed.identificationType ?? null},
        ${parsed.identificationNumber ?? null}, ${identificationDocumentUrl || null},
        ${parsed.treatmentConsent}, ${parsed.disclosureConsent}, ${parsed.privacyConsent}
      )
      RETURNING *
    `;
    return parseStringify({ $id: result[0].id, ...result[0] });
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const db = requireDb();
    const result = await db`
      SELECT * FROM patients WHERE user_id = ${userId}
    `;
    if (result.length === 0) return null;
    const patient = result[0];
    return parseStringify({ $id: patient.id, ...patient });
  } catch (error) {
    console.error("An error occurred while retrieving the patient:", error);
  }
};

// ─── Auth ────────────────────────────────────────────────────────────────────

// SEND OTP
export const sendOTP = async (email: string) => {
  try {
    const db = requireDb();

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db`
      DELETE FROM verification_codes WHERE email = ${email}
    `;
    await db`
      INSERT INTO verification_codes (email, code, expires_at)
      VALUES (${email}, ${code}, ${expiresAt.toISOString()})
    `;

    const emailContent = otpEmail({ code });
    await sendEmail({ to: email, ...emailContent });

    return { success: true };
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return { success: false };
  }
};

// VERIFY OTP
export const verifyOTP = async (email: string, code: string) => {
  try {
    const db = requireDb();
    const result = await db`
      SELECT * FROM verification_codes
      WHERE email = ${email}
        AND code = ${code}
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (result.length === 0) return { success: false, error: "Invalid or expired code" };

    await db`DELETE FROM verification_codes WHERE email = ${email}`;

    const token = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db`
      INSERT INTO sessions (token, email, expires_at)
      VALUES (${token}, ${email}, ${sessionExpiresAt.toISOString()})
    `;

    const cookieStore = cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return { success: false, error: "Verification failed" };
  }
};

// GET SESSION
export const getSession = async (token: string) => {
  try {
    const db = requireDb();
    const result = await db`
      SELECT * FROM sessions
      WHERE token = ${token} AND expires_at > NOW()
    `;
    if (result.length === 0) return null;
    return { email: result[0].email };
  } catch {
    return null;
  }
};

// DELETE SESSION (logout)
export const deleteSession = async (token: string) => {
  try {
    const db = requireDb();
    await db`DELETE FROM sessions WHERE token = ${token}`;
    return { success: true };
  } catch {
    return { success: false };
  }
};
