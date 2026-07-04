import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <>
      <section className="w-full space-y-4">
        <h1 className="header">Welcome 👋</h1>
        <p className="text-dark-700">
          Start the day with managing new appointments
        </p>
      </section>

      <section className="admin-stat">
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

      <section className="w-full">
        <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
        <DataTable
          columns={columns}
          data={appointments?.documents ?? []}
          searchKey="patient"
        />
      </section>
    </>
  );
};

export default AdminPage;
