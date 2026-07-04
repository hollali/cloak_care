import Link from "next/link";
import Image from "next/image";

import { StatusBadge } from "@/components/StatusBadge";
import { getUserWithDetails } from "@/lib/actions/admin.actions";
import { formatDateTime } from "@/lib/utils";
import { getDoctors } from "@/lib/actions/doctors.actions";

const UserDetailPage = async ({
  params: { userId },
}: SearchParamProps) => {
  const [data, doctors] = await Promise.all([
    getUserWithDetails(userId),
    getDoctors(),
  ]);

  if (!data) {
    return (
      <section className="w-full space-y-4 text-center py-20">
        <p className="text-dark-600">User not found.</p>
        <Link href="/admin/users" className="text-green-500 hover:text-green-400">
          Back to Users
        </Link>
      </section>
    );
  }

  const { user, patient, appointments } = data;
  const doctorMap = new Map(doctors.map((d) => [d.name, d]));

  return (
    <>
      <section className="w-full space-y-4">
        <Link
          href="/admin/users"
          className="text-14-medium text-dark-600 hover:text-white inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Users
        </Link>
        <h1 className="header">{user.name}</h1>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="rounded-md border border-dark-500 bg-dark-400 p-5 space-y-4">
          <h2 className="text-lg font-semibold">User Info</h2>
          <div className="space-y-2 text-14-regular">
            <div className="flex justify-between">
              <span className="text-dark-600">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600">Phone</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600">Joined</span>
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600">Patient Profile</span>
              <span className={patient ? "text-green-400" : "text-yellow-400"}>
                {patient ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>
        </div>

        {patient && (
          <div className="rounded-md border border-dark-500 bg-dark-400 p-5 space-y-4">
            <h2 className="text-lg font-semibold">Patient Profile</h2>
            <div className="space-y-2 text-14-regular">
              <div className="flex justify-between">
                <span className="text-dark-600">Gender</span>
                <span>{patient.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Date of Birth</span>
                <span>{new Date(patient.birth_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Primary Physician</span>
                <span>Dr. {patient.primary_physician}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Insurance</span>
                <span>
                  {patient.insurance_provider}{" "}
                  {patient.insurance_policy_number && `(${patient.insurance_policy_number})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Address</span>
                <span className="text-right max-w-[200px]">{patient.address}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="w-full space-y-4">
        <h2 className="text-lg font-semibold">
          Appointment History ({appointments.length})
        </h2>
        {appointments.length === 0 ? (
          <p className="text-dark-600">No appointments.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((apt: any) => {
              const doctor = doctorMap.get(apt.primary_physician);
              return (
                <div
                  key={apt.id}
                  className="flex items-center justify-between rounded-md border border-dark-500 bg-dark-400 p-4"
                >
                  <div className="flex items-center gap-4">
                    {doctor && (
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-14-medium">Dr. {apt.primary_physician}</p>
                      <p className="text-12-regular text-dark-600">
                        {formatDateTime(apt.schedule).dateTime}
                      </p>
                      <p className="text-12-regular text-dark-600">{apt.reason}</p>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default UserDetailPage;
