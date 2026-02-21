"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { X, Calendar, MapPin, User, Clock} from "lucide-react"; // Import ikon di sini
import { cn } from "@/lib/utils";
import { Button, Badge } from "@/components/ui";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
  variant?: "event" | "competition";
  description?: ReactNode;
  eventDate?: string;
  eventPlace?: string;
  eventSpeaker?: string;
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
  timeline = []
}: ModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className={cn(
        "relative z-50 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A2d6e] text-white shadow-2xl",
        className
      )}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 p-1.5 text-[#f6911e] hover:text-white transition-colors">
          <X className="h-10 w-8" />
        </button>

        <div className="p-8">
          {description}
          <div className="mb-4">
              <h2 className="text-2xl font-bold mb-4 text-[#f1e1b4]">{eventName}</h2>
              <p className=" flex text-sm text-[#f1e1b4] ">{eventDescription}</p>
            </div>

          {variant === "event" && (
            <>
              {/* --- Countdown Section --- */}
              <div className="mt-6 mb-6">
                <p className="text-md font-semibold mb-3 text-[#f1e1b4]">Countdown to Event</p>
                <div className="flex items-center justify-center gap-4">
                  {["Days", "Hours", "Minutes", "Second"].map((label, idx) => (
                    <div key={label} className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold tracking-widest text-[#f1e1b4]">00</p>
                        <p className="text-[10px] text-[#f6911e] uppercase">{label}</p>
                      </div>
                      {idx < 3 && <p className="text-2xl font-bold pb-4">:</p>}
                    </div>
                  ))}
                </div>
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
                </div>
                <Button className="mt-4 w-full bg-[#E67E22] hover:bg-[#D35400] text-white h-12 text-lg font-bold border-none transition-colors">
                    Register Now 
                  </Button>
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
                      "absolute left-0 top-0.5 h-6 w-6 rounded-full border-2[#0A2d6e] shadow-sm",
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
                    <Button variant="outline" className="w-full border-[#f6911e] text-[#f6911e] hover:bg-[#f6911e] hover:text-white">
                      Download Guidebook
                    </Button>
                    <Button className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white h-12 text-lg font-bold border-none transition-colors">
                      Register Now
                    </Button>
                  </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

export { Modal };