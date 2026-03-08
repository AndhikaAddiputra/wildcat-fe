/**
 * Layout for all dashboard routes (participant, committee, admin).
 * Each segment handles its own navbar/layout; this is a pass-through.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
