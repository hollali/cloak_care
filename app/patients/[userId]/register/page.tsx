import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser, getSession } from "@/lib/actions/patient.actions";
import { getDoctors } from "@/lib/actions/doctors.actions";
import { getSessionToken } from "@/lib/session";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const sessionToken = getSessionToken();
  if (!sessionToken) redirect("/");

  const session = await getSession(sessionToken);
  if (!session) redirect("/");

  const user = await getUser(userId);
  if (!user) redirect("/");
  if (user.email !== session.email) redirect("/");

  const patient = await getPatient(userId);
  if (patient) redirect(`/patients/${userId}/new-appointment`);

  const doctors = await getDoctors();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Link
            href="/"
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
            Back
          </Link>
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} doctors={doctors} />

          <p className="copyright py-12">© {new Date().getFullYear()} Cloak Care</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
