"use client";

import { useState, useEffect, useCallback } from "react";

function normalizeItem(raw: Record<string, unknown>): AdminSubmissionItem {
  return {
    requirementId: (raw.requirementId ?? raw.requirement_id ?? "") as string,
    documentName: (raw.documentName ?? raw.document_name ?? "") as string,
    submitted: (raw.submitted ?? false) as boolean,
    isValid: (raw.isValid ?? raw.is_valid ?? true) as boolean,
    submittedAt: (raw.submittedAt ?? raw.submitted_at ?? null) as string | null,
    fileUrl: (raw.fileUrl ?? raw.file_url ?? null) as string | null,
  };
}

function normalizeTeam(raw: Record<string, unknown>): AdminSubmissionTeam {
  const submissions = Array.isArray(raw.submissions)
    ? (raw.submissions as Record<string, unknown>[]).map(normalizeItem)
    : [];
  return {
    teamId: (raw.teamId ?? raw.team_id ?? "") as string,
    teamName: (raw.teamName ?? raw.team_name ?? "") as string,
    institution: (raw.institution ?? "") as string,
    submissions,
    totalRequirements: (raw.totalRequirements ?? raw.total_requirements ?? submissions.length) as number,
    submittedCount: (raw.submittedCount ?? raw.submitted_count ?? 0) as number,
    completionPercentage: (raw.completionPercentage ?? raw.completion_percentage ?? 0) as number,
  };
}

function normalizeCompetition(raw: Record<string, unknown>): AdminSubmissionCompetition {
  const teams = Array.isArray(raw.teams)
    ? (raw.teams as Record<string, unknown>[]).map(normalizeTeam)
    : [];
  return {
    competitionId: (raw.competitionId ?? raw.competition_id ?? "") as string,
    competitionName: (raw.competitionName ?? raw.competition_name ?? "") as string,
    totalTeams: (raw.totalTeams ?? raw.total_teams ?? teams.length) as number,
    teams,
  };
}

function normalizeResponse(data: unknown): AdminSubmissionCompetition[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => normalizeCompetition(item as Record<string, unknown>));
}

export interface AdminSubmissionItem {
  requirementId: string;
  documentName: string;
  submitted: boolean;
  isValid: boolean;
  submittedAt: string | null;
  fileUrl: string | null;
}

export interface AdminSubmissionTeam {
  teamId: string;
  teamName: string;
  institution: string;
  submissions: AdminSubmissionItem[];
  totalRequirements: number;
  submittedCount: number;
  completionPercentage: number;
}

export interface AdminSubmissionCompetition {
  competitionId: string;
  competitionName: string;
  totalTeams: number;
  teams: AdminSubmissionTeam[];
}

interface AdminSubmissionsResponse {
  success?: boolean;
  data?: AdminSubmissionCompetition[];
  error?: string;
}

/**
 * Hook to fetch all teams' submissions grouped by competition.
 * Uses GET /api/admin/submissions.
 */
export function useAdminSubmissions() {
  const [data, setData] = useState<AdminSubmissionCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions", { credentials: "include" });
      const json = (await res.json().catch(() => ({}))) as AdminSubmissionsResponse;
      if (!res.ok) {
        setError(json.error ?? "Failed to load submissions");
        setData([]);
      } else {
        setData(normalizeResponse(json.data ?? []));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load submissions");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
