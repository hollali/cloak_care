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

  const [appointments, doctors] = await Promise.all([
    getPatientAppointments(userId),
    getDoctors(),
  ]);

  const doctorMap = new Map(doctors.map((d) => [d.name, d]));

  const upcoming = appointments
    .filter((a: any) => a.status !== "cancelled")
    .sort(
      (a: any, b: any) =>
        new Date(a.schedule).getTime() - new Date(b.schedule).getTime()
    )[0] || null;

  const upcomingDoctor = upcoming
    ? doctorMap.get(upcoming.primaryPhysician) || null
    : null;

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a: any) => a.status === "scheduled").length,
    pending: appointments.filter((a: any) => a.status === "pending").length,
    cancelled: appointments.filter((a: any) => a.status === "cancelled").length,
  };

  const primaryDoctor = patient.primary_physician
    ? doctors.find((d) => d.name === patient.primary_physician)
    : null;

  const sortedAppointments = [...appointments].sort(
    (a: any, b: any) =>
      new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
  );

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
        <p className="text-16-semibold">My Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-2">
          <h1 className="header">Welcome, {patient.name} 👋</h1>
          <p className="text-dark-700">Here&apos;s your health overview</p>
        </section>

        {primaryDoctor && (
          <section className="flex items-center gap-4 rounded-md border border-dark-500 bg-dark-400 p-5">
            <Image
              src={primaryDoctor.image}
              alt={primaryDoctor.name}
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <p className="text-sm text-dark-600">Your Primary Physician</p>
              <p className="text-lg font-semibold">
                Dr. {primaryDoctor.name}
              </p>
              <p className="text-sm text-dark-600">{primaryDoctor.specialty}</p>
            </div>
          </section>
        )}

        {upcoming && (
          <section className="rounded-md border border-green-500/30 bg-green-500/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-green-400">
                Next Appointment
              </h3>
              <StatusBadge status={upcoming.status} />
            </div>
            <div className="flex items-center gap-4">
              {upcomingDoctor && (
                <Image
                  src={upcomingDoctor.image}
                  alt={upcoming.primaryPhysician}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-semibold">
                  Dr. {upcoming.primaryPhysician}
                </p>
                <p className="text-sm text-dark-600">
                  {formatDateTime(upcoming.schedule).dateTime}
                </p>
                <p className="text-sm text-dark-600">{upcoming.reason}</p>
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-md border border-dark-500 bg-dark-400 p-5">
            <p className="text-14-medium text-dark-600">Total</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="rounded-md border border-dark-500 bg-dark-400 p-5">
            <p className="text-14-medium text-dark-600">Upcoming</p>
            <p className="text-3xl font-bold mt-1 text-green-400">
              {stats.scheduled}
            </p>
          </div>
          <div className="rounded-md border border-dark-500 bg-dark-400 p-5">
            <p className="text-14-medium text-dark-600">Pending</p>
            <p className="text-3xl font-bold mt-1 text-yellow-400">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-md border border-dark-500 bg-dark-400 p-5">
            <p className="text-14-medium text-dark-600">Cancelled</p>
            <p className="text-3xl font-bold mt-1 text-red-400">
              {stats.cancelled}
            </p>
          </div>
        </section>

        <section className="flex gap-4">
          <Button asChild className="shad-primary-btn">
            <Link href={`/patients/${userId}/new-appointment`}>
              Book New Appointment
            </Link>
          </Button>
        </section>

        <section className="w-full space-y-4">
          <h2 className="text-xl font-semibold">
            Appointment History
          </h2>
          {sortedAppointments.length === 0 ? (
            <p className="text-dark-700">No appointments yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedAppointments.map((apt: any) => {
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
                          width={44}
                          height={44}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-14-medium">
                          Dr. {apt.primaryPhysician}
                        </p>
                        <p className="text-12-regular text-dark-600">
                          {formatDateTime(apt.schedule).dateTime}
                        </p>
                        <p className="text-12-regular text-dark-600">
                          {apt.reason}
                        </p>
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
