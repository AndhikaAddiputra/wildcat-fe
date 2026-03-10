"use client";

import { useState, useMemo } from "react";
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
import { useAdminSubmissions, type AdminSubmissionCompetition, type AdminSubmissionTeam, type AdminSubmissionItem } from "@/hooks/useAdminSubmissions";

const PAGE_SIZES = [5, 10, 20, 50];

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
}: {
  competition: AdminSubmissionCompetition;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}) {
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState<string | null>(null);
  const documentColumns = useMemo(() => {
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
  }, [competition.teams]);

  const totalPages = Math.max(1, Math.ceil(competition.teams.length / pageSize));
  const pagedTeams = competition.teams.slice((page - 1) * pageSize, page * pageSize);

  const getSubmission = (team: AdminSubmissionTeam, requirementId: string) =>
    team.submissions.find((s) => s.requirementId === requirementId);

  return (
    <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
      <div className="flex justify-between items-center w-full">
        <div>
          <h4 className="font-semibold text-[36px] text-cream">
            {competition.competitionName}
          </h4>
          <p className="text-sm text-[#F1E1B4]/80 mt-1">
            {competition.totalTeams} team(s)
          </p>
        </div>
      </div>
      <div className="w-full pt-8 app-table-wrapper overflow-x-auto">
        <table className="app-table">
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
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
              <th>Progress</th>
              {documentColumns.map((col) => (
                <th key={col.requirementId}>{col.documentName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedTeams.map((team) => (
              <tr key={team.teamId} className="border-t">
                <td className="text-xs">{formatSubmissionDate(team.submissions)}</td>
                <td>{team.teamName}</td>
                <td className="text-xs">{team.institution || "–"}</td>
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
            ))}
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
                <option key={s} value={s}>{s}</option>
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

  const setPageSizeForCompetition = (competitionId: string, size: number) => {
    setPageSizes((prev) => ({ ...prev, [competitionId]: size }));
  };

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

        {/* Hero Section */}
        <section className="relative flex pt-32 mx-auto w-[80%] items-center justify-between">
          <div className="text-left">
            <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
              Participant&apos;s Submission
            </h3>
            <p className="mt-2 text-2xl font-semibold text-[#F1E1B4]">
              Download and track participant&apos;s submission here
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={refetch} disabled={loading}>
            <RotateCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </section>

        <main className="flex justify-center mx-auto py-12 min-h-[55vw]">
          <section className="w-[80%] flex flex-col gap-6">
            {error && (
              <p className="text-center text-red-300">{error}</p>
            )}
            {loading ? (
              <div className="flex justify-center py-16">
                <InlineLoader text="Loading submissions..." size="lg" />
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12 text-center">
                <p className="text-[#F1E1B4] text-lg">No submission data available.</p>
              </div>
            ) : (
              data.map((competition) => (
                <CompetitionTable
                  key={competition.competitionId}
                  competition={competition}
                  pageSize={pageSizes[competition.competitionId] ?? 10}
                  onPageSizeChange={(size) => setPageSizeForCompetition(competition.competitionId, size)}
                />
              ))
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
