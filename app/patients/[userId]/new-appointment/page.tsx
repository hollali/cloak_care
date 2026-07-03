import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient, getSession } from "@/lib/actions/patient.actions";
import { getDoctors } from "@/lib/actions/doctors.actions";
import { getSessionToken } from "@/lib/session";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const sessionToken = getSessionToken();
  if (!sessionToken) redirect("/");

  const session = await getSession(sessionToken);
  if (!session) redirect("/");

  const patient = await getPatient(userId);
  if (!patient) redirect(`/patients/${userId}/register`);

  const doctors = await getDoctors();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Link
            href={`/patients/${userId}/dashboard`}
            className="flex items-center gap-2 text-dark-700 hover:text-white mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Dashboard
          </Link>
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
            doctors={doctors}
          />

          <p className="copyright mt-10 py-12">© {new Date().getFullYear()} Cloak Care</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
