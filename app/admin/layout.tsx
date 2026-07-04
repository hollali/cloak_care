import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/LogoutButton";
import { checkAdminSession } from "@/lib/actions/admin.actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = checkAdminSession();
  if (!isAdmin) redirect("/");

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

        <nav className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-14-medium text-dark-600 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="text-14-medium text-dark-600 hover:text-white transition-colors"
          >
            Users
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <main className="admin-main">{children}</main>
    </div>
  );
}
