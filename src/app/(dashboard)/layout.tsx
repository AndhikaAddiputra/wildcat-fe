import { ContactFAB } from "@/components/shared/ContactFAB";

/**
 * Layout for all dashboard routes (participant, committee, admin).
 * Each segment handles its own navbar/layout; this is a pass-through.
 * ContactFAB muncul di halaman yang punya kontak person (home, teams, administration, events, submission).
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ContactFAB />
    </>
  );
}
