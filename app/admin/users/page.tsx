import Link from "next/link";
import Image from "next/image";

import { getAllUsers } from "@/lib/actions/admin.actions";

const UsersPage = async () => {
  const users = await getAllUsers();

  return (
    <>
      <section className="w-full space-y-4">
        <h1 className="header">Users</h1>
        <p className="text-dark-700">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
      </section>

      <section className="w-full overflow-x-auto">
        <table className="w-full shad-table min-w-[600px]">
          <thead className="bg-dark-200">
            <tr className="shad-table-row-header">
              <th className="px-4 py-3 text-left text-14-medium">Name</th>
              <th className="px-4 py-3 text-left text-14-medium">Email</th>
              <th className="px-4 py-3 text-left text-14-medium">Phone</th>
              <th className="px-4 py-3 text-left text-14-medium">Profile</th>
              <th className="px-4 py-3 text-left text-14-medium">Appts</th>
              <th className="px-4 py-3 text-left text-14-medium">Joined</th>
              <th className="px-4 py-3 text-left text-14-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-dark-600"
                >
                  No users registered yet.
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr
                  key={user.id}
                  className="shad-table-row"
                >
                  <td className="px-4 py-3 text-14-medium">{user.name}</td>
                  <td className="px-4 py-3 text-14-regular">{user.email}</td>
                  <td className="px-4 py-3 text-14-regular">{user.phone}</td>
                  <td className="px-4 py-3">
                    {user.has_patient_profile ? (
                      <span className="text-green-400 text-14-medium">Complete</span>
                    ) : (
                      <span className="text-yellow-400 text-14-medium">Incomplete</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-14-regular">
                    {user.appointment_count}
                  </td>
                  <td className="px-4 py-3 text-14-regular">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-14-medium text-green-500 hover:text-green-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default UsersPage;
