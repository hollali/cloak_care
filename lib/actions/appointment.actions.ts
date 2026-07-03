"use server";

import { revalidatePath } from "next/cache";
import twilio from "twilio";
import sql from "../db.config";
import { formatDateTime, parseStringify } from "../utils";

function requireDb() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  return sql;
}

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

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
export const getRecentAppointmentList = async () => {
  try {
    const db = requireDb();
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
      totalCount: mapped.length,
      scheduledCount,
      pendingCount,
      cancelledCount,
      documents: mapped,
    });
  } catch (error) {
    console.error("An error occurred while retrieving appointments:", error);
  }
};

// SEND SMS NOTIFICATION
export const sendSMSNotification = async (phone: string, content: string) => {
  try {
    if (!twilioClient) {
      console.warn("Twilio not configured - SMS not sent");
      return;
    }
    const message = await twilioClient.messages.create({
      body: content,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending SMS:", error);
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
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
      SELECT phone FROM patients WHERE id = ${updated.patient_id}
    `;

    if (patientResult.length > 0 && patientResult[0].phone) {
      const smsMessage = type === "schedule"
        ? `Your appointment is confirmed for ${formatDateTime(updated.schedule!).dateTime} with Dr. ${updated.primary_physician}`
        : `Your appointment for ${formatDateTime(updated.schedule!).dateTime} is cancelled. Reason: ${updated.cancellation_reason}`;
      await sendSMSNotification(patientResult[0].phone, smsMessage);
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
