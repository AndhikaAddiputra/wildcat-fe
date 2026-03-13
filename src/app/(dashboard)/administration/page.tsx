"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Clock, ExternalLink, XCircle } from "lucide-react";
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
import { useParticipantDashboard } from "@/hooks/useParticipantDashboard";
import { useTeamProfile } from "@/hooks/useTeamProfile";
import { useUploadedDocuments } from "@/hooks/useUploadedDocuments";
import { useTransaction } from "@/hooks/useTransaction";
import { uploadFiles, UploadResult } from "@/services/upload.service";
import { submitPaymentProof } from "@/services/transaction.service";
import { Spinner } from "@/components/ui";
import { requestPaymentToken } from "@/services/mayar/payment.service";
import { useMayarPaymentStatus } from "@/hooks/useMayarPaymentStatus";
import { DOCUMENT_TYPES } from "@/lib/constants/document-types";
import { deriveTeamStatusFromVerification, TEAM_STATUS } from "@/lib/constants/team-status";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { value: "Bank Transfer", label: "Bank Transfer" },
] as const;

/** URL template frame Twibbon untuk didownload */
const TWIBBON_TEMPLATE_URL = "https://www.twibbonize.com/";
/** URL Instagram Wildcat */
const WILDCAT_INSTAGRAM_URL = "https://www.instagram.com/wildcataapgitb/";
/** URL poster untuk posting di IG Story */
const POSTER_DOWNLOAD_URL = "https://storage.wildcat2026.com/poster";

