import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { getPatient, getSession } from "@/lib/actions/patient.actions";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";
import { getDoctors } from "@/lib/actions/doctors.actions";
import { getSessionToken } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

const Dashboard = async ({ params: { userId } }: SearchParamProps) => {
  const sessionToken = getSessionToken();
  if (!sessionToken) redirect("/");

  const session = await getSession(sessionToken);
  if (!session) redirect("/");

  const patient = await getPatient(userId);
  if (!patient) redirect(`/patients/${userId}/register`);

  const appointments = await getPatientAppointments(userId);
  const doctors = await getDoctors();

  const doctorMap = new Map(doctors.map((d) => [d.name, d]));

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">My Appointments</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome, {patient.name} 👋</h1>
          <p className="text-dark-700">
            You have {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
          </p>
        </section>

        <section className="flex gap-4">
          <Button asChild className="shad-primary-btn">
            <Link href={`/patients/${userId}/new-appointment`}>
              Book New Appointment
            </Link>
          </Button>
        </section>

        <section className="w-full space-y-4">
          {appointments.length === 0 ? (
            <p className="text-dark-700">No appointments yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {appointments.map((apt: any) => {
                const doctor = doctorMap.get(apt.primaryPhysician);
                return (
                  <div
                    key={apt.$id}
                    className="flex items-center justify-between rounded-md border border-dark-500 bg-dark-400 p-4"
                  >
                    <div className="flex items-center gap-4">
                      {doctor && (
                        <Image
                          src={doctor.image}
                          alt={doctor.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-14-medium">Dr. {apt.primaryPhysician}</p>
                        <p className="text-12-regular text-dark-600">
                          {formatDateTime(apt.schedule).dateTime}
                        </p>
                        <p className="text-12-regular text-dark-600">{apt.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={apt.status} />
                      {apt.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shad-danger-btn"
                          asChild
                        >
                          <Link
                            href={`/patients/${userId}/new-appointment/success?appointmentId=${apt.$id}`}
                          >
                            Cancel
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
