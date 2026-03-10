"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Navbar,
  Footer,
} from "@/components/ui";
import { LOGO, COMMITTEE_NAV_LINKS, COMMITTEE_NAV_ACTION } from "@/config/navbar-config";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useAdminTeams, AdminTeam, TeamDocument } from "@/hooks/useAdminTeams";
import { toast } from "sonner";

// ─── Konstanta Label ──────────────────────────────────────────────────────────

const KTM_TYPES = [
  { type: "lead_ktm", label: "Leader" },
  { type: "m1_ktm", label: "Member 1" },
  { type: "m2_ktm", label: "Member 2" },
] as const;

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AdminTeam["verificationStatus"] }) {
  if (status === "Verified") {
    return (
      <span className="inline-flex items-center gap-1 text-green-400 font-semibold text-sm">
        <CheckCircle2 className="h-4 w-4" /> Verified
      </span>
    );
  }
  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1 text-red-400 font-semibold text-sm">
        <XCircle className="h-4 w-4" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-yellow-400 font-semibold text-sm">
      <Clock className="h-4 w-4" /> Pending
    </span>
  );
}

function DocLink({ doc, label }: { doc: TeamDocument | undefined; label: string }) {
  if (!doc?.exists || !doc.url) {
    return <span className="text-white/30 text-xs italic">–</span>;
  }
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-100 underline underline-offset-2 transition-colors"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function KtmDropdown({ documents }: { documents: AdminTeam["documents"] }) {
  const [open, setOpen] = useState(false);
  const items = KTM_TYPES
    .map(({ type, label }) => {
      const doc = documents.find((d) => d.type === type);
      if (!doc?.exists || !doc.url) return null;
      return { label, url: doc.url };
    })
    .filter((x): x is { label: (typeof KTM_TYPES)[number]["label"]; url: string } => x !== null);

  if (items.length === 0) {
    return <span className="text-white/30 text-xs italic">–</span>;
  }

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        className="text-xs gap-1"
        onClick={() => setOpen((o) => !o)}
      >
        Choose
        <ChevronDown className="h-3 w-3" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-full mt-1 z-20 min-w-[120px] rounded-lg border border-white/20 bg-navy py-1 shadow-lg">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                onClick={() => {
                  window.open(item.url, "_blank");
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ActionCell({
  team,
  onVerify,
}: {
  team: AdminTeam;
  onVerify: (teamId: string, action: "Verified" | "Rejected", notes?: string) => Promise<void>;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "Verified" | "Rejected") {
    setLoading(true);
    await onVerify(team.teamId, action, action === "Rejected" ? notes : undefined);
    setLoading(false);
    setRejectMode(false);
    setNotes("");
  }

  if (rejectMode) {
    return (
      <div className="flex flex-col gap-2 min-w-[180px]">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Rejection notes..."
          className="w-full rounded-lg bg-white/10 text-white text-xs p-2 outline-none resize-none h-16 border border-white/20"
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 text-xs !bg-red-600 !text-white hover:!bg-red-500"
            onClick={() => handleAction("Rejected")}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
            Reject
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 text-xs opacity-60"
            onClick={() => { setRejectMode(false); setNotes(""); }}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-w-[150px]">
      <StatusBadge status={team.verificationStatus} />
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs !bg-green-600 !text-white hover:!bg-green-500"
          onClick={() => handleAction("Verified")}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
          Admit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs !bg-red-600 !text-white hover:!bg-red-500"
          onClick={() => setRejectMode(true)}
          disabled={loading}
        >
          <XCircle className="h-3 w-3" />
          Reject
        </Button>
      </div>
    </div>
  );
}

// ─── Halaman utama ────────────────────────────────────────────────────────────

const PAGE_SIZES = [10, 20, 50];

export default function VerificationPage() {
  const { teams, loading, error, refetch, verifyTeam } = useAdminTeams();

  // Filter & pagination untuk Tabel Registration Documents
  const [docPage, setDocPage] = useState(1);
  const [docPageSize, setDocPageSize] = useState(10);
  const [docSearch, setDocSearch] = useState("");
  const [docCompFilter, setDocCompFilter] = useState("");

  const competitions = useMemo(
    () => Array.from(new Set(teams.map((t) => t.competition))).sort(),
    [teams]
  );

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchSearch =
        !docSearch ||
        t.teamName.toLowerCase().includes(docSearch.toLowerCase()) ||
        (t.institution ?? "").toLowerCase().includes(docSearch.toLowerCase());
      const matchComp = !docCompFilter || t.competition === docCompFilter;
      return matchSearch && matchComp;
    });
  }, [teams, docSearch, docCompFilter]);

  const docTotalPages = Math.max(1, Math.ceil(filteredTeams.length / docPageSize));
  const docPagedTeams = filteredTeams.slice((docPage - 1) * docPageSize, docPage * docPageSize);

  async function handleVerify(teamId: string, action: "Verified" | "Rejected", notes?: string) {
    const result = await verifyTeam(teamId, action, notes);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(
        `Team successfully ${result.actualAction === "Verified" ? "verified" : "rejected"}`
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className=" bg-[url(/background-hero-still.svg)] bg-cover">
        <Navbar
          logo={LOGO}
          links={COMMITTEE_NAV_LINKS}
          activeLink="/committee/verification"
          action={COMMITTEE_NAV_ACTION}
          mobileAction={COMMITTEE_NAV_ACTION}
        />

        {/* Hero Section */}
        <section className="relative flex pt-32 mx-auto w-[80%] items-center">
          <div className="text-left">
            <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
              Administration Verification
            </h3>
            <p className="mt-2 text-2xl font-semibold text-[#F1E1B4]">
              Verify the required documents from each team here
            </p>
          </div>
        </section>

        <main className="flex justify-center mx-auto py-12 min-h-[55vw]">
          <section className="w-[80%] flex flex-col gap-6">

            {/* ── Tabel Registration Documents ── */}
            <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
              <div className="flex flex-wrap justify-between items-center w-full gap-4">
                <h4 className="font-semibold text-[36px] text-cream">
                  Registration Documents
                </h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search */}
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => { setDocSearch(e.target.value); setDocPage(1); }}
                    placeholder="Search team / institution..."
                    className="h-[42px] px-4 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/20 placeholder:text-white/40"
                  />
                  {/* Filter kompetisi */}
                  <select
                    value={docCompFilter}
                    onChange={(e) => { setDocCompFilter(e.target.value); setDocPage(1); }}
                    className="h-[42px] px-4 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/20"
                  >
                    <option value="">All Competitions</option>
                    {competitions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Button variant="primary" size="lg" onClick={refetch} disabled={loading}>
                    <RotateCw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh
                  </Button>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-red-400 text-sm">{error}</p>
              )}

              <div className="w-full pt-8 app-table-wrapper">
                <table className="app-table">
                  <colgroup>
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "18%" }} />
                  </colgroup>
                  <thead>
                    <tr className="text-white">
                      <th>Competition</th>
                      <th>Team Name</th>
                      <th>KTM</th>
                      <th>Twibbon</th>
                      <th>Poster</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-white/50">
                          <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" />
                          Loading data...
                        </td>
                      </tr>
                    )}
                    {!loading && docPagedTeams.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-white/50">
                          No data found.
                        </td>
                      </tr>
                    )}
                    {!loading && docPagedTeams.map((team) => (
                      <tr key={team.teamId} className="border-t">
                        <td className="text-xs">{team.competition}</td>
                        <td>{team.teamName}</td>
                        <td className="action">
                          <KtmDropdown documents={team.documents} />
                        </td>
                        <td className="action">
                          <DocLink
                            doc={team.documents.find((d) => d.type === "twibbon_proof")}
                            label="Check"
                          />
                        </td>
                        <td className="action">
                          <DocLink
                            doc={team.documents.find((d) => d.type === "poster_proof")}
                            label="Check"
                          />
                        </td>
                        <td className="action">
                          <ActionCell team={team} onVerify={handleVerify} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination bar */}
                <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
                  <div className="flex items-center gap-4">
                    <span className="text-cream font-semibold">Show per page:</span>
                    <select
                      value={docPageSize}
                      onChange={(e) => { setDocPageSize(Number(e.target.value)); setDocPage(1); }}
                      className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none"
                    >
                      {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-[125px] min-w-fit"
                      onClick={() => setDocPage((p) => Math.max(1, p - 1))}
                      disabled={docPage <= 1}
                    >
                      <ChevronLeft /> Previous
                    </Button>
                    <span className="text-white font-bold text-sm">
                      {docPage} / {docTotalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-[125px] min-w-fit"
                      onClick={() => setDocPage((p) => Math.min(docTotalPages, p + 1))}
                      disabled={docPage >= docTotalPages}
                    >
                      Next <ChevronRight />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Tabel Manual Payment ── */}
            {/* API untuk data manual payment akan tersedia terpisah */}
            <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
              <div className="flex justify-between items-center w-full">
                <h4 className="font-semibold text-[36px] text-cream">
                  Manual Payment
                </h4>
              </div>
              <div className="w-full pt-8 app-table-wrapper">
                <table className="app-table">
                  <colgroup>
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                  </colgroup>
                  <thead>
                    <tr className="text-white">
                      <th>Competition</th>
                      <th>Team</th>
                      <th>Proof of Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-white/60">
                        API for manual payment data will be available separately.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
