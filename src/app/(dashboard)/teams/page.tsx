"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Button,
  CardLarge,
  CardHeader,
  CardTitle,
  CardFooter,
  Input,
  Navbar,
  Footer,
  InlineLoader,
  Spinner,
} from "@/components/ui";
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
import { useTeamProfile } from "@/hooks/useTeamProfile";
import { useParticipantDashboard } from "@/hooks/useParticipantDashboard";
import type { TeamProfileResponse } from "@/lib/api/types";

/** International phone (E.164-like): optional +, 8-15 digits total */
const PHONE_REGEX = /^\+?[1-9][0-9]{7,14}$/;

/** Max participants per team per competition */
const MAX_PARTICIPANTS_LIST = [
  { label: "Paper & Poster (PaPos)", max: 3 },
  { label: "GnG Case Study", max: 3 },
  { label: "BCC", max: 3 },
  { label: "Essay", max: 1 },
] as const;

export default function Teams() {
  const { data, loading, error, updateTeam } = useTeamProfile();
  const { data: dashboardData } = useParticipantDashboard();
  const [form, setForm] = useState<Partial<TeamProfileResponse>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isDocumentVerified =
    (dashboardData?.documentVerificationStatus?.toLowerCase() === "verified") ||
    (data?.documentVerificationStatus?.toLowerCase() === "verified");


  useEffect(() => {
    if (data) {
      setForm({
        teamName: data.teamName,
        institution: data.institution,
        phoneNumber: data.phoneNumber,
        lineId: data.lineId,
        leadName: data.leadName,
        leadMajor: data.leadMajor,
        m1Name: data.m1Name,
        m1Major: data.m1Major,
        m2Name: data.m2Name,
        m2Major: data.m2Major,
      });
    }
  }, [data]);

  const handleSave = async () => {
    setSaveError(null);
    const phone = (form.phoneNumber ?? "").trim().replace(/\s/g, "");
    if (phone && !PHONE_REGEX.test(phone)) {
      setSaveError("Invalid phone number format. Use 8-15 digits, for example +628123456789 or +14155552671.");
      toast.error("Invalid phone number format.");
      return;
    }
    setSaving(true);
    try {
      await updateTeam({
        institution: form.institution,
        phoneNumber: form.phoneNumber,
        lineId: form.lineId,
        leadName: form.leadName,
        leadMajor: form.leadMajor,
        m1Name: form.m1Name,
        m1Major: form.m1Major,
        m2Name: form.m2Name,
        m2Major: form.m2Major,
      });
      toast.success("Team data saved successfully.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      setSaveError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof TeamProfileResponse, value: string | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value ?? "" }));
  };

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white">
      <Navbar
        logo={LOGO}
        links={PARTICIPANT_NAV_LINKS}
        activeLink="/teams"
        action={PARTICIPANT_NAV_ACTION}
        mobileAction={PARTICIPANT_NAV_ACTION}
      />

      {/* Hero Section */}
      <section
        className="relative flex pt-36 pb-8 justify-center pt-20"
      >
        <div className="text-left mx-auto w-[80vw]">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Team&apos;s Profile
          </h3>
          <p className="text-2xl font-semibold text-[#F1E1B4]">
            Manage Your Team&apos;s Data & Information
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto px-6 py-12 min-h-[55vw]">
        <section className="w-[80vw]">
          {error && (
            <p className="mb-4 text-center text-red-300">{error}</p>
          )}
          {loading ? (
            <CardLarge className="w-full max-w-full p-10 flex items-center justify-center">
              <InlineLoader text="Loading team data..." size="md" />
            </CardLarge>
          ) : (
          <CardLarge className="w-full max-w-full">
            <CardHeader>
              <CardTitle className="text-[28px] font-bold leading-tight !text-[#F1E1B4] mb-2">
                Team Information
              </CardTitle>
              <div className="mb-6 rounded-xl border border-[#F1E1B4]/30 bg-white/5 p-4">
                <p className="text-[#F1E1B4] font-medium text-sm mb-2">Maximum participants per team:</p>
                <ul className="text-[#F1E1B4]/90 text-sm space-y-1">
                  {MAX_PARTICIPANTS_LIST.map((item) => (
                    <li key={item.label}>
                      {item.label}: {item.max} {item.max === 1 ? "person" : "people"}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Team&apos;s Name*</label>
                  <Input
                    value={form.teamName ?? ""}
                    readOnly
                    placeholder="Enter your team name here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                  <p className="text-xs text-[#FF5B5B] text-right">*Team's name cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">University</label>
                  <Input
                    value={form.institution ?? ""}
                    onChange={(e) => update("institution", e.target.value)}
                    placeholder="Enter your university name here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Phone Number (WhatsApp Available)*</label>
                  <Input
                    value={form.phoneNumber ?? ""}
                    onChange={(e) => update("phoneNumber", e.target.value)}
                    placeholder="+628123456789 or +14155552671"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                  <p className="text-xs text-[#F1E1B4]/70">Format: 8-15 digits (recommended: include country code, e.g. +62, +1, +44)</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Line ID</label>
                  <Input
                    value={form.lineId ?? ""}
                    onChange={(e) => update("lineId", e.target.value)}
                    placeholder="Enter your LINE ID here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
              </div>

              <CardTitle className="text-[28px] font-bold leading-tight !text-[#F1E1B4] mb-6 mt-8">
                Members
              </CardTitle>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Leader&apos;s Name</label>
                  <Input
                    value={form.leadName ?? ""}
                    onChange={(e) => update("leadName", e.target.value)}
                    placeholder="Enter leader's name here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Major</label>
                  <Input
                    value={form.leadMajor ?? ""}
                    onChange={(e) => update("leadMajor", e.target.value)}
                    placeholder="Enter leader's major here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Member 1</label>
                  <Input
                    value={form.m1Name ?? ""}
                    onChange={(e) => update("m1Name", e.target.value)}
                    placeholder="Enter member's name here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Major</label>
                  <Input
                    value={form.m1Major ?? ""}
                    onChange={(e) => update("m1Major", e.target.value)}
                    placeholder="Enter member's major here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Member 2</label>
                  <Input
                    value={form.m2Name ?? ""}
                    onChange={(e) => update("m2Name", e.target.value)}
                    placeholder="Enter member's name here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Major</label>
                  <Input
                    value={form.m2Major ?? ""}
                    onChange={(e) => update("m2Major", e.target.value)}
                    placeholder="Enter member's major here"
                    readOnly={isDocumentVerified}
                    disabled={isDocumentVerified}
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-col justify-center px-10 pb-10 pt-4 gap-2">
              {isDocumentVerified && (
                <p className="text-amber-200 text-sm text-center">
                  Once verified, data cannot be changed.
                </p>
              )}
              {saveError && <p className="text-red-300 text-sm">{saveError}</p>}
              <Button
                variant="primary"
                size="lg"
                className="w-[100%]"
                onClick={handleSave}
                disabled={saving || isDocumentVerified}
              >
                {saving ? <><Spinner size="xs" /> Saving...</> : "Save Changes"}
              </Button>
            </CardFooter>
          </CardLarge>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

