"use server";

import { writeFile } from "fs/promises";
import path from "path";
import sql, { initDB } from "../db.config";
import { parseStringify } from "../utils";

// INIT DB (non-blocking)
if (sql) initDB().catch(console.error);

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const db = requireDb();
    const existing = await db`
      SELECT * FROM users WHERE email = ${user.email}
    `;
    if (existing.length > 0) {
      return parseStringify({ $id: existing[0].id, ...existing[0] });
    }

    const id = crypto.randomUUID();
    const result = await db`
      INSERT INTO users (id, name, email, phone)
      VALUES (${id}, ${user.name}, ${user.email}, ${user.phone})
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
    const db = requireDb();
    let identificationDocumentUrl = "";
    if (identificationDocument) {
      const blobFile = identificationDocument.get("blobFile") as Blob;
      const fileName = identificationDocument.get("fileName") as string;
      const buffer = Buffer.from(await blobFile.arrayBuffer());
      const uniqueName = `${crypto.randomUUID()}-${fileName}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", uniqueName);
      await writeFile(uploadPath, buffer);
      identificationDocumentUrl = `/uploads/${uniqueName}`;
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
        ${id}, ${patient.userId}, ${patient.name}, ${patient.email}, ${patient.phone},
        ${patient.birthDate.toISOString()}, ${patient.gender},
        ${patient.address}, ${patient.occupation},
        ${patient.emergencyContactName}, ${patient.emergencyContactNumber},
        ${patient.primaryPhysician}, ${patient.insuranceProvider},
        ${patient.insurancePolicyNumber}, ${patient.allergies ?? null},
        ${patient.currentMedication ?? null}, ${patient.familyMedicalHistory ?? null},
        ${patient.pastMedicalHistory ?? null}, ${patient.identificationType ?? null},
        ${patient.identificationNumber ?? null}, ${identificationDocumentUrl || null},
        ${patient.treatmentConsent}, ${patient.disclosureConsent}, ${patient.privacyConsent}
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