function PaymentProofPreviewButton() {
  const [loading, setLoading] = useState(false);

  async function handlePreview() {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", { credentials: "include" });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      const inner = (data?.data ?? data) as Record<string, unknown>;
      const signedUrl =
        (inner?.signedUrl as string) ??
        (inner?.signed_url as string) ??
        (inner?.downloadUrl as string) ??
        (inner?.download_url as string) ??
        (inner?.url as string) ??
        (inner?.paymentProofUrl as string) ??
        (inner?.payment_proof_url as string);
      if (signedUrl && typeof signedUrl === "string") {
        window.open(signedUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Could not load preview. Please try again.");
      }
    } catch {
      toast.error("Could not load preview. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-2 border-navy text-navy hover:bg-navy/10"
      onClick={handlePreview}
      disabled={loading}
    >
      {loading ? <Spinner size="xs" /> : <ExternalLink className="h-4 w-4" />}
      {loading ? "Loading…" : "Preview payment proof"}
    </Button>
  );
}

function UploadStatusBadge({
  status,
  error,
}: {
  status?: "idle" | "uploading" | "done" | "error";
  error?: string;
}) {
  if (!status || status === "idle") return null;
    if (status === "uploading")
    return (
      <span className="flex items-center gap-1 text-xs text-navy/70 font-medium">
        <Spinner size="xs" />
        Uploading…
      </span>
    );
  if (status === "done")
    return (
      <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Uploaded
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs text-red-700 font-medium" title={error}>
      <XCircle className="h-3.5 w-3.5" />
      Failed
    </span>
  );
}

export default function Home() {
  const { data: dashboardData, loading: statusLoading } = useParticipantDashboard();
  const { data: teamProfile } = useTeamProfile();
  const teamId = teamProfile?.teamId;
  const { save: saveDoc, clear: clearDoc, get: getDoc } = useUploadedDocuments(teamId);
  const [submitting, setSubmitting] = useState(false);
  // Per-file upload status: "idle" | "uploading" | "done" | "error"
  const [uploadStatus, setUploadStatus] = useState<Record<string, "idle" | "uploading" | "done" | "error">>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  // 1. Upload Documents — File state hanya untuk file baru yang belum diupload
  const [ktmLeader, setKtmLeader] = useState<File | null>(null);
  const [ktmMember1, setKtmMember1] = useState<File | null>(null);
  const [ktmMember2, setKtmMember2] = useState<File | null>(null);
  const [twibbonProof, setTwibbonProof] = useState<File | null>(null);
  const [posterIgProof, setPosterIgProof] = useState<File | null>(null);
  // 2. Payment (manual transaction flow)
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0].value);
  const [paymentSubmitStatus, setPaymentSubmitStatus] = useState<"idle" | "requesting" | "uploading" | "submitting" | "done" | "error">("idle");
  const [paymentSubmitError, setPaymentSubmitError] = useState<string>("");

  const { data: transaction, loading: transactionLoading, refetch: refetchTransaction } = useTransaction();
  const { data: mayarStatus, loading: mayarStatusLoading, refetch: refetchMayarStatus, hasPayment: hasMayarPayment, paymentLink: mayarPaymentLink, isLinkValid: isMayarLinkValid, status: mayarStatusValue } = useMayarPaymentStatus();

  const isMayarPayment = transaction?.paymentType?.toLowerCase().includes("mayar") ?? false;
  const mayarPaymentCompleted = hasMayarPayment && ["settlement", "capture", "paid"].includes((mayarStatusValue ?? "").toLowerCase());
  const effectiveVerificationStatus =
    isMayarPayment && mayarPaymentCompleted
      ? "Verified"
      : transaction?.verificationStatus ?? "Pending";

  // Map documentType → fungsi clear File state (untuk reset setelah upload sukses)
  const fileClearMap: Record<string, () => void> = {
    [DOCUMENT_TYPES.LEAD_KTM]: () => setKtmLeader(null),
    [DOCUMENT_TYPES.MEMBER_KTM_1]: () => setKtmMember1(null),
    [DOCUMENT_TYPES.MEMBER_KTM_2]: () => setKtmMember2(null),
    [DOCUMENT_TYPES.PROOF_TWIBBON]: () => setTwibbonProof(null),
    [DOCUMENT_TYPES.PROOF_POSTER_IG]: () => setPosterIgProof(null),
  };

  const status =
    dashboardData?.status ??
    deriveTeamStatusFromVerification(
      teamProfile?.documentVerificationStatus,
      teamProfile?.paymentVerificationStatus
    ) ??
    TEAM_STATUS.REGISTERED;
  const canUsePayment =
    status === TEAM_STATUS.DOCUMENT_VERIFIED || status === TEAM_STATUS.PAID;

  const docVerificationStatus =
    dashboardData?.documentVerificationStatus ??
    teamProfile?.documentVerificationStatus ??
    "";
  const isDocumentRejected =
    docVerificationStatus.toLowerCase() === "rejected";
  const isDocumentVerified =
    docVerificationStatus.toLowerCase() === "verified";
  const documentRejectionNotes =
    dashboardData?.documentRejectionNotes ??
    teamProfile?.documentRejectionNotes ??
    null;

  /** Buat callback fetchSignedUrl lazy untuk dokumen administrasi (GET /upload/:teamId/:documentType). */
  const makeDocFetcher = (documentType: string) => async (): Promise<string> => {
    if (!teamId) throw new Error("Team data has not loaded");
    const res = await fetch(`/api/upload/${encodeURIComponent(teamId)}/${encodeURIComponent(documentType)}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || !data?.data?.signedUrl) {
      throw new Error(data?.error ?? "Failed to get preview URL");
    }
    return data.data.signedUrl as string;
  };

  const handleSubmitDocuments = async () => {
    if (!teamId) {
      toast.error("Your team data has not loaded or you are not logged in. Please reload the page.");
      return;
    }
    if (isDocumentVerified) {
      toast.error("Administrative documents have been verified. Unable to upload new files.");
      return;
    }
    const items: { documentType: string; file: File }[] = [];
    if (ktmLeader) items.push({ documentType: DOCUMENT_TYPES.LEAD_KTM, file: ktmLeader });
    if (ktmMember1) items.push({ documentType: DOCUMENT_TYPES.MEMBER_KTM_1, file: ktmMember1 });
    if (ktmMember2) items.push({ documentType: DOCUMENT_TYPES.MEMBER_KTM_2, file: ktmMember2 });
    if (twibbonProof) items.push({ documentType: DOCUMENT_TYPES.PROOF_TWIBBON, file: twibbonProof });
    if (posterIgProof) items.push({ documentType: DOCUMENT_TYPES.PROOF_POSTER_IG, file: posterIgProof });
    if (items.length === 0) {
      toast.error("At least one document must be uploaded.");
      return;
    }
    setSubmitting(true);
    // Reset status semua file yang akan diupload
    setUploadErrors({});
    setUploadStatus(
      Object.fromEntries(items.map(({ documentType }) => [documentType, "idle"]))
    );
    try {
      const results = await uploadFiles(
        teamId,
        items,
        (documentType, status, error) => {
          setUploadStatus((prev) => ({ ...prev, [documentType]: status }));
          if (error) {
            setUploadErrors((prev) => ({ ...prev, [documentType]: error }));
          }
        }
      );
      const failed = results.filter((r: UploadResult) => !r.success);
      const succeeded = results.filter((r: UploadResult) => r.success);
      // Simpan ke localStorage dan bersihkan File state untuk file yang berhasil
      for (const r of succeeded) {
        if (r.filePath) saveDoc(r.documentType, r.fileName, r.filePath);
        fileClearMap[r.documentType]?.();
      }
      if (failed.length === 0) {
        toast.success(`${succeeded.length} document(s) sent successfully.`);
      } else if (succeeded.length > 0) {
        toast.warning(
          `${succeeded.length} document(s) sent, ${failed.length} failed: ${failed.map((r) => r.documentType).join(", ")}`
        );
      } else {
        toast.error("All documents failed to upload. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const [payWithMayarLoading, setPayWithMayarLoading] = useState(false);
  const handlePayWithMayar = async () => {
    if (!canUsePayment) return;

    if (hasMayarPayment && isMayarLinkValid && mayarPaymentLink) {
      window.location.href = mayarPaymentLink;
      return;
    }

    setPayWithMayarLoading(true);
    try {
      const { link } = await requestPaymentToken();
      await refetchMayarStatus();
      window.location.href = link;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create payment link. Please try again.");
      setPayWithMayarLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!canUsePayment) return;
    if (!paymentProof) {
      toast.error("Please upload payment proof first.");
      return;
    }
    setPaymentSubmitError("");
    setPaymentSubmitStatus("requesting");
    try {
      await submitPaymentProof(paymentProof, paymentMethod, (status) => {
        setPaymentSubmitStatus(status === "requesting" ? "requesting" : status === "uploading" ? "uploading" : "submitting");
      });
      setPaymentSubmitStatus("done");
      setPaymentProof(null);
      await refetchTransaction();
      toast.success("Payment proof has been sent and will be verified.");
    } catch (e) {
      setPaymentSubmitStatus("error");
      setPaymentSubmitError(e instanceof Error ? e.message : "Failed to upload payment proof.");
      toast.error(e instanceof Error ? e.message : "Failed to upload payment proof. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white">
      <Navbar
        logo={LOGO}
        links={PARTICIPANT_NAV_LINKS}
        activeLink="/administration"
        action={PARTICIPANT_NAV_ACTION}
        mobileAction={PARTICIPANT_NAV_ACTION}
      />

      {/* Hero Section */}
      <section className="relative flex pt-36 pb-8 justify-center pt-20 px-4">
        <div className="w-full max-w-6xl mx-auto text-left">
          <h3 className="text-3xl sm:text-4xl md:text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Administration
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#F1E1B4]">
            Complete the registration process here!
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-0">
        <section className="w-full max-w-6xl flex flex-col gap-8 sm:gap-10">
            {isDocumentRejected && (
              <div className="flex items-start gap-3 rounded-xl border-2 border-red-400/80 bg-red-950/40 p-4 text-red-100">
                <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Your administrative documents have been rejected</p>
                  <p className="text-sm">
                    {documentRejectionNotes ||
                      "Your administrative documents do not meet the requirements. Please fix and upload again."}
                  </p>
                </div>
              </div>
            )}
            <CardLarge className={cn("w-full max-w-full min-h-0", isDocumentVerified && "opacity-90")}>
              <CardHeader className="p-2 sm:p-4 md:p-8">
                {isDocumentVerified && (
                  <div className="flex items-center gap-3 rounded-xl border-2 border-green-400/80 bg-green-950/30 p-4 mb-4 text-green-100">
                    <CheckCircle2 className="h-6 w-6 shrink-0" />
                    <p className="text-sm font-medium">
                      Your administrative documents have been verified. You cannot upload or replace new files.
                    </p>
                  </div>
                )}
                <CardTitle className="w-full max-w-[95%] mx-auto my-6 sm:my-8 text-2xl sm:text-[32px] font-semibold !text-[#F1E1B4]">
                  1. Upload Documents
                </CardTitle>
                <div className="w-full max-w-[95%] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4 sm:p-6">
                  <span className="ml-2 sm:ml-8 my-3 sm:my-4 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Student ID Card</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 w-full">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="!text-md !font-semibold sm:text-base font-medium">Team&apos;s Leader*</span>
                        <UploadStatusBadge status={uploadStatus[DOCUMENT_TYPES.LEAD_KTM]} error={uploadErrors[DOCUMENT_TYPES.LEAD_KTM]} />
                      </div>
                      <FileUploadZone
                        value={ktmLeader} onChange={setKtmLeader} disabled={submitting || isDocumentVerified}
                        uploadedUrl={getDoc(DOCUMENT_TYPES.LEAD_KTM)?.url}
                        uploadedFileName={getDoc(DOCUMENT_TYPES.LEAD_KTM)?.fileName}
                        onClearUploaded={isDocumentVerified ? undefined : () => clearDoc(DOCUMENT_TYPES.LEAD_KTM)}
                        fetchSignedUrl={getDoc(DOCUMENT_TYPES.LEAD_KTM) ? makeDocFetcher(DOCUMENT_TYPES.LEAD_KTM) : undefined}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-md font-semibold sm:text-base font-medium">Member 1 (Optional)</span>
                        <UploadStatusBadge status={uploadStatus[DOCUMENT_TYPES.MEMBER_KTM_1]} error={uploadErrors[DOCUMENT_TYPES.MEMBER_KTM_1]} />
                      </div>
                      <FileUploadZone
                        value={ktmMember1} onChange={setKtmMember1} disabled={submitting || isDocumentVerified}
                        uploadedUrl={getDoc(DOCUMENT_TYPES.MEMBER_KTM_1)?.url}
                        uploadedFileName={getDoc(DOCUMENT_TYPES.MEMBER_KTM_1)?.fileName}
                        onClearUploaded={isDocumentVerified ? undefined : () => clearDoc(DOCUMENT_TYPES.MEMBER_KTM_1)}
                        fetchSignedUrl={getDoc(DOCUMENT_TYPES.MEMBER_KTM_1) ? makeDocFetcher(DOCUMENT_TYPES.MEMBER_KTM_1) : undefined}
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-2">
                        <span className="text-md font-semibold sm:text-base font-medium">Member 2 (Optional)</span>
                        <UploadStatusBadge status={uploadStatus[DOCUMENT_TYPES.MEMBER_KTM_2]} error={uploadErrors[DOCUMENT_TYPES.MEMBER_KTM_2]} />
                      </div>
                      <FileUploadZone
                        value={ktmMember2} onChange={setKtmMember2} disabled={submitting || isDocumentVerified}
                        uploadedUrl={getDoc(DOCUMENT_TYPES.MEMBER_KTM_2)?.url}
                        uploadedFileName={getDoc(DOCUMENT_TYPES.MEMBER_KTM_2)?.fileName}
                        onClearUploaded={isDocumentVerified ? undefined : () => clearDoc(DOCUMENT_TYPES.MEMBER_KTM_2)}
                        fetchSignedUrl={getDoc(DOCUMENT_TYPES.MEMBER_KTM_2) ? makeDocFetcher(DOCUMENT_TYPES.MEMBER_KTM_2) : undefined}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-[95%] mx-auto flex flex-col md:flex-row md:justify-between gap-4 my-4 mb-2">
                  <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                    <div className="ml-2 sm:ml-8 my-3 flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Proof of Posting Twibbon*</span>
                        <UploadStatusBadge status={uploadStatus[DOCUMENT_TYPES.PROOF_TWIBBON]} error={uploadErrors[DOCUMENT_TYPES.PROOF_TWIBBON]} />
                      </div>
                      <p className="text-navy/80 text-sm">
                        Twibbon frames can be downloaded {" "}
                        <a href={TWIBBON_TEMPLATE_URL} target="_blank" rel="noopener noreferrer" className="text-[#0A2D6E] font-medium underline hover:text-[#F6911E]">
                          here
                        </a>
                        .
                      </p>
                    </div>
                    <FileUploadZone
                      value={twibbonProof} onChange={setTwibbonProof} className="flex-1 min-h-0" zoneClassName="min-h-[240px] flex-1" disabled={submitting || isDocumentVerified}
                      uploadedUrl={getDoc(DOCUMENT_TYPES.PROOF_TWIBBON)?.url}
                      uploadedFileName={getDoc(DOCUMENT_TYPES.PROOF_TWIBBON)?.fileName}
                      onClearUploaded={isDocumentVerified ? undefined : () => clearDoc(DOCUMENT_TYPES.PROOF_TWIBBON)}
                      fetchSignedUrl={getDoc(DOCUMENT_TYPES.PROOF_TWIBBON) ? makeDocFetcher(DOCUMENT_TYPES.PROOF_TWIBBON) : undefined}
                    />
                  </div>
                  <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                    <div className="ml-2 sm:ml-8 my-3 flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Proof of Following Wildcat IG Account and Posting Poster on IG Status*</span>
                        <UploadStatusBadge status={uploadStatus[DOCUMENT_TYPES.PROOF_POSTER_IG]} error={uploadErrors[DOCUMENT_TYPES.PROOF_POSTER_IG]} />
                      </div>
                      <p className="text-navy/80 text-sm">
                      Follow Wildcat on Instagram and post the poster on IG Story.{" "}
                        <a href={WILDCAT_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#0A2D6E] font-medium underline hover:text-[#F6911E]">
                          Wildcat Instagram Account
                        </a>
                        {" · "}
                        <a href={POSTER_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="text-[#0A2D6E] font-medium underline hover:text-[#F6911E]">
                          Poster
                        </a>
                      </p>
                    </div>
                    <FileUploadZone
                      value={posterIgProof} onChange={setPosterIgProof} className="flex-1 min-h-0" zoneClassName="min-h-[240px] flex-1" disabled={submitting || isDocumentVerified}
                      uploadedUrl={getDoc(DOCUMENT_TYPES.PROOF_POSTER_IG)?.url}
                      uploadedFileName={getDoc(DOCUMENT_TYPES.PROOF_POSTER_IG)?.fileName}
                      onClearUploaded={isDocumentVerified ? undefined : () => clearDoc(DOCUMENT_TYPES.PROOF_POSTER_IG)}
                      fetchSignedUrl={getDoc(DOCUMENT_TYPES.PROOF_POSTER_IG) ? makeDocFetcher(DOCUMENT_TYPES.PROOF_POSTER_IG) : undefined}
                    />
                    
                  </div>
                  
                </div>
                <p className="w-full max-w-[95%] mx-auto text-[#F1E1B4] text-sm sm:text-base mt-1 mb-1">
                  *Documents must be uploaded
                </p>
              </CardHeader>
              <CardFooter className="flex w-full max-w-[95%] mx-auto pt-2 pb-4 sm:pb-6 px-4 sm:px-6">
                <Button variant="primary" size="lg" className="w-full mx-auto" onClick={handleSubmitDocuments} disabled={submitting || isDocumentVerified}>
                  {submitting ? <><Spinner size="xs" /> Submitting…</> : "Submit"}
                </Button>
              </CardFooter>
            </CardLarge>

            <CardLarge
              className={cn(
                "w-full max-w-full min-h-0 transition-opacity",
                !canUsePayment && "opacity-75"
              )}
            >
              <CardHeader className="p-4 sm:p-6 md:p-8 relative">
                {!canUsePayment && (
                  <div className="absolute inset-0 z-10 rounded-[20px] bg-[#0A2D6E]/80 flex items-center justify-center">
                    <p className="text-[#F1E1B4] font-semibold text-center px-4 max-w-md">
                      {statusLoading
                        ? "Loading status..."
                        : "Verify the documents above first. The payment section will open once your team's documents are verified."}
                    </p>
                  </div>
                )}
                <CardTitle className="w-full max-w-[95%] mx-auto my-4 sm:my-6 text-2xl sm:text-[32px] font-semibold !text-cream">
                  2. Payment Information
                </CardTitle>
                {hasMayarPayment && isMayarLinkValid && mayarStatus && mayarStatus.hasPayment && (
                  <div className="w-full max-w-[95%] mx-auto mb-4 p-4 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-100">
                    <p className="text-sm font-medium">
                      You have a pending payment link.
                      {mayarStatus.secondsRemaining != null && mayarStatus.secondsRemaining > 0 && (
                        <span> Valid for {Math.ceil(mayarStatus.secondsRemaining / 60)} minutes.</span>
                      )}
                    </p>
                  </div>
                )}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full max-w-[95%] mx-auto"
                  disabled={!canUsePayment || payWithMayarLoading || mayarStatusLoading}
                  onClick={handlePayWithMayar}
                >
                  {payWithMayarLoading ? (
                    "Opening Mayar..."
                  ) : hasMayarPayment && isMayarLinkValid ? (
                    "Continue to Mayar Payment"
                  ) : (
                    "Pay Faster With Mayar.id"
                  )}
                </Button>

                <span className="w-full max-w-[95%] my-6 sm:my-8 mx-auto text-center text-cream text-sm sm:text-base">
                    -------------------- OR --------------------
                </span>

                <span className="w-full max-w-[95%] mx-auto text-center text-cream text-sm sm:text-base">
                    Manual payment with transfer through this bank account:
                </span>
                <span className="w-full max-w-[95%] mb-6 sm:mb-8 mx-auto text-center text-cream font-semibold text-sm sm:text-base">
                   0015 3032 3351 (BLU BCA DIGITAL - ALMA ZIKRA SYAFIA)
                </span>

                {/* Manual payment: show transaction status or upload zone */}
                {transactionLoading ? (
                  <div className="w-full max-w-[95%] min-h-[240px] mx-auto flex items-center justify-center rounded-[20px] bg-[#9aa0d6] text-navy">
                    <Spinner size="md" />
                  </div>
                ) : transaction && (effectiveVerificationStatus === "Pending" || effectiveVerificationStatus === "Verified") ? (
                  <div className="w-full max-w-[95%] mx-auto flex flex-col gap-3 rounded-[20px] border-4 border-blue-500 bg-[#9aa0d6] text-navy p-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold">
                        {isMayarPayment ? "Payment via Mayar.id" : "Payment proof submitted"}
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
                        effectiveVerificationStatus === "Verified" && "text-green-700 bg-green-100",
                        effectiveVerificationStatus === "Pending" && "text-amber-700 bg-amber-100"
                      )}>
                        {effectiveVerificationStatus === "Verified" && <CheckCircle2 className="h-4 w-4" />}
                        {effectiveVerificationStatus === "Pending" && <Clock className="h-4 w-4" />}
                        {effectiveVerificationStatus}
                      </span>
                    </div>
                    {transaction.paymentType && (
                      <p className="text-sm text-navy/80">Method: {transaction.paymentType}</p>
                    )}
                    {effectiveVerificationStatus === "Verified" && (
                      <p className="text-sm text-green-700 font-medium">Your payment has been verified.</p>
                    )}
                    <PaymentProofPreviewButton />
                  </div>
                ) : (
                  <>
                    {transaction?.verificationStatus === "Rejected" && transaction?.rejectionNotes && (
                      <div className="flex items-start gap-3 rounded-xl border-2 border-red-400/80 bg-red-950/40 p-4 text-red-100 mb-4">
                        <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Payment proof rejected</p>
                          <p className="text-sm">{transaction.rejectionNotes}</p>
                          <p className="text-sm mt-1">Please upload a new payment proof.</p>
                        </div>
                      </div>
                    )}
                    <div className="w-full max-w-[95%] mx-auto flex flex-col gap-2 mb-2">
                      <label className="text-cream text-sm font-medium">Payment method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-10 px-4 rounded-xl bg-white/10 text-white border border-white/20 outline-none"
                        disabled={!canUsePayment}
                      >
                        {PAYMENT_METHODS.map((pm) => (
                          <option key={pm.value} value={pm.value} className="text-navy">{pm.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full max-w-[95%] min-h-[240px] sm:min-h-[300px] mx-auto flex flex-col rounded-[20px] border-4 border-dashed border-navy bg-[#9aa0d6] text-navy p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <UploadStatusBadge
                          status={
                            paymentSubmitStatus === "requesting" || paymentSubmitStatus === "uploading" || paymentSubmitStatus === "submitting"
                              ? "uploading"
                              : paymentSubmitStatus === "done"
                                ? "done"
                                : paymentSubmitStatus === "error"
                                  ? "error"
                                  : undefined
                          }
                          error={paymentSubmitError}
                        />
                      </div>
                      <FileUploadZone
                        value={paymentProof}
                        onChange={setPaymentProof}
                        zoneClassName="min-h-[200px] flex-1"
                        disabled={!canUsePayment || transaction?.verificationStatus === "Verified"}
                      />
                    </div>
                  </>
                )}
              </CardHeader>
              {(!transaction || transaction.verificationStatus === "Rejected") && (
                <CardFooter className="w-full max-w-[95%] mx-auto my-auto p-4 sm:p-6">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-orange text-orange"
                    onClick={handleVerifyPayment}
                    disabled={
                      !canUsePayment ||
                      !paymentProof ||
                      paymentSubmitStatus === "requesting" ||
                      paymentSubmitStatus === "uploading" ||
                      paymentSubmitStatus === "submitting" ||
                      transaction?.verificationStatus === "Verified"
                    }
                  >
                    {(paymentSubmitStatus === "requesting" || paymentSubmitStatus === "uploading" || paymentSubmitStatus === "submitting")
                      ? <><Spinner size="xs" /> Submitting…</>
                      : "Submit Payment Proof"}
                  </Button>
                </CardFooter>
              )}
            </CardLarge>
        </section>
      </main>

      <Footer />
    </div>
  );
}
