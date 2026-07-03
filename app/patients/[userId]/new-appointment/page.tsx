import Image from "next/image";
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
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
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
