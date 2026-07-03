"use server";

import sql from "../db.config";
import { parseStringify } from "../utils";

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

export async function getAdminStats() {
  try {
    const db = requireDb();

    const [patientCount, doctorCount, statusCounts, trend] = await Promise.all([
      db`SELECT COUNT(*)::int AS count FROM patients`,
      db`SELECT COUNT(*)::int AS count FROM doctors`,
      db`
        SELECT status, COUNT(*)::int AS count
        FROM appointments
        GROUP BY status
      `,
      db`
        SELECT DATE(schedule) AS day, COUNT(*)::int AS count
        FROM appointments
        WHERE schedule >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(schedule)
        ORDER BY day
      `,
    ]);

    return parseStringify({
      totalPatients: Number(patientCount[0]?.count) || 0,
      totalDoctors: Number(doctorCount[0]?.count) || 0,
      statusBreakdown: statusCounts.reduce(
        (acc: Record<string, number>, row: any) => {
          acc[row.status] = Number(row.count);
          return acc;
        },
        {} as Record<string, number>
      ),
      trend: trend.map((row: any) => ({
        day: row.day,
        count: Number(row.count),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return null;
  }
}
