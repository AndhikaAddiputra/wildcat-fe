"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useAdminTransactions, AdminTransaction } from "@/hooks/useAdminTransactions";
import { TeamDetailModal, type TeamDetailData } from "@/components/committee/TeamDetailModal";
import { toast } from "sonner";

function pick(obj: Record<string, unknown> | null | undefined, ...keys: string[]): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    const v = obj[k];
    if (v != null && typeof v === "string") return v;
  }
  return undefined;
}

function normalizeTeamFromAdminList(raw: Record<string, unknown>): TeamDetailData {
  const teamId = pick(raw, "teamId", "team_id", "id") ?? "";
  return {
    teamId,
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
  };
}

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

function PaymentProofLink({ transaction }: { transaction: AdminTransaction }) {
  const [loading, setLoading] = useState(false);
  const url = transaction.proofSignedUrl ?? transaction.paymentProofUrl ?? null;

  if (!url) {
    return <span className="text-white/30 text-xs italic">–</span>;
  }

  if (url.startsWith("http")) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-100 underline underline-offset-2 transition-colors"
      >
        Check
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  async function handleFetchAndOpen() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/transactions/${encodeURIComponent(transaction.id)}`,
        { credentials: "include" }
      );
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        data?: { paymentProofUrl?: string; signedUrl?: string; url?: string };
        paymentProofUrl?: string;
        signedUrl?: string;
        url?: string;
      };
      const signedUrl =
        data?.data?.paymentProofUrl ??
        data?.data?.signedUrl ??
        data?.data?.url ??
        data?.paymentProofUrl ??
        data?.signedUrl ??
        data?.url;
      if (signedUrl) {
        window.open(signedUrl, "_blank");
      } else {
        toast.error("Could not load preview");
      }
    } catch {
      toast.error("Could not load preview");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleFetchAndOpen}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-100 underline underline-offset-2 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Check"}
      <ExternalLink className="h-3 w-3" />
    </button>
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

function PaymentActionCell({
  transaction,
  onVerify,
}: {
  transaction: AdminTransaction;
  onVerify: (transactionId: string, teamId: string, action: "Verified" | "Rejected", notes?: string) => Promise<void>;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "Verified" | "Rejected") {
    setLoading(true);
    await onVerify(transaction.id, transaction.teamId, action, action === "Rejected" ? notes : undefined);
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
      <StatusBadge status={transaction.verificationStatus} />
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
  const { transactions, loading: txLoading, error: txError, refetch: refetchTx, verifyTransaction } = useAdminTransactions();

  const [teamDetailModal, setTeamDetailModal] = useState<TeamDetailData | null>(null);
  const [adminTeamsMap, setAdminTeamsMap] = useState<Record<string, TeamDetailData>>({});

  // Fetch /api/admin/teams (API yang sudah ada) untuk data lengkap tim
  useEffect(() => {
    fetch("/api/admin/teams", { credentials: "include" })
      .then((res) => res.json().catch(() => ({})))
      .then((json) => {
        const list = json.data?.teams ?? json.teams ?? [];
        const map: Record<string, TeamDetailData> = {};
        for (const t of Array.isArray(list) ? list : []) {
          const normalized = normalizeTeamFromAdminList(t as Record<string, unknown>);
          if (normalized.teamId) map[normalized.teamId] = normalized;
        }
        setAdminTeamsMap(map);
      })
      .catch(() => {});
  }, []);

  function openTeamDetail(row: { teamId: string; teamName: string; institution?: string; competition?: string }) {
    const fromMap = adminTeamsMap[row.teamId];
    setTeamDetailModal({
      teamId: row.teamId,
      teamName: row.teamName,
      institution: row.institution ?? fromMap?.institution,
      competition: row.competition ?? fromMap?.competition,
      phoneNumber: fromMap?.phoneNumber,
      lineId: fromMap?.lineId,
      leadName: fromMap?.leadName,
      leadMajor: fromMap?.leadMajor,
      m1Name: fromMap?.m1Name,
      m1Major: fromMap?.m1Major,
      m2Name: fromMap?.m2Name,
      m2Major: fromMap?.m2Major,
    });
  }

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

  // Filter & pagination untuk Tabel Manual Payment
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentPageSize, setPaymentPageSize] = useState(10);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentCompFilter, setPaymentCompFilter] = useState("");

  const paymentCompetitions = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.competition))).sort(),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !paymentSearch ||
        t.teamName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        (t.institution ?? "").toLowerCase().includes(paymentSearch.toLowerCase());
      const matchComp = !paymentCompFilter || t.competition === paymentCompFilter;
      return matchSearch && matchComp;
    });
  }, [transactions, paymentSearch, paymentCompFilter]);

  const paymentTotalPages = Math.max(1, Math.ceil(filteredTransactions.length / paymentPageSize));
  const paymentPagedTransactions = filteredTransactions.slice(
    (paymentPage - 1) * paymentPageSize,
    paymentPage * paymentPageSize
  );

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

  async function handleVerifyPayment(
    transactionId: string,
    teamId: string,
    action: "Verified" | "Rejected",
    notes?: string
  ) {
    const result = await verifyTransaction(transactionId, teamId, action, notes);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(
        `Payment ${result.actualAction === "Verified" ? "verified" : "rejected"}`
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
                        <td>
                          <button
                            type="button"
                            onClick={() => openTeamDetail(team)}
                            className="text-left font-medium text-blue-300 hover:text-blue-100 hover:underline underline-offset-2 transition-colors"
                          >
                            {team.teamName}
                          </button>
                        </td>
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
            <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
              <div className="flex flex-wrap justify-between items-center w-full gap-4">
                <h4 className="font-semibold text-[36px] text-cream">
                  Manual Payment
                </h4>
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => { setPaymentSearch(e.target.value); setPaymentPage(1); }}
                    placeholder="Search team / institution..."
                    className="h-[42px] px-4 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/20 placeholder:text-white/40"
                  />
                  <select
                    value={paymentCompFilter}
                    onChange={(e) => { setPaymentCompFilter(e.target.value); setPaymentPage(1); }}
                    className="h-[42px] px-4 rounded-xl bg-white/10 text-white text-sm outline-none border border-white/20"
                  >
                    <option value="">All Competitions</option>
                    {paymentCompetitions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Button variant="primary" size="lg" onClick={() => { refetch(); refetchTx(); }} disabled={txLoading}>
                    <RotateCw size={16} className={txLoading ? "animate-spin" : ""} />
                    Refresh
                  </Button>
                </div>
              </div>

              {txError && (
                <p className="mt-4 text-red-400 text-sm">{txError}</p>
              )}

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
                    {txLoading && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-white/50">
                          <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" />
                          Loading data...
                        </td>
                      </tr>
                    )}
                    {!txLoading && paymentPagedTransactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-white/50">
                          No manual payment submissions found.
                        </td>
                      </tr>
                    )}
                    {!txLoading && paymentPagedTransactions.map((tx) => (
                      <tr key={tx.id} className="border-t">
                        <td className="text-xs">{tx.competition}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => openTeamDetail(tx)}
                            className="text-left font-medium text-blue-300 hover:text-blue-100 hover:underline underline-offset-2 transition-colors"
                          >
                            {tx.teamName}
                          </button>
                        </td>
                        <td className="action">
                          <PaymentProofLink transaction={tx} />
                        </td>
                        <td className="action">
                          <PaymentActionCell transaction={tx} onVerify={handleVerifyPayment} />
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
                      value={paymentPageSize}
                      onChange={(e) => { setPaymentPageSize(Number(e.target.value)); setPaymentPage(1); }}
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
                      onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                      disabled={paymentPage <= 1}
                    >
                      <ChevronLeft /> Previous
                    </Button>
                    <span className="text-white font-bold text-sm">
                      {paymentPage} / {paymentTotalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-[125px] min-w-fit"
                      onClick={() => setPaymentPage((p) => Math.min(paymentTotalPages, p + 1))}
                      disabled={paymentPage >= paymentTotalPages}
                    >
                      Next <ChevronRight />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </main>
      </div>

      <Footer />

      {teamDetailModal && (
        <TeamDetailModal
          isOpen={!!teamDetailModal}
          onClose={() => setTeamDetailModal(null)}
          teamData={teamDetailModal}
        />
      )}
    </div>
  );
}
