"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, User, Phone, MessageCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildLineUrl } from "@/lib/constants/contact";

export interface TeamDetailData {
  teamId: string;
  teamName: string;
  institution?: string;
  competition?: string;
  phoneNumber?: string;
  lineId?: string;
  leadName?: string;
  leadMajor?: string;
  m1Name?: string;
  m1Major?: string;
  m2Name?: string;
  m2Major?: string;
}

export interface TeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Data tim dari parent (diambil dari /api/admin/teams yang sudah ada) */
  teamData: TeamDetailData | null;
}

export function TeamDetailModal({
  isOpen,
  onClose,
  teamData: data,
}: TeamDetailModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const members: { role: string; name?: string; major?: string }[] = [
    { role: "Leader", name: data?.leadName, major: data?.leadMajor },
    { role: "Member 1", name: data?.m1Name, major: data?.m1Major },
    { role: "Member 2", name: data?.m2Name, major: data?.m2Major },
  ].filter((m) => m.name || m.major);

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-[100] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0A2d6e] text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-1.5 text-[#f6911e] hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-[#f1e1b4] mb-4 pr-8">
            {data?.teamName ?? "Team Detail"}
          </h2>

          {data && (
            <div className="space-y-5">
              {/* Team info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-[#f6911e] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/60">Institution</p>
                    <p className="text-sm text-[#f1e1b4]">{data.institution ?? "-"}</p>
                  </div>
                </div>
                {data.competition && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-[#f6911e] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/60">Competition</p>
                      <p className="text-sm text-[#f1e1b4]">{data.competition}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#f6911e] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/60">Phone Number</p>
                    <p className="text-sm text-[#f1e1b4]">
                      {data.phoneNumber ? (
                        <a
                          href={`tel:${data.phoneNumber}`}
                          className="hover:underline text-blue-300"
                        >
                          {data.phoneNumber}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-[#f6911e] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/60">LINE ID</p>
                    <p className="text-sm text-[#f1e1b4]">
                      {data.lineId ? (
                        <a
                          href={buildLineUrl(data.lineId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-300"
                        >
                          {data.lineId}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div>
                <h3 className="text-sm font-semibold text-[#f1e1b4] mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Team Members
                </h3>
                <div className="space-y-2">
                  {members.length > 0 ? (
                    members.map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                        )}
                      >
                        <p className="text-xs text-white/50">{m.role}</p>
                        <p className="text-sm font-medium text-[#f1e1b4]">
                          {m.name ?? "-"}
                        </p>
                        {m.major && (
                          <p className="text-xs text-white/70">{m.major}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/50 italic">No member data</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
