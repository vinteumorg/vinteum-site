import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  validateSession,
} from "@/lib/donations-admin/security";
import AdminConsole from "./AdminConsole";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Administration | Vinteum",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function DonationsAdminPage() {
  const jar = await cookies();
  const session = validateSession(jar.get(SESSION_COOKIE)?.value);
  // No profile/donor data is ever included in this page or its RSC payload.
  return <AdminConsole initialUsername={session?.username ?? null} />;
}
