# Cloak Care

## 🤖Overview

Cloak Care is a Patient Management System web application designed to help healthcare providers manage patient information efficiently. This system allows for the easy organization, access, and communication of patient data, ensuring streamlined healthcare delivery.

<img src="./readme/homePic.png"/>

 <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Neon_DB-black?style=for-the-badge&logoColor=white&logo=neon&color=00E599" alt="neondb" />
    <img src="https://img.shields.io/badge/-Twilio-black?style=for-the-badge&logoColor=white&logo=twilio&color=F22F46" alt="twilio" />
    <img src="https://img.shields.io/badge/-ShadCN-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=000000" alt="shadcn" />
  </div>

## 🔋Features

- **Patient Registration:** Register new patients with their personal and medical information.
- **Patient Records:** View and update patient records.
- **Appointment Scheduling:** Schedule and manage patient appointments.
- **Admin Dashboard:** Manage appointments with schedule/cancel actions.
- **SMS Notifications:** Send appointment reminders and notifications via Twilio.
- **Admin Passkey Protection:** Secure admin dashboard access.

## ⚙️Tech Stack

- **Next.js 14:** React framework with App Router and Server Actions.
- **TypeScript:** Typed JavaScript for better code quality.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Neon DB:** Serverless PostgreSQL database.
- **Twilio:** Cloud communications platform for sending SMS.
- **ShadCN:** Component library built on Radix UI primitives.
- **Zod:** TypeScript-first schema declaration and validation.
- **React Hook Form:** Performant, flexible forms with easy validation.
- **TanStack Table:** Headless UI for building data tables.

## 👨🏾‍💻Installation

### Prerequisites

- Node.js (v18.x or later)
- npm or Yarn
- [Neon](https://neon.tech) account (free tier works)
- Twilio account (optional, for SMS)

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

   Create a `.env.local` file in the root of the project:

   ```env
   # NEON DB
   DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

   # TWILIO (optional)
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=

   # ADMIN
   NEXT_PUBLIC_ADMIN_PASSKEY=111111
   ```

5. **Initialize the database tables:**

   ```bash
   npx tsx -e "
   import { neon } from '@neondatabase/serverless';
   const sql = neon(process.env.DATABASE_URL);
   await sql\`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)\`;
   await sql\`CREATE TABLE IF NOT EXISTS patients (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, birth_date DATE NOT NULL, gender TEXT NOT NULL, address TEXT NOT NULL, occupation TEXT NOT NULL, emergency_contact_name TEXT NOT NULL, emergency_contact_number TEXT NOT NULL, primary_physician TEXT NOT NULL, insurance_provider TEXT NOT NULL, insurance_policy_number TEXT NOT NULL, allergies TEXT, current_medication TEXT, family_medical_history TEXT, past_medical_history TEXT, identification_type TEXT, identification_number TEXT, identification_document_url TEXT, treatment_consent BOOLEAN DEFAULT FALSE, disclosure_consent BOOLEAN DEFAULT FALSE, privacy_consent BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)\`;
   await sql\`CREATE TABLE IF NOT EXISTS appointments (id TEXT PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id), user_id TEXT NOT NULL, primary_physician TEXT NOT NULL, reason TEXT NOT NULL, schedule TIMESTAMP NOT NULL, status TEXT DEFAULT 'pending', note TEXT, cancellation_reason TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)\`;
   console.log('Tables created!');
   "
   ```

6. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🖥️Usage

### Patient Registration

1. Visit the home page and enter your name, email, and phone.
2. Complete the detailed registration form with medical information.
3. Upload identification documents (optional).

### Booking Appointments

1. After registration, select a doctor and choose a date/time.
2. Provide the reason for the appointment.
3. View the confirmation on the success page.

### Admin Dashboard

1. Click "Admin" on the home page.
2. Enter the admin passkey (default: `111111`).
3. View appointment statistics and manage bookings.
4. Schedule or cancel appointments as needed.

## 🚀Deployment

### Vercel

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables in the Vercel dashboard.
4. Deploy.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

MIT
