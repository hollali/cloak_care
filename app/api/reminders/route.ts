import { NextResponse } from "next/server";
import sql from "@/lib/db.config";
import { sendEmail, appointmentConfirmationEmail } from "@/lib/email";

export async function GET() {
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const upcoming = await sql`
      SELECT a.id, a.schedule, a.primary_physician, a.reason,
             p.name AS patient_name, p.email AS patient_email
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.status = 'scheduled'
        AND a.schedule > NOW()
        AND a.schedule <= NOW() + INTERVAL '24 hours'
      ORDER BY a.schedule
    `;

    const results: { appointmentId: string; email: string; sent: boolean }[] = [];

    for (const apt of upcoming) {
      try {
        const dateTime = new Date(apt.schedule).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

        const emailContent = appointmentConfirmationEmail({
          patientName: apt.patient_name,
          doctorName: apt.primary_physician,
          dateTime,
        });

        await sendEmail({
          to: apt.patient_email,
          ...emailContent,
        });

        results.push({
          appointmentId: apt.id,
          email: apt.patient_email,
          sent: true,
        });
      } catch {
        results.push({
          appointmentId: apt.id,
          email: apt.patient_email,
          sent: false,
        });
      }
    }

    return NextResponse.json({ reminded: results.length, results });
  } catch (error) {
    console.error("Reminder check failed:", error);
    return NextResponse.json(
      { error: "Reminder check failed" },
      { status: 500 }
    );
  }
}
