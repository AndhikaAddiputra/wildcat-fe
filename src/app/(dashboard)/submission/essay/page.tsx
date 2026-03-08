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

export default function EssaySubmissionPage() {
  const [submitting, setSubmitting] = useState(false);
  const [abstract, setAbstract] = useState<File | null>(null);
  const [fullEssay, setFullEssay] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!abstract || !fullEssay) {
      alert("Please select files for both Abstract and Full Essay.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("abstract", abstract);
      formData.append("full_essay", fullEssay);
      const res = await fetch("/api/submission/essay", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      alert("Submitted successfully.");
    } catch {
      alert("Failed to submit. Please try again.");
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
                <div className="flex flex-col md:flex-row md:justify-between gap-4 w-full max-w-[95%] mx-auto">
                  <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                    <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Abstract*</span>
                    <FileUploadZone value={abstract} onChange={setAbstract} className="flex-1 min-h-0" zoneClassName="min-h-[240px] flex-1" />
                  </div>
                  <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                    <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Full Essay*</span>
                    <FileUploadZone value={fullEssay} onChange={setFullEssay} className="flex-1 min-h-0" zoneClassName="min-h-[240px] flex-1" />
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-end mx-auto p-4 sm:p-6 w-full max-w-[95%]">
                <Button variant="primary" size="lg" className="w-full mx-auto" onClick={handleSubmit} disabled={submitting}>
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
