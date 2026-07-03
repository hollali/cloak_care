import nodemailer from "nodemailer";

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!transporter) {
    console.warn("SMTP not configured — email not sent");
    return null;
  }
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    return null;
  }
}

export function appointmentConfirmationEmail({
  patientName,
  doctorName,
  dateTime,
}: {
  patientName: string;
  doctorName: string;
  dateTime: string;
}) {
  return {
    subject: "Appointment Confirmed — Cloak Care",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Your appointment is confirmed</h2>
        <p>Hi ${patientName},</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been scheduled for:</p>
        <p style="font-size: 18px; font-weight: bold;">${dateTime}</p>
        <p>If you need to reschedule or cancel, please contact your provider.</p>
        <hr/>
        <p style="color: #888;">Cloak Care — Healthcare Patient Management</p>
      </div>
    `,
  };
}

export function appointmentCancellationEmail({
  patientName,
  doctorName,
  dateTime,
  reason,
}: {
  patientName: string;
  doctorName: string;
  dateTime: string;
  reason?: string;
}) {
  return {
    subject: "Appointment Cancelled — Cloak Care",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Appointment cancelled</h2>
        <p>Hi ${patientName},</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> on <strong>${dateTime}</strong> has been cancelled.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ""}
        <p>Please book a new appointment at your convenience.</p>
        <hr/>
        <p style="color: #888;">Cloak Care — Healthcare Patient Management</p>
      </div>
    `,
  };
}

export function otpEmail({ code }: { code: string }) {
  return {
    subject: "Your verification code — Cloak Care",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; text-align: center;">
        <h2>Verification code</h2>
        <p>Use the code below to sign in:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">${code}</p>
        <p style="color: #888;">This code expires in 10 minutes.</p>
        <hr/>
        <p style="color: #888;">Cloak Care — Healthcare Patient Management</p>
      </div>
    `,
  };
}
