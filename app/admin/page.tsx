import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { LogoutButton } from "@/components/LogoutButton";
import { AdminCharts } from "@/components/AdminCharts";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { getAdminStats } from "@/lib/actions/dashboard.actions";
import { checkAdminSession } from "@/lib/actions/admin.actions";
import { getDoctors } from "@/lib/actions/doctors.actions";

const AdminPage = async () => {
  const isAdmin = checkAdminSession();
  if (!isAdmin) redirect("/");

  const [appointments, stats, doctors] = await Promise.all([
    getRecentAppointmentList(),
    getAdminStats(),
    getDoctors(),
  ]);

  const totalAppointments =
    (appointments?.scheduledCount ?? 0) +
    (appointments?.pendingCount ?? 0) +
    (appointments?.cancelledCount ?? 0);

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
        <p className="text-16-semibold">Admin Dashboard</p>
        <LogoutButton />
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-md border border-dark-500 bg-dark-400 p-5">
            <p className="text-14-medium text-dark-600">Total Patients</p>
            <p className="text-3xl font-bold mt-1">{stats?.totalPatients ?? 0}</p>
          </div>
          <StatCard
            type="appointments"
            count={appointments?.scheduledCount ?? 0}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments?.pendingCount ?? 0}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments?.cancelledCount ?? 0}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        {stats && (
          <AdminCharts
            statusBreakdown={stats.statusBreakdown}
            trend={stats.trend}
          />
        )}

        <section className="w-full">
          <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
          <DataTable
            columns={columns}
            data={appointments?.documents ?? []}
            searchKey="patient"
          />
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
