"use client";

import { useState, useCallback, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAllContactGroups,
  buildLineUrl,
  type ContactPerson,
} from "@/lib/constants/contact";

export function ContactFAB() {
  const [open, setOpen] = useState(false);
  const groups = getAllContactGroups();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    },
    []
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, handleEscape]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 h-14 px-5 rounded-full shadow-lg transition-all",
          "bg-[#f6911e] text-[#0a2d6e] hover:bg-[#e08000] hover:scale-105",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6911e] focus-visible:ring-offset-2"
        )}
        aria-label="Any Questions? Contact person"
      >
        <MessageCircle className="h-6 w-6 shrink-0" />
        <span className="font-semibold text-sm whitespace-nowrap">Any Questions?</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center sm:p-0"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            className={cn(
              "relative z-[61] w-full max-w-sm max-h-[85vh] rounded-2xl border border-zinc-700 bg-[#0a2d6e] text-white shadow-2xl",
              "overflow-hidden flex flex-col"
            )}
          >
            <div className="flex items-center justify-between border-b border-zinc-600 px-4 py-3 shrink-0">
              <h3 className="font-semibold text-[#f1e1b4]">Any Questions?</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1.5 text-[#f1e1b4] hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
              {groups.map((group) => (
                <div key={group.label}>
                  <h4 className="text-sm font-medium text-[#f6911e] mb-1">{group.label}</h4>
                  {group.description && (
                    <p className="text-xs text-[#f1e1b4]/80 mb-2">{group.description}</p>
                  )}
                  <ul className="space-y-2">
                    {group.contacts.map((c) => (
                      <ContactItem key={`${group.label}-${c.id}`} contact={c} onClose={() => setOpen(false)} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ContactItem({
  contact,
  onClose,
}: {
  contact: ContactPerson;
  onClose: () => void;
}) {
  const { name, lineId } = contact;
  const lineUrl = buildLineUrl(lineId);
  const hasLine = lineId && lineId !== "tba";

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-zinc-600 bg-white/5 px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium text-[#f1e1b4] truncate">{name}</p>
        {hasLine && (
          <p className="text-xs text-[#f1e1b4]/70 truncate">
            {lineId.startsWith("@") ? lineId : `@${lineId}`}
          </p>
        )}
      </div>
      {hasLine ? (
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={cn(
            "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            "bg-[#00B900] text-white hover:bg-[#009900]"
          )}
        >
          LINE
        </a>
      ) : (
        <span className="shrink-0 text-xs text-[#f1e1b4]/50">TBA</span>
      )}
    </li>
  );
}
