# Cloak Care

A healthcare patient management system designed to streamline patient registration, appointment scheduling, and medical records management for healthcare providers.

<div>
  <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
  <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  <img src="https://img.shields.io/badge/-Neon_DB-black?style=for-the-badge&logoColor=white&logo=neon&color=00E599" alt="neondb" />
  <img src="https://img.shields.io/badge/-ShadCN-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=000000" alt="shadcn" />
</div>

## Features

- **OTP Email Sign-In:** Passwordless authentication via email verification codes.
- **Patient Registration:** Register patients with personal and medical information, including document upload.
- **Appointment Booking:** Schedule appointments with doctors, choose date/time, and provide reason.
- **Patient Dashboard:** View upcoming appointments, appointment history, and primary physician info.
- **Admin Dashboard:** Manage all appointments with schedule/cancel actions, search and filter through appointments.
- **Email Notifications:** Appointment confirmation and cancellation emails via SMTP.
- **Appointment Reminders:** Automated reminder emails for upcoming appointments (24h before).
- **Admin Passkey Protection:** Secure admin dashboard access.

## Tech Stack

- **Next.js 14** — App Router, Server Actions, Middleware
- **TypeScript**
- **Tailwind CSS** + **ShadCN UI**
- **Neon DB** — Serverless PostgreSQL
- **Nodemailer** — SMTP email delivery
- **Zod** — Schema validation
- **React Hook Form**
- **TanStack Table** — Data tables with search/filter/pagination

## Installation

### Prerequisites

- Node.js v18+
- npm or yarn
- [Neon](https://neon.tech) account (free tier works)
- Gmail account with App Password (for SMTP email)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hollali/cloak_care.git
   cd cloak_care
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Neon Database:**

   - Create a project at [neon.tech](https://neon.tech)
   - Copy your connection string

4. **Configure environment variables:**

   Create a `.env.local` file:

   ```env
   # NEON DB
   DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

   # SMTP (for email)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com

   # ADMIN
   NEXT_PUBLIC_ADMIN_PASSKEY=111111
   ```

   To get a Gmail App Password:
   1. Enable 2FA at [myaccount.google.com/security](https://myaccount.google.com/security)
   2. Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   3. Copy the 16-character password into `SMTP_PASS`

5. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Database tables are created automatically on first request.

## Usage

### Patient Flow

1. Visit the home page and enter your name, email, and phone.
2. Check your email for the 6-digit verification code.
3. Complete the registration form with medical information.
4. Book an appointment with a doctor.
5. View your appointment history on the dashboard.

### Admin Flow

1. Click **Admin** on the home page.
2. Enter the admin passkey (default: `111111`).
3. View appointment statistics and manage all bookings.
4. Schedule or cancel appointments as needed.
5. Use the search bar to filter appointments by patient name.

### Appointment Reminders

The `/api/reminders` endpoint checks for appointments within the next 24 hours and sends reminder emails. Set up a cron job (e.g., cron-job.org) to hit this endpoint periodically.

## Deployment

### Vercel

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables in the Vercel dashboard.
4. Deploy.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes.
4. Push to the branch.
5. Open a pull request.

## License

MIT
