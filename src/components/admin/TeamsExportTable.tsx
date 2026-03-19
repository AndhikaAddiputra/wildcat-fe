"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, CardLarge, Navbar, Footer } from "@/components/ui";
import { Download, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

function pick(obj: Record<string, unknown> | null | undefined, ...keys: string[]): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    const v = obj[k];
    if (v != null && typeof v === "string") return v;
  }
  return undefined;
}

export interface TeamExportRow {
  id: string;
  teamName: string;
  institution?: string;
  competition?: string;
  phoneNumber?: string;
  lineId?: string;
  leadName?: string;
  leadMajor?: string;
  m1Name?: string;
  m1Major?: string;
  m2Name?: string;
  m2Major?: string;
  createdAt?: string;
  paymentStatus?: string;
}

function normalizeTeam(raw: Record<string, unknown>): TeamExportRow {
  const status = raw.status;
  const paymentStatus: string | undefined =
    (typeof status === "object" && status ? pick(status as Record<string, unknown>, "paymentStatus", "payment_status") : undefined) ??
    (typeof status === "string" ? status : undefined);
  return {
    id: pick(raw, "id", "teamId", "team_id") ?? "",
    teamName: pick(raw, "teamName", "team_name") ?? "-",
    institution: pick(raw, "institution", "institution_name"),
    competition: pick(raw, "competition", "competitionName", "competition_name"),
    phoneNumber: pick(raw, "phoneNumber", "phone_number", "phone"),
    lineId: pick(raw, "lineId", "line_id", "line"),
    leadName: pick(raw, "leadName", "lead_name", "leaderName", "leader_name"),
    leadMajor: pick(raw, "leadMajor", "lead_major", "leaderMajor", "leader_major"),
    m1Name: pick(raw, "m1Name", "m1_name"),
    m1Major: pick(raw, "m1Major", "m1_major"),
    m2Name: pick(raw, "m2Name", "m2_name"),
    m2Major: pick(raw, "m2Major", "m2_major"),
    createdAt: pick(raw, "createdAt", "created_at"),
    paymentStatus: paymentStatus ?? (status as unknown as string),
  };
}

function escapeCsvCell(val: string | undefined): string {
  if (val == null || val === "") return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const COLUMNS: { key: keyof TeamExportRow; label: string }[] = [
  { key: "teamName", label: "Team Name" },
  { key: "institution", label: "Institution" },
  { key: "competition", label: "Competition" },
  { key: "leadName", label: "Leader Name" },
  { key: "leadMajor", label: "Leader Major" },
  { key: "m1Name", label: "Member 1 Name" },
  { key: "m1Major", label: "Member 1 Major" },
  { key: "m2Name", label: "Member 2 Name" },
  { key: "m2Major", label: "Member 2 Major" },
  { key: "phoneNumber", label: "Phone" },
  { key: "lineId", label: "LINE ID" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "createdAt", label: "Created At" },
];

export interface TeamsExportTableProps {
  title: string;
  navLinks: { label: string; href: string }[];
  activeLink: string;
  navAction: React.ReactNode;
  logo: React.ReactNode;
}

export function TeamsExportTable({
  title,
  navLinks,
  activeLink,
  navAction,
  logo,
}: TeamsExportTableProps) {
  const [teams, setTeams] = useState<TeamExportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth("/api/admin/teams", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      const list = data.data?.teams ?? data.teams ?? [];
      const normalized = (Array.isArray(list) ? list : []).map((t: Record<string, unknown>) => normalizeTeam(t));
      setTeams(normalized);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const totalPages = Math.max(1, Math.ceil(teams.length / pageSize));
  const paginated = teams.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCsv = () => {
    const headers = COLUMNS.map((c) => c.label).join(",");
    const rows = teams.map((t) =>
      COLUMNS.map((c) => {
        const v = t[c.key];
        if (c.key === "createdAt") return escapeCsvCell(formatDate(v as string));
        return escapeCsvCell(v as string | undefined);
      }).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Wildcat-Teams-Export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A2D6E] text-white">
      <Navbar logo={logo} links={navLinks} activeLink={activeLink} action={navAction} mobileAction={navAction} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-16">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-[#F6911E]">{title}</h1>
          <p className="mt-1 text-[#F1E1B4]">Data keseluruhan tim yang mendaftar</p>
        </section>

        <CardLarge className="p-6 bg-[#0A2D6E]/90 border-[#F6911E]/30">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[#F1E1B4]">Teams Spreadsheet</h2>
            <div className="flex gap-2">
              <Button variant="secondary" size="md" onClick={loadTeams} disabled={loading}>
                <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="primary" size="md" onClick={handleExportCsv} disabled={loading || teams.length === 0}>
                <Download className="h-4 w-4" />
                Export to CSV
              </Button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className="overflow-x-auto rounded-xl border border-white/20">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="bg-[#3c3f9e] text-[#F1E1B4]">
                  <th className="px-3 py-3 text-left font-semibold">#</th>
                  {COLUMNS.map((c) => (
                    <th key={c.key} className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={COLUMNS.length + 1} className="px-4 py-12 text-center text-[#F1E1B4]/70">
                      Loading...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length + 1} className="px-4 py-12 text-center text-[#F1E1B4]/70">
                      No team data found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((t, i) => (
                    <tr key={t.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-3 py-2 text-[#F1E1B4]/70">{(page - 1) * pageSize + i + 1}</td>
                      {COLUMNS.map((c) => (
                        <td key={c.key} className="px-3 py-2 text-[#F1E1B4] max-w-[180px] truncate" title={String(t[c.key] ?? "")}>
                          {c.key === "createdAt" ? formatDate(t.createdAt) : (t[c.key] as string) ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {teams.length > 0 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-[#F1E1B4]">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-[#1E3A8A] text-white rounded-lg px-2 py-1 border border-white/20"
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span>per page. Total: {teams.length} teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-[#F1E1B4]">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardLarge>
      </main>
      <Footer />
    </div>
  );
}
