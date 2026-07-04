"use server";

import { cookies } from "next/headers";
import sql from "../db.config";
import { parseStringify } from "../utils";

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

export const verifyAdminPasskey = async (passkey: string) => {
  const adminPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
  if (!adminPasskey) {
    return { success: false, error: "Admin passkey not configured" };
  }

  if (passkey !== adminPasskey) {
    return { success: false, error: "Invalid passkey" };
  }

  const cookieStore = cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 24 * 60 * 60, // 24 hours
  });

  return { success: true };
};

export const checkAdminSession = () => {
  const cookieStore = cookies();
  return cookieStore.get("admin_session")?.value === "true";
};

export const logoutAdmin = async () => {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  return { success: true };
};

export const deleteUser = async (userId: string) => {
  try {
    const db = requireDb();
    await db`DELETE FROM appointments WHERE user_id = ${userId}`;
    await db`DELETE FROM patients WHERE user_id = ${userId}`;
    await db`DELETE FROM sessions WHERE email = (SELECT email FROM users WHERE id = ${userId})`;
    await db`DELETE FROM verification_codes WHERE email = (SELECT email FROM users WHERE id = ${userId})`;
    await db`DELETE FROM users WHERE id = ${userId}`;
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
};

export const getAllUsers = async () => {
  try {
    const db = requireDb();
    const users = await db`
      SELECT u.*,
        CASE WHEN p.id IS NOT NULL THEN true ELSE false END AS has_patient_profile,
        (SELECT COUNT(*)::int FROM appointments a WHERE a.user_id = u.id) AS appointment_count
      FROM users u
      LEFT JOIN patients p ON p.user_id = u.id
      ORDER BY u.created_at DESC
    `;
    return parseStringify(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export const getUserWithDetails = async (userId: string) => {
  try {
    const db = requireDb();
    const [userResult, patientResult, appointmentResult] = await Promise.all([
      db`SELECT * FROM users WHERE id = ${userId}`,
      db`SELECT * FROM patients WHERE user_id = ${userId}`,
      db`
        SELECT a.*, p.name AS patient_name
        FROM appointments a
        LEFT JOIN patients p ON a.patient_id = p.id
        WHERE a.user_id = ${userId}
        ORDER BY a.created_at DESC
      `,
    ]);

    if (userResult.length === 0) return null;

    return parseStringify({
      user: userResult[0],
      patient: patientResult[0] || null,
      appointments: appointmentResult,
    });
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return null;
  }
};
