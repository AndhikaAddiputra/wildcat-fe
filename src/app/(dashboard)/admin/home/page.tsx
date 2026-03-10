"use client";

import { useEffect, useState } from "react";
import {
  Navbar,
  Footer,
  Button,
  CardLarge,
} from "@/components/ui";
import { LOGO, ADMIN_NAV_LINKS, ADMIN_NAV_ACTION } from "@/config/navbar-config";
import { Users, Download, Pencil } from "lucide-react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";


const getShortCompetitionName = (dbName: string) => {
  if (!dbName) return "Kompetisi";
  const lowerName = dbName.toLowerCase();
  if (lowerName.includes("paper") || lowerName.includes("poster")) return "Paper & Poster";
  if (lowerName.includes("business") || lowerName.includes("bcc")) return "Business Case";
  if (lowerName.includes("gng") || lowerName.includes("geology")) return "GnG Case Study";
  if (lowerName.includes("essay") || lowerName.includes("esai")) return "Essay";
  return dbName.length > 20 ? dbName.substring(0, 20) + "..." : dbName;
};
// ---------------------------------

export default function AdminStatisticsPage() {
  const [adminName, setAdminName] = useState("Admin");
  const [competitionsData, setCompetitionsData] = useState<any>({ competitions: [], grandTotal: 0 });
  const [eventsData, setEventsData] = useState<any>({ events: [], grandTotals: { registeredCount: 0, attendedCount: 0 } });
  
  // STATE BARU UNTUK TRACKER GRAFIK
  const [curvesData, setCurvesData] = useState<any[]>([]);
  const [chartMode, setChartMode] = useState<"competition" | "events">("competition");
  
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const meRes = await fetchWithAuth("/api/admin/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.success && meData.committee?.name) {
          setAdminName(meData.committee.name);
        }
      }

      const metricsRes = await fetchWithAuth("/api/admin/metrics");
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        if (metricsData.success) {
          setCompetitionsData(metricsData.competitions || { competitions: [], grandTotal: 0 });
          setEventsData(metricsData.events || { events: [], grandTotals: { registeredCount: 0, attendedCount: 0 } });
          
          // SET DATA KURVA (Aman jika BE membungkusnya dalam property lagi atau array langsung)
          const fetchedCurves = metricsData.curves?.registrationCurves || metricsData.curves || [];
          setCurvesData(Array.isArray(fetchedCurves) ? fetchedCurves : []);
        }
      }
    } catch (error) {
      console.error("Gagal memuat data statistik:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const safeCompetitions = Array.isArray(competitionsData.competitions) ? competitionsData.competitions : [];
  const safeEvents = Array.isArray(eventsData.events) ? eventsData.events : [];
  
  const totalCompParticipants = competitionsData.grandTotal || 0;
  const totalEventParticipants = eventsData.grandTotals?.registeredCount || 0;

  const handleEditAttendance = async (eventId: string, currentPresent: number) => {
    const newVal = window.prompt("Masukkan jumlah peserta hadir (Present) yang baru:", currentPresent.toString());
    if (newVal === null || newVal.trim() === "") return;

    const attendedCount = parseInt(newVal, 10);
    if (isNaN(attendedCount) || attendedCount < 0) {
      alert("Masukkan angka yang valid!");
      return;
    }

    try {
      const res = await fetchWithAuth("/api/admin/attendance", {
        method: "POST",
        body: JSON.stringify({ eventId, attendedCount }),
      });
      if (res.ok) {
        alert("Attendance data updated successfully!");
        loadData();
      } else {
        alert("Failed to update attendance data.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetchWithAuth("/api/admin/export/metrics-recap");
      if (!res.ok) throw new Error("Gagal mengunduh file");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Wildcat-Metrics-Recap.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Ensure API is available.");
    }
  };


  // ========================================================================
  // 🌟 LOGIKA GRAFIK DINAMIS (MEMBACA DARI BACKEND)
  // ========================================================================
  // Format raw curves menjadi format chart { day, value }
  const formattedChartData = curvesData.map((curve) => {
    // Ubah "2024-01-15" menjadi format tanggal yang lebih cantik misal "15 Jan"
    const dateObj = new Date(curve.date);
    const dayLabel = isNaN(dateObj.getTime()) ? curve.date : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    return {
      day: dayLabel,
      value: chartMode === "competition" ? curve.cumulativeCompetitionSignups : curve.cumulativeEventSignups
    };
  });

  // Jika data masih kosong (misal API belum punya data harian), buat placeholder agar web tidak crash
  const chartData = formattedChartData.length > 0 ? formattedChartData : [{ day: "No Data", value: 0 }, { day: "Today", value: 0 }];

  // Auto-Scaling: Hitung maxValue agar garis grafik tidak mentok di atas
  const maxDataValue = Math.max(...chartData.map(d => d.value), 10); // Minimal skala adalah 10
  const maxValue = Math.ceil(maxDataValue * 1.2); // Tambah ruang kosong (headroom) 20% di atas grafik

  const width = 1000; 
  const height = 300; 
  const paddingX = 50; 
  const paddingY = 40;
  
  const polylinePoints = chartData.map((d, i) => {
      const x = chartData.length > 1 ? (i / (chartData.length - 1)) * (width - paddingX * 2) + paddingX : width / 2;
      const y = height - (d.value / maxValue) * (height - paddingY * 2) - paddingY;
      return `${x},${y}`;
  }).join(' ');
  
  const todayIndex = chartData.length - 1; // Titik terakhir dianggap data terbaru (Today)
  const todayX = chartData.length > 1 ? (todayIndex / (chartData.length - 1)) * (width - paddingX * 2) + paddingX : width / 2;
  const todayValue = chartData[todayIndex]?.value || 0;
  const todayY = height - (todayValue / maxValue) * (height - paddingY * 2) - paddingY;
  const totalPoints = chartData.length;
  let labelIndices: number[] = [];
  if (totalPoints <= 5) {
    labelIndices = chartData.map((_, i) => i);
  } else {
    labelIndices = [
      0, // Titik pertama (paling kiri)
      Math.floor((totalPoints - 1) * 0.25), // Titik 25%
      Math.floor((totalPoints - 1) * 0.5),  // Titik 50% (Tengah)
      Math.floor((totalPoints - 1) * 0.75), // Titik 75%
      totalPoints - 1 // Titik terakhir (Today / paling kanan)
    ];
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0A2D6E]">
        <p className="text-[#F6911E] text-2xl animate-pulse">Loading Statistics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-['Poppins']">
      <div className="relative min-h-screen bg-[#0A2D6E]">
        <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: "url('/background-home.svg')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <Navbar logo={LOGO} links={ADMIN_NAV_LINKS} activeLink="/admin/home" action={ADMIN_NAV_ACTION} mobileAction={ADMIN_NAV_ACTION} />

        <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-20">
          <section className="mb-10">
            <h1 className="text-4xl font-bold text-[#F6911E] sm:text-5xl">Hello, {adminName}!</h1>
            <p className="mt-2 text-xl text-[#F1E1B4]">Welcome to your personal dashboard</p>
          </section>

          <CardLarge className="p-8 bg-[#0A2D6E]/90 border-[#F6911E]/30 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-[#F1E1B4] mb-8">Wildcat on Statistics</h2>

            {/* Top Grid: Total Partisipan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#3c3c9c] p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[#F6911E] font-bold text-xl">Competitions</span>
                  <Users className="text-[#F6911E] h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="text-6xl font-black text-[#F6911E] mb-2 tracking-tighter">{totalCompParticipants}</p>
                  <p className="text-[#F69e11] text-sm font-semibold">Participants</p>
                </div>
              </div>

              <div className="bg-[#3c3c9c] p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[#F6911E] font-bold text-xl">Events</span>
                  <Users className="text-[#F6911E] h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="text-6xl font-black text-[#F6911E] mb-2 tracking-tighter">{totalEventParticipants}</p>
                  <p className="text-[#F69e11] text-sm font-semibold">Participants</p>
                </div>
              </div>
            </div>

            {/* Tracker Graph */}
            <div className="bg-[#3c3c9c] p-6 rounded-2xl border border-white/5 mb-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#F6911E] font-bold">Participants Tracker</span>
                {/* 🌟 TOMBOL INTERAKTIF */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => setChartMode("competition")}
                    className={`h-7 text-[10px] font-bold transition-colors ${chartMode === "competition" ? "bg-[#F6911E] text-[#0A2D6E]" : "bg-transparent text-white border-white/20 border hover:bg-white/10"}`}
                  >
                    Competition
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setChartMode("events")}
                    className={`h-7 text-[10px] font-bold transition-colors ${chartMode === "events" ? "bg-[#F6911E] text-[#0A2D6E]" : "bg-transparent text-white border-white/20 border hover:bg-white/10"}`}
                  >
                    Events
                  </Button>
                </div>
              </div>

              <div className="relative w-full h-[300px] overflow-x-auto overflow-y-hidden hide-scrollbar">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[600px]" preserveAspectRatio="none">
                  {/* Grid Lines Y Dinamis (Mengikuti Max Value) */}
                  {[0, 0.25, 0.5, 0.75, 1].map((multiplier) => {
                    const tickValue = Math.round(maxValue * multiplier);
                    const y = height - (tickValue / maxValue) * (height - paddingY * 2) - paddingY;
                    return (
                      <g key={multiplier}>
                        <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#F1E1B4" strokeWidth="1" className="opacity-20" />
                        <text x="0" y={y + 4} fill="#F6911e" fontSize="12">{tickValue}</text>
                      </g>
                    );
                  })}
                  
                  {/* Garis Vertikal Titik Terakhir */}
                  <line x1={todayX} y1={paddingY} x2={todayX} y2={height - paddingY} stroke="#F6911E" strokeDasharray="6 4" strokeWidth="2" className="opacity-40" />
                  
                  {/* Garis Data (Polyline) */}
                  <polyline fill="none" stroke="#F6911E" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" points={polylinePoints} />
                  
                  {/* Dot Terakhir */}
                  <circle cx={todayX} cy={todayY} r="8" fill="#F6911E" className="animate-pulse" />
                  <circle cx={todayX} cy={todayY} r="4" fill="white" />
                  
                  {/* Label X-Axis (Tanggal) */}
                  {chartData.map((d, i) => {
                    if (!labelIndices.includes(i)) return null;
                    const x = chartData.length > 1 ? (i / (chartData.length - 1)) * (width - paddingX * 2) + paddingX : width / 2;
                    const isLast = i === chartData.length - 1;
                    return (
                      <text 
                        key={i} x={x} y={height - 5} textAnchor="middle" 
                        fill={isLast ? "#F6911E" : "#F1E1B4"} 
                        fontSize="12" 
                        fontWeight={isLast ? "bold" : "normal"}
                      >
                        {d.day}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* List Kompetisi */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {safeCompetitions.length > 0 ? safeCompetitions.map((comp, idx) => (
                <div key={idx} className="bg-[#3c3c9c] p-6 rounded-2xl border border-white/10 text-center">
                  <p className="text-[#F6911E] text-md font-bold mb-3 uppercase">{getShortCompetitionName(comp.competitionName)}</p>
                  <p className="text-6xl font-black text-[#F6911E] mb-3">{comp.teamCount || 0}</p>
                  <p className="text-[#F6911e] text-sm">Team Registered</p>
                </div>
              )) : (
                <p className="text-white col-span-4 text-center py-4">No competition data.</p>
              )}
            </div>

            {/* List Events */}
            <div className="space-y-4 mb-10">
              {safeEvents.length > 0 ? safeEvents.map((event, idx) => (
                <div key={idx} className="bg-[#3c3c93] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between border border-white/5">
                  <div className="w-full md:w-auto mb-4 md:mb-0">
                    <p className="text-[#F6911E] font-bold text-md">{event.name}</p>
                    <p className="text-[#F6911E] text-sm">Event</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full md:w-auto">
                    <div className="flex items-center justify-end gap-3 w-full md:w-32"> 
                      <span className="text-[#F6911E] text-3xl font-black">{event.registeredCount || 0}</span>
                      <Users className="h-10 w-10 text-[#F6911E] flex-shrink-0" />
                    </div>

                    <div className="flex items-center justify-end gap-3 w-full md:w-64">
                      <span className="text-[#F6911E] text-3xl font-black">{event.attendedCount || 0}</span>
                      <div className="relative flex-shrink-0">
                        <Users className="h-10 w-10 text-[#F6911E]" />
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full h-2.5 w-2.5 border-2 border-[#1E3A8A]" />
                      </div>
                      <Button 
                        onClick={() => handleEditAttendance(event.id, event.attendedCount || 0)}
                        variant="outline" 
                        className="ml-6 border-2 !border-[#F6911E] !text-[#F6911E] min-w-[100px] hover:bg-[#F6911E] hover:!text-white transition-colors"
                      >
                        <Pencil className="h-4 w-4 mr-2" />Edit
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                 <p className="text-white text-center py-4">No event data.</p>
              )}
            </div>

            <div className="flex flex-col mb-10 md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-[10px] sm:text-xs text-[#F6911e]">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#F6911E]" />
                  <span>Participants Registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Users className="h-5 w-5 text-[#F6911E]" />
                    <div className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full h-1 w-1" />
                  </div>
                  <span>Participants Present (*Click edit to manually update)</span>
                </div>
              </div>
            </div>

            <Button onClick={handleExportData} className="max-width bg-[#F6911E] hover:bg-orange-500 text-[#0A2D6E] font-bold w-full px-12 h-12 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Download className="w-5 h-5" /> Export Data to Excel
            </Button>

          </CardLarge>
        </main>
      </div>
      <Footer />
    </div>
  );
}