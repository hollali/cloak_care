import { cookies } from "next/headers";

export function getSessionToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get("session_token")?.value ?? null;
}
