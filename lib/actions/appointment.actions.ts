"use server";

import { revalidatePath } from "next/cache";
import sql from "../db.config";
import { formatDateTime, parseStringify } from "../utils";
import { sendEmail, appointmentConfirmationEmail, appointmentCancellationEmail } from "../email";

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

// CREATE APPOINTMENT
export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const db = requireDb();
    const id = crypto.randomUUID();
    const result = await db`
      INSERT INTO appointments (id, patient_id, user_id, primary_physician, reason, schedule, status, note)
      VALUES (${id}, ${appointment.patient}, ${appointment.userId}, ${appointment.primaryPhysician},
              ${appointment.reason}, ${appointment.schedule.toISOString()}, ${appointment.status}, ${appointment.note ?? null})
      RETURNING *
    `;
    revalidatePath("/admin");
    return parseStringify({ $id: result[0].id, ...result[0] });
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

// GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async ({
  page = 1,
  limit = 20,
}: { page?: number; limit?: number } = {}) => {
  try {
    const db = requireDb();
    const offset = (page - 1) * limit;

    const countResult = await db`SELECT COUNT(*) FROM appointments`;
    const totalCount = Number(countResult[0].count);

    const appointments = await db`
      SELECT a.*, p.name as patient_name, p.email as patient_email, p.phone as patient_phone,
             p.birth_date, p.gender, p.address, p.occupation, p.emergency_contact_name,
             p.emergency_contact_number, p.primary_physician as patient_primary_physician,
             p.insurance_provider, p.insurance_policy_number, p.allergies, p.current_medication,
             p.family_medical_history, p.past_medical_history, p.identification_type,
             p.identification_number, p.identification_document_url, p.treatment_consent,
             p.disclosure_consent, p.privacy_consent
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const mapped = appointments.map((a: any) => ({
      $id: a.id,
      id: a.id,
      patientId: a.patient_id,
      userId: a.user_id,
      primaryPhysician: a.primary_physician,
      reason: a.reason,
      schedule: a.schedule,
      status: a.status,
      note: a.note,
      cancellationReason: a.cancellation_reason,
      patient: {
        $id: a.patient_id,
        name: a.patient_name,
        email: a.patient_email,
        phone: a.patient_phone,
      },
    }));

    const scheduledCount = mapped.filter((a: any) => a.status === "scheduled").length;
    const pendingCount = mapped.filter((a: any) => a.status === "pending").length;
    const cancelledCount = mapped.filter((a: any) => a.status === "cancelled").length;

    return parseStringify({
      totalCount,
      scheduledCount,
      pendingCount,
      cancelledCount,
      documents: mapped,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("An error occurred while retrieving appointments:", error);
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const db = requireDb();
    const result = await db`
      UPDATE appointments
      SET primary_physician = ${appointment.primaryPhysician ?? null},
          schedule = ${appointment.schedule?.toISOString() ?? null},
          status = ${appointment.status},
          cancellation_reason = ${appointment.cancellationReason ?? null}
      WHERE id = ${appointmentId}
      RETURNING *
    `;

    if (result.length === 0) throw new Error("Appointment not found");

    const updated = result[0];

    const patientResult = await db`
      SELECT name, email FROM patients WHERE id = ${updated.patient_id}
    `;

    if (patientResult.length > 0 && patientResult[0].email) {
      const dateTime = formatDateTime(updated.schedule!).dateTime;
      if (type === "schedule") {
        const emailContent = appointmentConfirmationEmail({
          patientName: patientResult[0].name,
          doctorName: updated.primary_physician,
          dateTime,
        });
        await sendEmail({ to: patientResult[0].email, ...emailContent });
      } else {
        const emailContent = appointmentCancellationEmail({
          patientName: patientResult[0].name,
          doctorName: updated.primary_physician,
          dateTime,
          reason: updated.cancellation_reason,
        });
        await sendEmail({ to: patientResult[0].email, ...emailContent });
      }
    }

    revalidatePath("/admin");
    return parseStringify({ $id: updated.id, ...updated });
  } catch (error) {
    console.error("An error occurred while updating an appointment:", error);
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const db = requireDb();
    const result = await db`
      SELECT a.*, p.name as patient_name, p.email as patient_email, p.phone as patient_phone
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.id = ${appointmentId}
    `;
    if (result.length === 0) throw new Error("Appointment not found");
    const a = result[0];
    return parseStringify({
      $id: a.id,
      id: a.id,
      patientId: a.patient_id,
      userId: a.user_id,
      primaryPhysician: a.primary_physician,
      reason: a.reason,
      schedule: a.schedule,
      status: a.status,
      note: a.note,
      cancellationReason: a.cancellation_reason,
      patient: { name: a.patient_name, email: a.patient_email, phone: a.patient_phone },
    });
  } catch (error) {
    console.error("An error occurred while retrieving the appointment:", error);
  }
};

// GET PATIENT APPOINTMENTS
export const getPatientAppointments = async (userId: string) => {
  try {
    const db = requireDb();
    const result = await db`
      SELECT a.*, p.name as patient_name, p.email as patient_email
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.user_id = ${userId}
      ORDER BY a.created_at DESC
    `;
    const mapped = result.map((a: any) => ({
      $id: a.id,
      id: a.id,
      patientId: a.patient_id,
      userId: a.user_id,
      primaryPhysician: a.primary_physician,
      reason: a.reason,
      schedule: a.schedule,
      status: a.status,
      note: a.note,
      cancellationReason: a.cancellation_reason,
      patient: { name: a.patient_name, email: a.patient_email },
    }));
    return parseStringify(mapped);
  } catch (error) {
    console.error("An error occurred while retrieving patient appointments:", error);
    return [];
  }
};
