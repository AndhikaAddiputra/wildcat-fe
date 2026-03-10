"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Spinner,
  CardLarge,
  CardHeader,
  CardTitle,
  CardFooter,
  Navbar,
  Footer,
} from "@/components/ui";
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { submitFile } from "@/services/submission.service";
import { SUBMISSION_REQUIREMENTS } from "@/lib/constants/submission-requirements";
import { COMPETITION_STAGE_IDS, isInFinalStage } from "@/lib/constants/stage-ids";
import { useSubmissionGuard } from "@/hooks/useSubmissionGuard";
import { useTeamProfile } from "@/hooks/useTeamProfile";
import { useSubmittedFiles } from "@/hooks/useSubmittedFiles";
import { cn } from "@/lib/utils";

export default function BCCSubmissionPage() {
  const { data: teamData } = useTeamProfile();
  const teamId = teamData?.teamId ?? "";
  const { checking } = useSubmissionGuard("business-case");
  const { save: saveFile, clear: clearFile, get: getFile } = useSubmittedFiles(teamId || undefined);

  const inFinal = isInFinalStage(teamData?.currentStageId, COMPETITION_STAGE_IDS.BCC_FINAL);

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
  const [businessProposal, setBusinessProposal] = useState<File | null>(null);
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);

  const submitPreliminary = async () => {
    if (!businessProposal) {
      toast.error("Please select Business Proposal file.");
      return;
    }
    setSubmitting(true);
    try {
      const { filePath } = await submitFile(teamId, SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL, businessProposal);
      saveFile(SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL, businessProposal.name, filePath);
      setBusinessProposal(null);
      toast.success("Preliminary stage sent successfully.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitFinal = async () => {
    if (!pitchDeck) {
      toast.error("Please select Pitch Deck file.");
      return;
    }
    setSubmitting(true);
    try {
      const { filePath } = await submitFile(teamId, SUBMISSION_REQUIREMENTS.PITCH_DECK, pitchDeck);
      saveFile(SUBMISSION_REQUIREMENTS.PITCH_DECK, pitchDeck.name, filePath);
      setPitchDeck(null);
      toast.success("Final stage sent successfully.");
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
              <div className="w-full max-w-[95%] min-h-[320px] sm:min-h-[425px] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Business Proposal*</span>
                <FileUploadZone
                  value={businessProposal}
                  onChange={setBusinessProposal}
                  zoneClassName="flex-1 min-h-[240px] sm:min-h-[300px]"
                  disabled={submitting}
                  uploadedUrl={getFile(SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL)?.url}
                  uploadedFileName={getFile(SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL)?.fileName}
                  onClearUploaded={() => clearFile(SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL)}
                  fetchSignedUrl={getFile(SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL) ? makeSubmissionFetcher(SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL) : undefined}
                />
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end mx-auto p-4 sm:p-6 w-full max-w-[95%]">
              <Button variant="primary" size="lg" className="w-full mx-auto" onClick={submitPreliminary} disabled={submitting}>
                {submitting ? <><Spinner size="xs" /> Submitting…</> : "Submit"}
              </Button>
            </CardFooter>
          </CardLarge>

          {/* Final Stage */}
          <CardLarge className={cn("w-full max-w-full transition-opacity", !inFinal && "opacity-75")}>
            <CardHeader className="p-4 sm:p-6 md:p-8 relative">
              {!inFinal && (
                <div className="absolute inset-0 z-10 rounded-[20px] bg-[#0A2D6E]/80 flex items-center justify-center">
                  <p className="text-[#F1E1B4] font-semibold text-center px-4 max-w-md">
                    Final stage akan terbuka setelah tim Anda lulus ke babak final.
                  </p>
                </div>
              )}
              <CardTitle className="w-full max-w-[95%] mx-auto mb-4 text-2xl sm:text-3xl md:text-[36px] font-semibold !text-cream">
                Final Stage
              </CardTitle>
              <div className="w-full max-w-[95%] min-h-[320px] sm:min-h-[425px] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Pitch Deck*</span>
                <FileUploadZone
                  value={pitchDeck}
                  onChange={setPitchDeck}
                  zoneClassName="flex-1 min-h-[240px] sm:min-h-[300px]"
                  disabled={submitting || !inFinal}
                  uploadedUrl={getFile(SUBMISSION_REQUIREMENTS.PITCH_DECK)?.url}
                  uploadedFileName={getFile(SUBMISSION_REQUIREMENTS.PITCH_DECK)?.fileName}
                  onClearUploaded={() => clearFile(SUBMISSION_REQUIREMENTS.PITCH_DECK)}
                  fetchSignedUrl={getFile(SUBMISSION_REQUIREMENTS.PITCH_DECK) ? makeSubmissionFetcher(SUBMISSION_REQUIREMENTS.PITCH_DECK) : undefined}
                />
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end mx-auto p-4 sm:p-6 w-full max-w-[95%]">
              <Button variant="primary" size="lg" className="w-full mx-auto" onClick={submitFinal} disabled={submitting || !inFinal}>
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
