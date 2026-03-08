"use client";

import { useState } from "react";
import {
  Button,
  CardLarge,
  CardHeader,
  CardTitle,
  CardFooter,
  Navbar,
  Footer,
} from "@/components/ui";
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { useAuth } from "@/hooks/useAuth";
import { uploadFile } from "@/services/upload.service";
import { DOCUMENT_TYPES } from "@/lib/constants/document-types";

export default function GnGSubmissionPage() {
  const { user } = useAuth();
  const teamId = user?.teamId;
  const [submitting, setSubmitting] = useState(false);
  const [technicalEssay, setTechnicalEssay] = useState<File | null>(null);
  const [technicalReport, setTechnicalReport] = useState<File | null>(null);

  const submitPreliminary = async () => {
    if (!technicalEssay) {
      alert("Please select a file for Technical Essay.");
      return;
    }
    if (!teamId) {
      alert("Please log in to submit.");
      return;
    }
    setSubmitting(true);
    try {
      await uploadFile(teamId, DOCUMENT_TYPES.TECHNICAL_ESSAY, technicalEssay);
      alert("Preliminary stage submitted successfully.");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitFinal = async () => {
    if (!technicalReport) {
      alert("Please select a file for Technical Report.");
      return;
    }
    if (!teamId) {
      alert("Please log in to submit.");
      return;
    }
    setSubmitting(true);
    try {
      await uploadFile(teamId, DOCUMENT_TYPES.TECHNICAL_REPORT, technicalReport);
      alert("Final stage submitted successfully.");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <CardLarge className="w-full max-w-full">
              <CardHeader className="p-4 sm:p-6 md:p-8">
                <CardTitle className="w-full max-w-[95%] mx-auto mb-4 text-2xl sm:text-3xl md:text-[36px] font-semibold !text-cream">
                  Preliminary Stage
                </CardTitle>
                <div className="w-full max-w-[95%] min-h-[320px] sm:min-h-[425px] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                  <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Technical Essay*</span>
                  <FileUploadZone value={technicalEssay} onChange={setTechnicalEssay} zoneClassName="flex-1 min-h-[240px] sm:min-h-[300px]" />
                </div>
              </CardHeader>
              <CardFooter className="flex justify-end mx-auto p-4 sm:p-6 w-full max-w-[95%]">
                <Button variant="primary" size="lg" className="w-full mx-auto" onClick={submitPreliminary} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit"}
                </Button>
              </CardFooter>
            </CardLarge>

            <CardLarge className="w-full max-w-full">
              <CardHeader className="p-4 sm:p-6 md:p-8">
                <CardTitle className="w-full max-w-[95%] mx-auto mb-4 text-2xl sm:text-3xl md:text-[36px] font-semibold !text-cream">
                  Final Stage
                </CardTitle>
                <div className="w-full max-w-[95%] min-h-[320px] sm:min-h-[425px] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                  <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Technical Report*</span>
                  <FileUploadZone value={technicalReport} onChange={setTechnicalReport} zoneClassName="flex-1 min-h-[240px] sm:min-h-[300px]" />
                </div>
              </CardHeader>
              <CardFooter className="flex justify-end mx-auto p-4 sm:p-6 w-full max-w-[95%]">
                <Button variant="primary" size="lg" className="w-full mx-auto" onClick={submitFinal} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit"}
                </Button>
              </CardFooter>
            </CardLarge>
        </section>
      </main>

      <Footer />
    </div>
  );
}
