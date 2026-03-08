"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Navbar,
  Footer,
  Button,
  CardLarge,
  Badge,
} from "@/components/ui";
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
import { Download } from "lucide-react";

// Tipe untuk status pendaftaran
type RegistrationStatus = "Registered" | "Document Verified" | "Paid";

export default function ParticipantHomePage() {
  // Mode simulasi status: Ganti nilai awal ini untuk testing mode berbeda
  const [regStatus, setRegStatus] = useState<RegistrationStatus>("Document Verified");

  const timelineData = [
    { label: "Early Registration", date: "13 - 22 March 2026", active: true },
    { label: "Normal Registration", date: "23 - 31 March 2026", active: false },
    { label: "Abstract Submission", date: "7 April 2026", active: false },
    { label: "Finalist Announcement", date: "25 April 2026", active: false },
    { label: "Final Technical Meeting", date: "2 May 2026", active: false },
  ];

  // Konfigurasi konten Progress Bar berdasarkan mode
  const regConfig = {
    "Registered": {
      width: "5%",
      dotClass: "left-[5%]",
      message: "Immediately complete your documents on Administration page.",
      badge: "pending" as const,
    },
    "Document Verified": {
      width: "52%",
      dotClass: "left-[52%]",
      message: "Pay competition fee for complete your registration process.",
      badge: "verified" as const,
    },
    "Paid": {
      width: "100%",
      dotClass: "right-0",
      message: "Congratulations! Your account is ready to compete",
      badge: "complete" as const,
    },
  };

  const currentReg = regConfig[regStatus];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Area biru + background hanya sampai sebelum footer */}
      <div className="relative min-h-screen bg-[#0A2D6E]">
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/background-home.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Navbar
        logo={LOGO}
        links={PARTICIPANT_NAV_LINKS}
        activeLink="/home"
        action={PARTICIPANT_NAV_ACTION}
        mobileAction={PARTICIPANT_NAV_ACTION}
      />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-20 font-['Poppins']">
        {/* Welcome Section */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-[#F6911E] sm:text-5xl">
            Hello, [Leader's Name]!
          </h1>
          <p className="text-2xl font-semibold text-[#F1E1B4]">
            Welcome to your personal dashboard
          </p>
        </section>

        <div className="flex flex-col gap-8">
          {/* Competition Info Card */}
          <CardLarge className="min-h-0 h-[150px] flex flex-row items-center justify-between p-8 bg-[#0A2D6E]/80 backdrop-blur-sm border-[#F6911E]">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 border-2 border-[#F6911E] flex items-center justify-center rounded">
                  <div className="h-6 w-6 border-2 border-[#F6911E] rotate-45" />
               </div>
               <h2 className="text-l font-bold text-[#f1e1b4] tracking-wide">[Competition_Name] Competition</h2>
            </div>
            <Button variant="primary" size="lg" className="flex gap-2">
              <Download className="h-5 w-5" />
              Download Guidebook
            </Button>
          </CardLarge>

          {/* Competition Timeline Card */}
          <CardLarge className="p-10 bg-[#96a0d2] border-white/20">
            <h3 className="mb-10 text-2xl font-bold text-[#0A2D6E]">Competition's Timeline</h3>
            
            {/* Wrapper untuk Scroll Horizontal */}
            <div className="w-full overflow-x-auto pb-10 no-scrollbar"> 
              {/* Kontainer dengan lebar minimum agar bisa di-scroll jika layar sempit */}
              <div className="relative min-w-[800px] px-15 py-15"> 
                
                {/* Garis Horizontal Putih */}
                <div className="absolute left-15 right-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-white" />

                <div className="relative flex justify-between">
                  {timelineData.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        {/* Kontainer Teks */}
                        <div 
                          className={cn(
                            "absolute flex flex-col items-center w-40 text-center",
                            isEven ? "bottom-full mb-3" : "top-full mt-3"
                          )}
                        >
                          <p className="text-sm font-semibold text-[#0A2D6E] leading-tight">
                            {item.label}
                          </p>
                          <p className="text-xs text-[#0A2D6E] font-medium">
                            {item.date}
                          </p>
                        </div>

                        {/* Bulatan (Dot) */}
                        <div 
                          className={cn(
                            "h-7 w-7 rounded-full border-4 border-[#3c3c9c] z-10 transition-colors bg-[#3c3c9c]",
                            item.active && "shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                          )} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardLarge>

          {/* Team Status Card */}
          <CardLarge className="p-10 bg-[#0A2D6E]/95 border-none shadow-[0_0_15px_rgba(246,145,30,0.3)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#f1e1b4] tracking-wider">[Team_Name]</h2>
              <Badge variant={currentReg.badge}>
                {regStatus === "Document Verified" ? "Verified" :regStatus}
              </Badge>
            </div>
            
            {/* Progress Bar Area */}
            <div className="relative mt-12 mb-12">
              <div className="flex justify-between mb-4 text-xs font-bold uppercase tracking-widest">
                <span className={regStatus === "Registered" ? "text-orange-400" : "text-zinc-500"}>Registered</span>
                <span className={regStatus === "Document Verified" ? "text-orange-400" : "text-zinc-500"}>Document Verified</span>
                <span className={regStatus === "Paid" ? "text-green-400" : "text-zinc-500"}>Paid</span>
              </div>
              
              <div className="relative h-[8px] w-full bg-zinc-800 rounded-full">
                {/* Progress Fill */}
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 bg-gradient-to-r",
                    regStatus === "Paid" ? "from-zinc-500 to-green-500" : "from-zinc-500 to-orange-400"
                  )}
                  style={{ width: currentReg.width }}
                />
                {/* Progress Dot Handle */}
                <div 
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-[3px] border-[#0A2D6E] bg-white transition-all duration-1000 z-20",
                    regStatus === "Paid" ? "right-0" : currentReg.dotClass + " -translate-x-1/2",
                    regStatus === "Paid" ? "bg-green-400" : "bg-orange-400"
                  )}
                />
              </div>
            </div>

            <p className="text-center text-sm font-medium text-[#F1E1B4] tracking-wide">
              {currentReg.message}
            </p>

            {/* Selector untuk Testing Mode (Opsional) */}
            <div className="flex justify-center gap-2 mt-4 opacity-10 hover:opacity-100 transition-opacity">
              <button onClick={() => setRegStatus("Registered")} className="text-[10px] text-white">Mode 1</button>
              <button onClick={() => setRegStatus("Document Verified")} className="text-[10px] text-white">Mode 2</button>
              <button onClick={() => setRegStatus("Paid")} className="text-[10px] text-white">Mode 3</button>
            </div>
          </CardLarge>

          {/* Announcement Card */}
          <CardLarge className="min-h-0 h-[150px] bg-[#96a0d2]/90 overflow-hidden border-none">
            <div className="bg-[#0A2D6E] px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-[#f1e1b4] tracking-wide">Announcement</h3>
            </div>
            <div className="flex flex-col justify-center items-center h-full pb-15">
              <p className="text-[#0A2D6E] font-semibold italic">No announcements at this time.</p>
            </div>
          </CardLarge>
        </div>
      </main>
      </div>

      <Footer />
    </div>
  );
}