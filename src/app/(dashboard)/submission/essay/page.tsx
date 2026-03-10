"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  CardLarge,
  CardHeader,
  CardTitle,
  CardFooter,
  Navbar,
  Footer,
  Spinner,
} from "@/components/ui";
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { submitFiles } from "@/services/submission.service";
import { SUBMISSION_REQUIREMENTS } from "@/lib/constants/submission-requirements";
import { useSubmissionGuard } from "@/hooks/useSubmissionGuard";
import { useTeamProfile } from "@/hooks/useTeamProfile";
import { useSubmittedFiles } from "@/hooks/useSubmittedFiles";

export default function EssaySubmissionPage() {
  const { data: teamData } = useTeamProfile();
  const teamId = teamData?.teamId ?? "";
  const { checking } = useSubmissionGuard("high-school-essay");
  const { save: saveFile, clear: clearFile, get: getFile } = useSubmittedFiles(teamId || undefined);

  /** Buat callback fetchSignedUrl lazy untuk submission (GET /submissions/:requirementId). */
  const makeSubmissionFetcher = (requirementId: string) => async (): Promise<string> => {
    const res = await fetch(`/api/submissions/${encodeURIComponent(requirementId)}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || !data?.data?.signedUrl) {
      throw new Error(data?.error ?? "Failed to get preview URL");
    }
    return data.data.signedUrl as string;
  };

  const [submitting, setSubmitting] = useState(false);
  const [abstract, setAbstract] = useState<File | null>(null);
  const [fullEssay, setFullEssay] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!abstract || !fullEssay) {
      toast.error("Please select Abstract and Full Essay files.");
      return;
    }
    setSubmitting(true);
    try {
      const results = await submitFiles(teamId, [
        { requirementId: SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT, file: abstract },
        { requirementId: SUBMISSION_REQUIREMENTS.FULL_ESSAY, file: fullEssay },
      ]);
      const failed = results.filter((r) => !r.success);
      const succeeded = results.filter((r) => r.success);
      for (const r of succeeded) {
        if (r.filePath) saveFile(r.requirementId, r.fileName, r.filePath);
      }
      if (succeeded.find((r) => r.requirementId === SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT)) setAbstract(null);
      if (succeeded.find((r) => r.requirementId === SUBMISSION_REQUIREMENTS.FULL_ESSAY)) setFullEssay(null);
      if (failed.length === 0) {
        toast.success("Submission sent successfully.");
      } else {
        failed.forEach((r) => toast.error(`${r.fileName}: ${r.error ?? "Upload failed"}`));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white">
      <Navbar
        logo={LOGO}
        links={PARTICIPANT_NAV_LINKS}
        activeLink="/submission"
        action={PARTICIPANT_NAV_ACTION}
        mobileAction={PARTICIPANT_NAV_ACTION}
      />

      {/* Hero Section */}
      <section className="relative flex pt-36 pb-8 justify-center pt-20 px-4">
        <div className="w-full max-w-6xl mx-auto text-left">
          <h3 className="text-3xl sm:text-4xl md:text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Submission
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#F1E1B4]">
            Submit your work here!
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-0">
        <section className="w-full max-w-6xl flex flex-col gap-8 sm:gap-10">

          {/* Preliminary Stage */}
          <CardLarge className="w-full max-w-full">
            <CardHeader className="p-4 sm:p-6 md:p-8">
              <CardTitle className="w-full max-w-[95%] mx-auto mb-4 text-2xl sm:text-3xl md:text-[36px] font-semibold !text-cream">
                Preliminary Stage
              </CardTitle>
              <div className="flex flex-col md:flex-row md:justify-between gap-4 w-full max-w-[95%] mx-auto">
                <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                  <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Abstract*</span>
                  <FileUploadZone
                    value={abstract}
                    onChange={setAbstract}
                    className="flex-1 min-h-0"
                    zoneClassName="min-h-[240px] flex-1"
                    disabled={submitting}
                    uploadedUrl={getFile(SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT)?.url}
                    uploadedFileName={getFile(SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT)?.fileName}
                    onClearUploaded={() => clearFile(SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT)}
                    fetchSignedUrl={getFile(SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT) ? makeSubmissionFetcher(SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT) : undefined}
                  />
                </div>
                <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                  <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Full Essay*</span>
                  <FileUploadZone
                    value={fullEssay}
                    onChange={setFullEssay}
                    className="flex-1 min-h-0"
                    zoneClassName="min-h-[240px] flex-1"
                    disabled={submitting}
                    uploadedUrl={getFile(SUBMISSION_REQUIREMENTS.FULL_ESSAY)?.url}
                    uploadedFileName={getFile(SUBMISSION_REQUIREMENTS.FULL_ESSAY)?.fileName}
                    onClearUploaded={() => clearFile(SUBMISSION_REQUIREMENTS.FULL_ESSAY)}
                    fetchSignedUrl={getFile(SUBMISSION_REQUIREMENTS.FULL_ESSAY) ? makeSubmissionFetcher(SUBMISSION_REQUIREMENTS.FULL_ESSAY) : undefined}
                  />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end mx-auto p-4 sm:p-6 w-full max-w-[95%]">
              <Button variant="primary" size="lg" className="w-full mx-auto" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><Spinner size="xs" /> Submitting…</> : "Submit"}
              </Button>
            </CardFooter>
          </CardLarge>

        </section>
      </main>

      <Footer />
    </div>
  );
}
