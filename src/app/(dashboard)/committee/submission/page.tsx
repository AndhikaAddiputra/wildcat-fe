"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Button,
  Navbar,
  Footer,
  InlineLoader,
  Spinner,
} from "@/components/ui";
import { toast } from "sonner";
import { LOGO, COMMITTEE_NAV_LINKS, COMMITTEE_NAV_ACTION } from "@/config/navbar-config";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Download,
} from "lucide-react";
import {
  useAdminSubmissions,
  type AdminSubmissionCompetition,
  type AdminSubmissionTeam,
  type AdminSubmissionItem,
} from "@/hooks/useAdminSubmissions";
import {
  COMPETITION_DOCUMENT_COLUMNS,
  getCompetitionSlugFromName,
} from "@/lib/constants/submission-requirements";
import {
  type CommitteeStageFilter,
  getStagePairForSlug,
  labelStageForTeam,
  teamMatchesCommitteeStageFilter,
} from "@/lib/constants/stage-ids";
import { TeamDetailModal, type TeamDetailData } from "@/components/committee/TeamDetailModal";

const PAGE_SIZES = [5, 10, 20, 50];

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

function formatSubmissionDate(submissions: AdminSubmissionItem[]): string {
  const dates = submissions
    .filter((s) => s.submitted && s.submittedAt)
    .map((s) => new Date(s.submittedAt!).getTime());
  if (dates.length === 0) return "–";
  return new Date(Math.max(...dates)).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function fetchDownloadUrl(
  teamId: string,
  requirementId: string,
  filePath?: string | null
): Promise<string | null> {
  let url = `/api/admin/submissions/download?teamId=${encodeURIComponent(teamId)}&requirementId=${encodeURIComponent(requirementId)}`;
  if (filePath) {
    url += `&filePath=${encodeURIComponent(filePath)}`;
  }
  const res = await fetch(url, { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  const signedUrl = data?.signedUrl ?? data?.data?.signedUrl ?? data?.signed_url ?? data?.data?.signed_url;
  return typeof signedUrl === "string" ? signedUrl : null;
}

function CompetitionTable({
  competition,
  pageSize,
  onPageSizeChange,
  adminTeamsMap,
  onOpenTeamDetail,
}: {
  competition: AdminSubmissionCompetition;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  adminTeamsMap: Record<string, TeamDetailData>;
  onOpenTeamDetail: (team: AdminSubmissionTeam, competitionName: string) => void;
}) {
  const slug = getCompetitionSlugFromName(competition.competitionName);
  const [page, setPage] = useState(1);
  const [stageFilter, setStageFilter] = useState<CommitteeStageFilter>("all");
  const [downloading, setDownloading] = useState<string | null>(null);

  const filteredTeams = useMemo(() => {
    return competition.teams.filter((t) =>
      teamMatchesCommitteeStageFilter(t.currentStageId, stageFilter, slug)
    );
  }, [competition.teams, stageFilter, slug]);

  const documentColumns = useMemo(() => {
    if (slug && COMPETITION_DOCUMENT_COLUMNS[slug]) {
      return COMPETITION_DOCUMENT_COLUMNS[slug];
    }
    const seen = new Map<string, string>();
    for (const team of competition.teams) {
      for (const s of team.submissions) {
        if (!seen.has(s.requirementId)) {
          seen.set(s.requirementId, s.documentName);
        }
      }
    }
    return Array.from(seen.entries()).map(([requirementId, documentName]) => ({
      requirementId,
      documentName,
    }));
  }, [competition.teams, slug, competition.competitionName]);

  const totalPages = Math.max(1, Math.ceil(filteredTeams.length / pageSize));
  const pagedTeams = filteredTeams.slice((page - 1) * pageSize, page * pageSize);

  const getSubmission = (team: AdminSubmissionTeam, requirementId: string) =>
    team.submissions.find((s) => s.requirementId === requirementId);

  const stagePair = getStagePairForSlug(slug);
  const hasStageFilter = !!(stagePair.preliminary && stagePair.final);
  const missingStageData =
    hasStageFilter &&
    stageFilter !== "all" &&
    competition.teams.length > 0 &&
    competition.teams.every((t) => !(t.currentStageId ?? "").trim());

  return (
    <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start w-full">
        <div>
          <h4 className="font-semibold text-[36px] text-cream">
            {competition.competitionName}
          </h4>
          <p className="text-sm text-[#F1E1B4]/80 mt-1">
            {competition.totalTeams} team(s)
            {hasStageFilter && (
              <span className="ml-2">
                · Showing {filteredTeams.length} with current filter
              </span>
            )}
          </p>
        </div>
        {hasStageFilter && (
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label className="text-xs font-semibold text-[#F1E1B4]/90 uppercase tracking-wide">
              Filter by stage
            </label>
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value as CommitteeStageFilter);
                setPage(1);
              }}
              className="h-12 px-4 rounded-xl bg-[#1E3A8A] border border-[#F6911E]/40 text-cream font-medium outline-none focus:border-[#F6911E]"
            >
              <option value="all">All stages</option>
              <option value="preliminary">Preliminary</option>
              <option value="final">Final</option>
            </select>
          </div>
        )}
      </div>
      <div className="w-full pt-8 app-table-wrapper overflow-x-auto">
        <table className="app-table">
          <colgroup>
            <col style={{ width: "14%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            {documentColumns.map((col) => (
              <col key={col.requirementId} style={{ minWidth: "120px" }} />
            ))}
          </colgroup>
          <thead>
            <tr className="text-white">
              <th>Submission Date</th>
              <th>Team Name</th>
              <th>Institution</th>
              <th>Stage</th>
              <th>Progress</th>
              {documentColumns.map((col) => (
                <th key={col.requirementId}>{col.documentName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedTeams.length === 0 ? (
              <tr className="border-t">
                <td
                  colSpan={5 + documentColumns.length}
                  className="text-center py-8 text-white/60"
                >
                  {missingStageData ? (
                    <span className="block max-w-xl mx-auto text-sm not-italic text-[#F1E1B4]/90">
                      Tidak ada tim dengan data tahap. Pastikan backend mengirim{" "}
                      <code className="text-[#F6911E]">current_stage_id</code> (atau{" "}
                      <code className="text-[#F6911E]">currentStageId</code>) per tim pada{" "}
                      <strong className="text-white">GET /api/admin/submissions</strong> atau{" "}
                      <strong className="text-white">GET /api/admin/teams</strong>.
                    </span>
                  ) : (
                    <span className="italic">No teams match this filter.</span>
                  )}
                </td>
              </tr>
            ) : (
              pagedTeams.map((team) => (
                  <tr key={team.teamId} className="border-t">
                    <td className="text-xs">{formatSubmissionDate(team.submissions)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onOpenTeamDetail(team, competition.competitionName)}
                        className="text-left text-[#97B5ED] hover:underline font-medium cursor-pointer"
                      >
                        {team.teamName}
                      </button>
                    </td>
                    <td className="text-xs">{team.institution || "–"}</td>
                    <td className="text-xs font-medium text-[#F6911E]">
                      {labelStageForTeam(team.currentStageId, slug)}
                    </td>
                    <td className="text-xs">
                      {team.completionPercentage}% ({team.submittedCount}/{team.totalRequirements})
                    </td>
                    {documentColumns.map((col) => {
                      const sub = getSubmission(team, col.requirementId);
                      const canDownload = sub?.submitted && (sub?.fileUrl || sub?.requirementId);
                      const downloadKey = `${team.teamId}-${col.requirementId}`;
                      const isDownloading = downloading === downloadKey;
                      return (
                        <td key={col.requirementId} className="action">
                          {canDownload ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="gap-1"
                              disabled={isDownloading}
                              onClick={async () => {
                                if (sub?.fileUrl && sub.fileUrl.startsWith("http")) {
                                  window.open(sub.fileUrl, "_blank");
                                  return;
                                }
                                setDownloading(downloadKey);
                                try {
                                  const signedUrl = await fetchDownloadUrl(
                                    team.teamId,
                                    col.requirementId,
                                    sub?.fileUrl
                                  );
                                  if (signedUrl) {
                                    window.open(signedUrl, "_blank");
                                  } else {
                                    toast.error("Failed to get download link.");
                                  }
                                } catch {
                                  toast.error("Failed to get download link.");
                                } finally {
                                  setDownloading(null);
                                }
                              }}
                            >
                              {isDownloading ? (
                                <Spinner size="xs" />
                              ) : (
                                <Download size={14} />
                              )}
                              {isDownloading ? "..." : "Download"}
                            </Button>
                          ) : (
                            <span className="text-white/50 italic text-sm">Not available</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
          <div className="flex items-center gap-4">
            <span className="text-cream font-semibold">Show per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                setPage(1);
              }}
              className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              className="w-[125px] min-w-fit"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft /> Previous
            </Button>
            <span className="text-white font-bold text-sm">
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="md"
              className="w-[125px] min-w-fit"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommitteeSubmissionPage() {
  const { data, loading, error, refetch } = useAdminSubmissions();
  const [pageSizes, setPageSizes] = useState<Record<string, number>>({});
  const [adminTeamsMap, setAdminTeamsMap] = useState<Record<string, TeamDetailData>>({});
  /** Fallback stage dari GET /api/admin/teams jika GET /api/admin/submissions belum mengirim current_stage_id per tim */
  const [stageIdByTeamId, setStageIdByTeamId] = useState<Record<string, string | null>>({});
  const [teamDetailModal, setTeamDetailModal] = useState<TeamDetailData | null>(null);

  const loadAdminTeams = useCallback(() => {
    fetch("/api/admin/teams", { credentials: "include" })
      .then((res) => res.json().catch(() => ({})))
      .then((json) => {
        const list = json.data?.teams ?? json.teams ?? [];
        const map: Record<string, TeamDetailData> = {};
        const stages: Record<string, string | null> = {};
        for (const t of Array.isArray(list) ? list : []) {
          const raw = t as Record<string, unknown>;
          const normalized = normalizeTeamFromAdminList(raw);
          if (normalized.teamId) {
            map[normalized.teamId] = normalized;
            const sid = pick(raw, "currentStageId", "current_stage_id") ?? null;
            stages[normalized.teamId] = sid;
          }
        }
        setAdminTeamsMap(map);
        setStageIdByTeamId(stages);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadAdminTeams();
  }, [loadAdminTeams]);

  /** Gabungkan currentStageId: prioritas response submissions, lalu daftar teams admin */
  const dataWithStage = useMemo(() => {
    return data.map((comp) => ({
      ...comp,
      teams: comp.teams.map((team) => ({
        ...team,
        currentStageId: team.currentStageId ?? stageIdByTeamId[team.teamId] ?? null,
      })),
    }));
  }, [data, stageIdByTeamId]);

  const setPageSizeForCompetition = (competitionId: string, size: number) => {
    setPageSizes((prev) => ({ ...prev, [competitionId]: size }));
  };

  const openTeamDetail = useCallback((team: AdminSubmissionTeam, competitionName: string) => {
    const fromMap = adminTeamsMap[team.teamId];
    setTeamDetailModal({
      teamId: team.teamId,
      teamName: team.teamName,
      institution: team.institution || fromMap?.institution,
      competition: competitionName || fromMap?.competition,
      phoneNumber: fromMap?.phoneNumber,
      lineId: fromMap?.lineId,
      leadName: fromMap?.leadName,
      leadMajor: fromMap?.leadMajor,
      m1Name: fromMap?.m1Name,
      m1Major: fromMap?.m1Major,
      m2Name: fromMap?.m2Name,
      m2Major: fromMap?.m2Major,
    });
  }, [adminTeamsMap]);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="relative flex-1 bg-[url(/background-hero-still.svg)] bg-cover">
        <Navbar
          logo={LOGO}
          links={COMMITTEE_NAV_LINKS}
          activeLink="/committee/submission"
          action={COMMITTEE_NAV_ACTION}
          mobileAction={COMMITTEE_NAV_ACTION}
        />

        <section className="relative flex pt-32 mx-auto w-[80%] items-center justify-between">
          <div className="text-left">
            <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
              Participant&apos;s Submission
            </h3>
            <p className="mt-2 text-2xl font-semibold text-[#F1E1B4]">
              Download and track participant&apos;s submission here
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              refetch();
              loadAdminTeams();
            }}
            disabled={loading}
          >
            <RotateCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </section>

        <main className="flex justify-center mx-auto py-12 min-h-[55vw]">
          <section className="w-[80%] flex flex-col gap-6">
            {error && <p className="text-center text-red-300">{error}</p>}
            {loading ? (
              <div className="flex justify-center py-16">
                <InlineLoader text="Loading submissions..." size="lg" />
              </div>
            ) : dataWithStage.length === 0 ? (
              <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12 text-center">
                <p className="text-[#F1E1B4] text-lg">No submission data available.</p>
              </div>
            ) : (
              dataWithStage.map((competition) => (
                <CompetitionTable
                  key={competition.competitionId}
                  competition={competition}
                  pageSize={pageSizes[competition.competitionId] ?? 10}
                  onPageSizeChange={(size) => setPageSizeForCompetition(competition.competitionId, size)}
                  adminTeamsMap={adminTeamsMap}
                  onOpenTeamDetail={openTeamDetail}
                />
              ))
            )}
          </section>
        </main>
      </div>

      <Footer />

      <TeamDetailModal
        isOpen={!!teamDetailModal}
        onClose={() => setTeamDetailModal(null)}
        teamData={teamDetailModal}
      />
    </div>
  );
}
