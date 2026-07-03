"use client";

import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/actions/admin.actions";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-14-medium text-dark-600 hover:text-red-500 transition-colors"
    >
      Logout
    </button>
  );
}
