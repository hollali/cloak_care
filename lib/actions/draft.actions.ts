"use server";

import sql from "../db.config";
import { parseStringify } from "../utils";

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

export async function saveDraft(userId: string, data: Record<string, unknown>) {
  try {
    const db = requireDb();
    const id = `draft_${userId}`;
    await db`
      INSERT INTO registration_drafts (id, user_id, data, updated_at)
      VALUES (${id}, ${userId}, ${JSON.stringify(data)}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW()
    `;
    return { success: true };
  } catch (error) {
    console.error("Failed to save draft:", error);
    return { success: false };
  }
}

export async function getDraft(userId: string) {
  try {
    const db = requireDb();
    const result = await db`
      SELECT data FROM registration_drafts WHERE user_id = ${userId}
    `;
    if (result.length === 0) return null;
    return { data: JSON.parse(result[0].data) };
  } catch (error) {
    console.error("Failed to fetch draft:", error);
    return null;
  }
}

export async function deleteDraft(userId: string) {
  try {
    const db = requireDb();
    await db`DELETE FROM registration_drafts WHERE user_id = ${userId}`;
    return { success: true };
  } catch (error) {
    console.error("Failed to delete draft:", error);
    return { success: false };
  }
}
