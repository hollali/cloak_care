"use server";

"use server";

import sql from "../db.config";

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

export interface DoctorRecord {
  id: string;
  name: string;
  image: string;
  specialty: string;
}

export const getDoctors = async (): Promise<DoctorRecord[]> => {
  try {
    const db = requireDb();
    const result = await db`SELECT * FROM doctors ORDER BY name`;
    return result.map((r: any) => ({
      id: r.id,
      name: r.name,
      image: r.image,
      specialty: r.specialty,
    }));
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return [];
  }
};
