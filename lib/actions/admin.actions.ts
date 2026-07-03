"use server";

import { cookies } from "next/headers";

export const verifyAdminPasskey = async (passkey: string) => {
  const adminPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
  if (!adminPasskey) {
    return { success: false, error: "Admin passkey not configured" };
  }

  if (passkey !== adminPasskey) {
    return { success: false, error: "Invalid passkey" };
  }

  const cookieStore = cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 24 * 60 * 60, // 24 hours
  });

  return { success: true };
};

export const checkAdminSession = () => {
  const cookieStore = cookies();
  return cookieStore.get("admin_session")?.value === "true";
};

export const logoutAdmin = async () => {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  return { success: true };
};
