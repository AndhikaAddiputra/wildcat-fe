"use client";

import { useEffect, useCallback, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Calendar, MapPin, User, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Download } from "lucide-react";

export interface ModalTimelineItem {
  label: string;
  date: string;
  isActive?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
  variant?: "event" | "competition";
  description?: ReactNode;
  eventName?: string;
  eventDescription?: string;
  eventDate?: string;
  eventPlace?: string;
  eventSpeaker?: string;
  timeline?: ModalTimelineItem[];
  /** URL gambar yang ditampilkan di atas judul (hanya untuk variant="competition") */
  competitionImageUrl?: string;
  /** URL guidebook untuk tombol Download (variant="competition") */
  guidebookUrl?: string;
  /** Status event untuk variant="event": available | not_started | ended. Register Now disabled jika bukan available. */
  eventStatus?: "available" | "not_started" | "ended";
  /** URL RSVP/registrasi event (jika ada, tombol Register Now buka link ini; jika tidak, ke /register) */
  eventRegistrationUrl?: string;
}

function Modal({ 
  isOpen, 
  onClose, 
  children, 
  className, 
  variant = "event", 
  description,
  eventName,
  eventDescription,
  eventDate,
  eventPlace,
  eventSpeaker = "Soon to be announced",
  timeline = [],
  competitionImageUrl,
  guidebookUrl,
  eventStatus,
  eventRegistrationUrl,
}: ModalProps) {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

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

  useEffect(() => {
    if (variant !== "event" || !eventDate || !isOpen) {
      setCountdown(null);
      return;
    }
    const parseEventEndDate = (dateStr: string): Date | null => {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return null;
      d.setHours(23, 59, 59, 999);
      return d;
    };
    const endDate = parseEventEndDate(eventDate);
    if (!endDate) {
      setCountdown(null);
      return;
    }
    const tick = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [variant, eventDate, isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      
      <div className={cn(
        "relative z-[100] w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-zinc-800 bg-[#0A2d6e] text-white shadow-2xl",
        className
      )}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 p-1.5 text-[#f6911e] hover:text-white transition-colors" aria-label="Tutup">
          <X className="h-8 w-8" />
        </button>

        <div className="p-8">
          {description}
          {variant === "competition" && (
            <div className="mb-4 flex justify-start">
              {competitionImageUrl ? (
                <img
                  src={competitionImageUrl}
                  alt=""
                  className="h-18 w-18 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-[#F6911E] bg-[#0A2d6e] text-[#F6911E]">
                  <ImageOff className="h-10 w-10" />
                </div>
              )}
            </div>
          )}
          <div className="mb-4">
              <h2 className="text-2xl font-bold mb-4 text-[#f1e1b4]">{eventName}</h2>
              <p className="flex text-sm text-[#f1e1b4] text-justify">{eventDescription}</p>
            </div>

          {variant === "event" && (
            <>
              {/* --- Countdown Section (aktif, target = eventDate end of day) --- */}
              <div className="mt-6 mb-6">
                <p className="text-md font-semibold mb-3 text-[#f1e1b4]">Countdown to Event</p>
                {countdown !== null ? (
                  <div className="flex items-center justify-center gap-4">
                    {[
                      { value: countdown.days, label: "Days" },
                      { value: countdown.hours, label: "Hours" },
                      { value: countdown.minutes, label: "Minutes" },
                      { value: countdown.seconds, label: "Seconds" },
                    ].map((item, idx) => (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold tracking-widest text-[#f1e1b4] tabular-nums">
                            {String(item.value).padStart(2, "0")}
                          </p>
                          <p className="text-[10px] text-[#f6911e] uppercase">{item.label}</p>
                        </div>
                        {idx < 3 && <p className="text-2xl font-bold pb-4 text-[#f1e1b4]">:</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#f1e1b4]/80">Date TBA</p>
                )}
              </div>

            
              <div className="space-y-6 mb-8">
                <p className="text-md font-semibold text-[#f1e1b4] mb-5">Event Details</p>
                
                {eventDate && (
                  <div className="flex items-start gap-4">
                    <div className="bg-[#E67E22] p-2 rounded-full shrink-0"><Calendar className="h-5 w-5 text-[#0a2d6e]" /></div>
                    <div>
                      <p className="text-xs text-[#f1e1b4]">Datetime</p>
                      <p className="text-sm text-[#f1e1b4]">{eventDate}</p>
                    </div>
                  </div>
                )}

                {eventPlace && (
                  <div className="flex items-start gap-4">
                    <div className="bg-[#E67E22] p-2 rounded-full shrink-0"><MapPin className="h-5 w-5 text-[#0a2d6e]" /></div>
                    <div>
                      <p className="text-xs text-[#f1e1b4] ">Place</p>
                      <p className="text-sm text-[#f1e1b4]">{eventPlace}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="bg-[#E67E22] p-2 rounded-full shrink-0"><User className="h-5 w-5 text-[#0a2d6e]" /></div>
                  <div>
                    <p className="text-xs text-[#f1e1b4] ">Key Speaker</p>
                    <p className="text-sm text-[#f1e1b4]">{eventSpeaker}</p>
                  </div>
                </div >
                <div className="flex flex-col gap-3 mt-8">
                {eventStatus === "available" ? (
                  eventRegistrationUrl ? (
                    <a href={eventRegistrationUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="primary" className="w-full">Register Now</Button>
                    </a>
                  ) : (
                    <Link href="/register" className="block">
                      <Button variant="primary" className="w-full">Register Now</Button>
                    </Link>
                  )
                ) : (
                  <Button variant="primary" disabled className="w-full">Register Now</Button>
                )}
                  </div>
              </div>
            </>
          )}

          {variant === "competition" && (
            <div className="mt-3 mb-6">
              <h3 className="text-md font-semibold text-[#f1e1b4] mb-6 flex items-center gap-2"> Timeline
              </h3>
              
              <div className="relative space-y-6">
                {/* Garis Vertikal Timeline:
                  left-[11px] didapat dari (lebar buletan 24px / 2) - (lebar garis 2px / 2) = 11px
                */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white" />
                
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-10"> {/* pl-10 memberikan ruang untuk h-6 */}
                    {/* Titik Timeline:
                      Ukuran h-6 w-6 (24px) sesuai permintaan.
                      border-[#0A2d6e] disesuaikan agar menyatu dengan background modal.
                    */}
                    <div className={cn(
                      "absolute left-0 top-0.5 h-6 w-6 rounded-full border-2 border-[#0A2d6e] shadow-sm",
                      item.isActive ? "bg-[#f6911e]" : "bg-zinc-600"
                    )} />
                    
                    <div className="flex flex-col justify-center min-h-[24px]">
                      <p className="text-sm font-bold text-[#f1e1b4] leading-tight">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#f1e1b4]/70">
                        {item.date}
                      </p>
                    </div>
                    
                  </div>
                ))}
                
              </div>
              <div className="flex flex-col gap-3 mt-8">
                    <Button
                      variant="outline"
                      className="w-full border-[#f6911e] text-[#f6911e] hover:bg-[#f6911e] hover:text-white"
                      onClick={() => guidebookUrl && window.open(guidebookUrl, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                      Download Guidebook
                    </Button>
                    <Link href="/register" className="block">
                      <Button variant="primary" className="w-full">Register Now</Button>
                    </Link>
                  </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}

export { Modal };